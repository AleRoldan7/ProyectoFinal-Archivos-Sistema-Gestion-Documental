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
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Range_Permission, ResourceType } from "../../common/enums/shraing.enum.js";
import { InjectModel } from "@nestjs/mongoose";
import { Share } from "../schemas/share.schema.js";
import { Folder } from "../../folders/schemas/folder.schema.js";
import { FileEntry } from "../../files/schemas/file.schema.js";
import { Model, Types } from "mongoose";
let AccessService = class AccessService {
    shareModel;
    folderModel;
    fileModel;
    constructor(shareModel, folderModel, fileModel) {
        this.shareModel = shareModel;
        this.folderModel = folderModel;
        this.fileModel = fileModel;
    }
    async effectiveLeave(userId, resourceType, id) {
        const folders = [];
        let ownerId;
        if (resourceType === ResourceType.FILE) {
            const file = await this.fileModel.findById(id).select('ownerId folderId deletedAt');
            if (!file || file.deletedAt)
                return null;
            ownerId = file.ownerId.toString();
            if (file.folderId) {
                const father = await this.folderModel.findById(file.folderId).select('ancestors');
                folders.push(file.folderId, ...(father?.ancestors ?? []));
            }
        }
        else {
            const folder = await this.folderModel.findById(id).select('ownerId ancestors');
            if (!folder)
                return null;
            ownerId = folder.ownerId.toString();
            folders.push(folder._id, ...folder.ancestors);
        }
        if (ownerId === userId)
            return 'OWNER';
        const condiciones = [
            { resourceType: ResourceType.FOLDER, resourceId: { $in: folders } },
        ];
        if (resourceType === ResourceType.FILE) {
            condiciones.push({ resourceType: ResourceType.FILE, resourceId: new Types.ObjectId(id) });
        }
        const shares = await this.shareModel.find({ sharedWithId: userId, $or: condiciones }).select('permission');
        if (!shares.length)
            return null;
        return shares.reduce((mejor, s) => (Range_Permission[s.permission] > Range_Permission[mejor] ? s.permission : mejor), shares[0].permission);
    }
    async require(userId, tipo, id, minimo) {
        const permission = await this.effectiveLeave(userId, tipo, id);
        if (!permission)
            throw new NotFoundException('Recurso no encontrado');
        if (permission === 'OWNER')
            return permission;
        if (Range_Permission[permission] < Range_Permission[minimo]) {
            throw new ForbiddenException('No tienes permiso para realizar esta acción');
        }
        return permission;
    }
};
AccessService = __decorate([
    Injectable(),
    __param(0, InjectModel(Share.name)),
    __param(1, InjectModel(Folder.name)),
    __param(2, InjectModel(FileEntry.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        Model])
], AccessService);
export { AccessService };
//# sourceMappingURL=access.service.js.map