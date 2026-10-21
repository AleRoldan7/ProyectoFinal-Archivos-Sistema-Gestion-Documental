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
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Share } from '../schemas/share.schema.js';
import { AccessService } from './access.service.js';
import { UserService } from '../../users/service/user-service.service.js';
import { ActivityService } from '../../activity/service/activity.service.js';
import { ActionActivity } from '../../common/enums/action-activity.enum.js';
import { adjuntarNombres } from '../../common/utils/resource-names.js';
import { FileEntry } from '../../files/schemas/file.schema.js';
import { Folder } from '../../folders/schemas/folder.schema.js';
let SharingService = class SharingService {
    shareModel;
    access;
    users;
    activity;
    fileModel;
    folderModel;
    constructor(shareModel, access, users, activity, fileModel, folderModel) {
        this.shareModel = shareModel;
        this.access = access;
        this.users = users;
        this.activity = activity;
        this.fileModel = fileModel;
        this.folderModel = folderModel;
    }
    async share(ownerId, dto) {
        if (dto.userId === ownerId)
            throw new BadRequestException('No puedes compartir un recurso contigo mismo');
        const destination = await this.users.findById(dto.userId);
        if (!destination || !destination.stateUser)
            throw new BadRequestException('El usuario destino no existe o está inactivo');
        const permission = await this.access.effectiveLeave(ownerId, dto.resourceType, dto.resourceId);
        if (permission !== 'OWNER')
            throw new ForbiddenException('Solo el propietario puede compartir este recurso');
        const share = await this.shareModel.findOneAndUpdate({ resourceType: dto.resourceType, resourceId: dto.resourceId, sharedWithId: dto.userId }, { $set: { ownerId, permission: dto.permission } }, { upsert: true, new: true });
        await this.activity.register(ownerId, ActionActivity.SHARE, dto.resourceType, dto.resourceId, dto.permission);
        return share;
    }
    async sharedWithMe(userId) {
        const shares = await this.shareModel.find({ sharedWithId: userId }).populate('ownerId', 'firstName lastName email').sort({ createdAt: -1 });
        return adjuntarNombres(shares, this.fileModel, this.folderModel);
    }
    async sharedByMe(ownerId) {
        const shares = await this.shareModel.find({ ownerId }).populate('sharedWithId', 'firstName lastName email').sort({ createdAt: -1 });
        return adjuntarNombres(shares, this.fileModel, this.folderModel);
    }
    async changePermission(ownerId, id, dto) {
        const share = await this.shareModel.findOneAndUpdate({ _id: id, ownerId }, { $set: { permission: dto.permission } }, { new: true });
        if (!share)
            throw new NotFoundException('Compartición no encontrada');
        await this.activity.register(ownerId, ActionActivity.CHANGE_PERMISSION, 'SHARE', id, dto.permission);
        return share;
    }
    async revoke(ownerId, id) {
        const share = await this.shareModel.findOneAndDelete({ _id: id, ownerId });
        if (!share)
            throw new NotFoundException('Compartición no encontrada');
        await this.activity.register(ownerId, ActionActivity.REVOKE_PERMISSION, 'SHARE', id);
        return { ok: true };
    }
};
SharingService = __decorate([
    Injectable(),
    __param(0, InjectModel(Share.name)),
    __param(4, InjectModel(FileEntry.name)),
    __param(5, InjectModel(Folder.name)),
    __metadata("design:paramtypes", [Model, AccessService,
        UserService, ActivityService,
        Model,
        Model])
], SharingService);
export { SharingService };
//# sourceMappingURL=sharing.service.js.map