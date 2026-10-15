import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Folder, FolderDocument } from "../../folders/schemas/folder.schema.js";
import { Model, Types } from "mongoose";
import { FileEntry, FileEntryDocument } from "../../files/schemas/file.schema.js";
import { GridFsService } from "../../files/service/gridfs-service.service.js";
import { ActivityService } from "../../activity/service/activity.service.js";
import { ActionActivity } from "../../common/enums/action-activity.enum.js";

@Injectable()
export class TrashService {

    constructor(@InjectModel(Folder.name) private readonly folderModel: Model<FolderDocument>,
                @InjectModel(FileEntry.name) private readonly fileModel: Model<FileEntryDocument>,
                private readonly gridFs: GridFsService, private readonly activityService: ActivityService) {}



    /* ENVIOS A LA PAPELERA DE RECICLAJE   */
    async sendFolder(ownerId: string, id: string) {

        const folder = await this.folderModel.findOne({ _id: id, ownerId, deletedAt: null });
        if (!folder) throw new NotFoundException('Carpeta no encontrada');

        const now = new Date();
        const ids = await this.subtreeIds(ownerId, folder._id, { deletedAt: null });
        await this.folderModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: now } });
        await this.fileModel.updateMany({ ownerId, folderId: { $in: ids }, deletedAt: null }, { $set: { deletedAt: now } });

        await this.activityService.register(ownerId, ActionActivity.MOVE_TO_TRASH, 'FILE', folder.id, folder.name);
        return { ok: true };
    }

    async sendFile(ownerId: string, id: string) {

        const file = await this.fileModel.findOne({ _id: id, ownerId, deletedAt: null });
        if (!file) throw new NotFoundException('Archivo no encontrado');

        file.deletedAt = new Date();
        await file.save();
        await this.activityService.register(ownerId, ActionActivity.MOVE_TO_TRASH, 'FILE', file.id, file.name);
        return { ok: true };
    }

    /* LISTAR CARPETAS Y ARCHIVOS */
    async list(ownerId: string) {
        const folders = await this.folderModel.find({ ownerId, deletedAt: { $ne: null } });
        const files = await this.fileModel.find({ ownerId, deletedAt: { $ne: null } }).sort({ deletedAt: -1 });

        const folderIdsInTrash = new Set(folders.map((c) => c.id));

        return {
            folders: folders.filter((c) => !c.parentId || !folderIdsInTrash.has(c.parentId.toString())),
            files: files.filter((a) => !a.folderId || !folderIdsInTrash.has(a.folderId.toString())),
        };
    }

    /* RESTAURAR CARPETAS Y ARCHIVOS */
    async restoredFolder(ownerId: string, id: string) {

        const root = await this.folderModel.findOne({ _id: id, ownerId, deletedAt: { $ne: null } });
        if (!root) throw new NotFoundException('Carpeta no encontrada en la papelera');

        const lote = root.deletedAt;
        const ids = await this.subtreeIds(ownerId, root._id, { deletedAt: lote });

        const padre = root.parentId ? await this.folderModel.findOne({ _id: root.parentId, ownerId, deletedAt: null }) : null;
        const parentId = padre?._id ?? null;
        const prefijo = padre ? [...padre.ancestors, padre._id] : [];

        if (await this.folderModel.exists({ ownerId, parentId, name: root.name, deletedAt: null })) {
            throw new ConflictException('Ya existe una carpeta con ese nombre en el destino; renómbrala antes de restaurar');
        }

        await this.folderModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } });
        await this.folderModel.updateMany(
            { ancestors: root._id },
            [{
                $set: {
                    ancestors: {
                        $concatArrays: [prefijo, { $slice: ['$ancestors', { $indexOfArray: ['$ancestors', root._id] }, 10000] }],
                    },
                },
            }],
        );
        await this.fileModel.updateMany({ ownerId, deletedAt: lote, folderId: { $in: ids } }, { $set: { deletedAt: null } });

        root.set({ deletedAt: null, parentId, ancestors: prefijo });
        await root.save();

        await this.activityService.register(ownerId, ActionActivity.RESTORE, 'FOLDER', root.id, root.name);
        return root;
    }

    async restoredFile(ownerId: string, id: string) {
        
        const file = await this.fileModel.findOne({ _id: id, ownerId, deletedAt: { $ne: null } });
        if (!file) throw new NotFoundException('Archivo no encontrado en la papelera');

        let folderId = file.folderId;
        if (folderId && !(await this.folderModel.exists({ _id: folderId, ownerId, deletedAt: null }))) {
            folderId = null;
        }

        if (await this.fileModel.exists({ ownerId, folderId, name: file.name, deletedAt: null })) {
            throw new ConflictException('Ya existe un archivo con ese nombre en el destino; renómbralo antes de restaurar');
        }

        file.set({ deletedAt: null, folderId });
        await file.save();

        await this.activityService.register(ownerId, ActionActivity.RESTORE, 'FILE', file.id, file.name);
        return file;
    }

    /* ELIMINACION */
    async deleteFolder(ownerId: string, id: string) {

        const root = await this.folderModel.findOne({ _id: id, ownerId, deletedAt: { $ne: null } });
        if (!root) throw new NotFoundException('Carpeta no encontrada en la papelera');

        const ids = await this.subtreeIds(ownerId, root._id, {});
        const files = await this.fileModel.find({ ownerId, folderId: { $in: ids } });

        await Promise.all(files.map((a) => this.gridFs.remove(a.gridFsId)));
        await this.fileModel.deleteMany({ _id: { $in: files.map((a) => a._id) } });
        await this.folderModel.deleteMany({ _id: { $in: ids } });

        await this.activityService.register(ownerId, ActionActivity.PERMANENTLY_DELETE, 'FOLDER', id, root.name);
        return { ok: true };
    }

    async deleteFile(ownerId: string, id: string) {
        const file = await this.fileModel.findOne({ _id: id, ownerId, deletedAt: { $ne: null } });
        if (!file) throw new NotFoundException('Archivo no encontrado en la papelera');

        await this.gridFs.remove(file.gridFsId);
        await file.deleteOne();

        await this.activityService.register(ownerId, ActionActivity.PERMANENTLY_DELETE, 'FILE', id, file.name);
        return { ok: true };
    }

    private async subtreeIds(ownerId: string, rootId: Types.ObjectId, extra: Record<string, unknown>) {
        const docs = await this.folderModel
            .find({ ownerId, ...extra, $or: [{ _id: rootId }, { ancestors: rootId }] })
            .select('_id');
        return docs.map((d) => d._id);
    }
}