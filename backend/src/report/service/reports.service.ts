import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileEntry, FileEntryDocument } from '../../files/schemas/file.schema.js';
import { Share, ShareDocument } from '../../sharing/schemas/share.schema.js';
import { Activity, ActivityDocument } from '../../activity/schemas/activity.schema.js';
import { dateFilter } from '../../common/utils/date-filter.js';
import { Folder, FolderDocument } from '../../folders/schemas/folder.schema.js';
import { adjuntarNombres } from '../../common/utils/resource-names.js';

const lookupUsuario = { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'usuario' } };
const lookupArchivo = { $lookup: { from: 'files', localField: '_id', foreignField: '_id', as: 'archivo' } };

@Injectable()
export class ReportsService {
    
   constructor(
    @InjectModel(FileEntry.name) private readonly files: Model<FileEntryDocument>,
    @InjectModel(Folder.name) private readonly folders: Model<FolderDocument>,
    @InjectModel(Share.name) private readonly shares: Model<ShareDocument>,
    @InjectModel(Activity.name) private readonly activities: Model<ActivityDocument>,
  ) {}

  archivosPorTipo() {
    return this.files.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$fileType', total: { $sum: 1 } } },
      { $project: { _id: 0, tipo: '$_id', total: 1 } },
      { $sort: { total: -1 } },
    ]);
  }

  archivosEnRango(from?: string, to?: string) {
    return this.files.find({ deletedAt: null, ...dateFilter(from, to) })
      .select('name fileType size createdAt ownerId')
      .populate('ownerId', 'firstName lastName')
      .sort({ createdAt: 1 });
  }

  archivosMasOperados(limit = 10) {
    return this.activities.aggregate([
      { $match: { resourceType: 'FILE', resourceId: { $ne: null } } },
      { $group: { _id: '$resourceId', operaciones: { $sum: 1 } } },
      { $sort: { operaciones: -1 } },
      { $limit: limit },
      lookupArchivo,
      { $unwind: '$archivo' },
      { $project: { _id: 0, archivoId: '$_id', nombre: '$archivo.name', operaciones: 1 } },
    ]);
  }

  topUsuariosConArchivos(limit = 10) {
    return this.files.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$ownerId', archivos: { $sum: 1 } } },
      { $sort: { archivos: -1 } },
      { $limit: limit },
      lookupUsuario,
      { $unwind: '$usuario' },
      { $project: { _id: 0, usuarioId: '$_id', nombre: { $concat: ['$usuario.firstName', ' ', '$usuario.lastName'] }, archivos: 1 } },
    ]);
  }

  usuariosConMasRecursosCompartidos(limit = 10) {
    return this.shares.aggregate([
      { $group: { _id: { owner: '$ownerId', tipo: '$resourceType', recurso: '$resourceId' } } },
      { $group: { _id: '$_id.owner', recursos: { $sum: 1 } } },
      { $sort: { recursos: -1 } },
      { $limit: limit },
      lookupUsuario,
      { $unwind: '$usuario' },
      { $project: { _id: 0, usuarioId: '$_id', nombre: { $concat: ['$usuario.firstName', ' ', '$usuario.lastName'] }, recursos: 1 } },
    ]);
  }

  archivosCompartidosConMasUsuarios(limit = 10) {
    return this.shares.aggregate([
      { $match: { resourceType: 'FILE' } },
      { $group: { _id: '$resourceId', usuarios: { $addToSet: '$sharedWithId' } } },
      { $project: { total: { $size: '$usuarios' } } },
      { $sort: { total: -1 } },
      { $limit: limit },
      lookupArchivo,
      { $unwind: '$archivo' },
      { $project: { _id: 0, archivoId: '$_id', nombre: '$archivo.name', total: 1 } },
    ]);
  }

  // CAMBIO: ahora devuelve `resourceName` además del resto de campos
  async compartidosPorUsuario(userId: string) {
    const shares = await this.shares.find({ ownerId: userId })
      .populate('sharedWithId', 'firstName lastName email').sort({ createdAt: -1 });
    return adjuntarNombres(shares, this.files, this.folders);
  }

  async recibidosPorUsuario(userId: string) {
    const shares = await this.shares.find({ sharedWithId: userId })
      .populate('ownerId', 'firstName lastName email').sort({ createdAt: -1 });
    return adjuntarNombres(shares, this.files, this.folders);
  }

  actividadDeUsuario(userId: string, from?: string, to?: string) {
    return this.activities.find({ userId, ...dateFilter(from, to) }).sort({ createdAt: -1 });
  }

  // CAMBIO: el campo del esquema es `actionActivity`, no `action`
  operacionesPorTipo(from?: string, to?: string) {
    return this.activities.aggregate([
      { $match: dateFilter(from, to) },
      { $group: { _id: '$actionActivity', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $project: { _id: 0, tipo: '$_id', total: 1 } },
    ]);
  }

  operacionesPorPeriodo(periodo: 'DIA' | 'MES' = 'DIA', from?: string, to?: string) {
    const formato = periodo === 'MES' ? '%Y-%m' : '%Y-%m-%d';
    return this.activities.aggregate([
      { $match: dateFilter(from, to) },
      { $group: { _id: { $dateToString: { format: formato, date: '$createdAt' } }, total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, periodo: '$_id', total: 1 } },
    ]);
  }

  principalesAcciones(limit = 10) {
    return this.activities.aggregate([
      { $group: { _id: '$actionActivity', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: limit },
      { $project: { _id: 0, accion: '$_id', total: 1 } },
    ]);
  }
}