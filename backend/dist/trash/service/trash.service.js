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
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Folder } from "../../folders/schemas/folder.schema.js";
import { Model } from "mongoose";
import { FileEntry } from "../../files/schemas/file.schema.js";
import { GridFsService } from "../../files/service/gridfs-service.service.js";
import { ActivityService } from "../../activity/service/activity.service.js";
import { ActionActivity } from "../../common/enums/action-activity.enum.js";
let TrashService = class TrashService {
    folderModel;
    fileModel;
    gridFs;
    activityService;
    constructor(folderModel, fileModel, gridFs, activityService) {
        this.folderModel = folderModel;
        this.fileModel = fileModel;
        this.gridFs = gridFs;
        this.activityService = activityService;
    }
    async sendFolder(ownerId, id) {
        const folder = await this.folderModel.findOne({ _id: id, ownerId, deletedAt: null });
        if (!folder)
            throw new NotFoundException('Carpeta no encontrada');
        const now = new Date();
        const ids = await this.subtreeIds(ownerId, folder._id, { deletedAt: null });
        await this.folderModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: now } });
        await this.fileModel.updateMany({ ownerId, folderId: { $in: ids }, deletedAt: null }, { $set: { deletedAt: now } });
        await this.activityService.register(ownerId, ActionActivity.MOVE_TO_TRASH, 'FILE', folder.id, folder.name);
        return { ok: true };
    }
    async sendFile(ownerId, id) {
        const file = await this.fileModel.findOne({ _id: id, ownerId, deletedAt: null });
        if (!file)
            throw new NotFoundException('Archivo no encontrado');
        file.deletedAt = new Date();
        await file.save();
        await this.activityService.register(ownerId, ActionActivity.MOVE_TO_TRASH, 'FILE', file.id, file.name);
        return { ok: true };
    }
    async list(ownerId) {
        const folders = await this.folderModel.find({ ownerId, deletedAt: { $ne: null } });
        const files = await this.fileModel.find({ ownerId, deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
        const folderIdsInTrash = new Set(folders.map((c) => c.id));
        return {
            folders: folders.filter((c) => !c.parentId || !folderIdsInTrash.has(c.parentId.toString())),
            files: files.filter((a) => !a.folderId || !folderIdsInTrash.has(a.folderId.toString())),
        };
    }
    async restoredFolder(ownerId, id) {
        const root = await this.folderModel.findOne({ _id: id, ownerId, deletedAt: { $ne: null } });
        if (!root)
            throw new NotFoundException('Carpeta no encontrada en la papelera');
        const lote = root.deletedAt;
        const ids = await this.subtreeIds(ownerId, root._id, { deletedAt: lote });
        const padre = root.parentId ? await this.folderModel.findOne({ _id: root.parentId, ownerId, deletedAt: null }) : null;
        const parentId = padre?._id ?? null;
        const prefijo = padre ? [...padre.ancestors, padre._id] : [];
        if (await this.folderModel.exists({ ownerId, parentId, name: root.name, deletedAt: null })) {
            throw new ConflictException('Ya existe una carpeta con ese nombre en el destino; renómbrala antes de restaurar');
        }
        await this.folderModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } });
        await this.folderModel.updateMany({ ancestors: root._id }, [{
                $set: {
                    ancestors: {
                        $concatArrays: [prefijo, { $slice: ['$ancestors', { $indexOfArray: ['$ancestors', root._id] }, 10000] }],
                    },
                },
            }], { updatePipeline: true });
        await this.fileModel.updateMany({ ownerId, deletedAt: lote, folderId: { $in: ids } }, { $set: { deletedAt: null } });
        root.set({ deletedAt: null, parentId, ancestors: prefijo });
        await root.save();
        await this.activityService.register(ownerId, ActionActivity.RESTORE, 'FOLDER', root.id, root.name);
        return root;
    }
    async restoredFile(ownerId, id) {
        const file = await this.fileModel.findOne({ _id: id, ownerId, deletedAt: { $ne: null } });
        if (!file)
            throw new NotFoundException('Archivo no encontrado en la papelera');
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
    async deleteFolder(ownerId, id) {
        const root = await this.folderModel.findOne({ _id: id, ownerId, deletedAt: { $ne: null } });
        if (!root)
            throw new NotFoundException('Carpeta no encontrada en la papelera');
        const ids = await this.subtreeIds(ownerId, root._id, {});
        const files = await this.fileModel.find({ ownerId, folderId: { $in: ids } });
        await Promise.all(files.map((a) => this.gridFs.remove(a.gridFsId)));
        await this.fileModel.deleteMany({ _id: { $in: files.map((a) => a._id) } });
        await this.folderModel.deleteMany({ _id: { $in: ids } });
        await this.activityService.register(ownerId, ActionActivity.PERMANENTLY_DELETE, 'FOLDER', id, root.name);
        return { ok: true };
    }
    async deleteFile(ownerId, id) {
        const file = await this.fileModel.findOne({ _id: id, ownerId, deletedAt: { $ne: null } });
        if (!file)
            throw new NotFoundException('Archivo no encontrado en la papelera');
        await this.gridFs.remove(file.gridFsId);
        await file.deleteOne();
        await this.activityService.register(ownerId, ActionActivity.PERMANENTLY_DELETE, 'FILE', id, file.name);
        return { ok: true };
    }
    async subtreeIds(ownerId, rootId, extra) {
        const docs = await this.folderModel
            .find({ ownerId, ...extra, $or: [{ _id: rootId }, { ancestors: rootId }] })
            .select('_id');
        return docs.map((d) => d._id);
    }
};
TrashService = __decorate([
    Injectable(),
    __param(0, InjectModel(Folder.name)),
    __param(1, InjectModel(FileEntry.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        GridFsService, ActivityService])
], TrashService);
export { TrashService };
//# sourceMappingURL=trash.service.js.map