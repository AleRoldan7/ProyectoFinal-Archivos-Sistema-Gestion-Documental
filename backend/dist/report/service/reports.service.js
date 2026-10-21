var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileEntry } from '../../files/schemas/file.schema.js';
import { Share } from '../../sharing/schemas/share.schema.js';
import { Activity } from '../../activity/schemas/activity.schema.js';
import { dateFilter } from '../../common/utils/date-filter.js';
import { Folder } from '../../folders/schemas/folder.schema.js';
import { adjuntarNombres } from '../../common/utils/resource-names.js';
const lookupUsuario = { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'usuario' } };
const lookupArchivo = { $lookup: { from: 'files', localField: '_id', foreignField: '_id', as: 'archivo' } };
let ReportsService = class ReportsService {
    files;
    folders;
    shares;
    activities;
    constructor(files, folders, shares, activities) {
        this.files = files;
        this.folders = folders;
        this.shares = shares;
        this.activities = activities;
    }
    archivosPorTipo() {
        return this.files.aggregate([
            { $match: { deletedAt: null } },
            { $group: { _id: '$fileType', total: { $sum: 1 } } },
            { $project: { _id: 0, tipo: '$_id', total: 1 } },
            { $sort: { total: -1 } },
        ]);
    }
    archivosEnRango(from, to) {
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
    async compartidosPorUsuario(userId) {
        const shares = await this.shares.find({ ownerId: userId })
            .populate('sharedWithId', 'firstName lastName email').sort({ createdAt: -1 });
        return adjuntarNombres(shares, this.files, this.folders);
    }
    async recibidosPorUsuario(userId) {
        const shares = await this.shares.find({ sharedWithId: userId })
            .populate('ownerId', 'firstName lastName email').sort({ createdAt: -1 });
        return adjuntarNombres(shares, this.files, this.folders);
    }
    actividadDeUsuario(userId, from, to) {
        return this.activities.find({ userId, ...dateFilter(from, to) }).sort({ createdAt: -1 });
    }
    operacionesPorTipo(from, to) {
        return this.activities.aggregate([
            { $match: dateFilter(from, to) },
            { $group: { _id: '$actionActivity', total: { $sum: 1 } } },
            { $sort: { total: -1 } },
            { $project: { _id: 0, tipo: '$_id', total: 1 } },
        ]);
    }
    operacionesPorPeriodo(periodo = 'DIA', from, to) {
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
};
ReportsService = __decorate([
    Injectable(),
    __param(0, InjectModel(FileEntry.name)),
    __param(1, InjectModel(Folder.name)),
    __param(2, InjectModel(Share.name)),
    __param(3, InjectModel(Activity.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        Model,
        Model])
], ReportsService);
export { ReportsService };
//# sourceMappingURL=reports.service.js.map