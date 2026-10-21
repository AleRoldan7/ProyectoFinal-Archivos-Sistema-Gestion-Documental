import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Share, ShareDocument } from '../schemas/share.schema.js';
import { AccessService } from './access.service.js';
import { UserService } from '../../users/service/user-service.service.js';
import { ActivityService } from '../../activity/service/activity.service.js';
import { CreateShareDTO, UpdateShareDTO } from '../dto/share.dto.js';
import { ActionActivity } from '../../common/enums/action-activity.enum.js';
import { adjuntarNombres } from '../../common/utils/resource-names.js';
import { FileEntry, FileEntryDocument } from '../../files/schemas/file.schema.js';
import { Folder, FolderDocument } from '../../folders/schemas/folder.schema.js';

@Injectable()
export class SharingService {
    
    constructor(@InjectModel(Share.name) private readonly shareModel: Model<ShareDocument>, private readonly access: AccessService,
        private readonly users: UserService, private readonly activity: ActivityService,
        @InjectModel(FileEntry.name) private readonly fileModel: Model<FileEntryDocument>,
        @InjectModel(Folder.name) private readonly folderModel: Model<FolderDocument>) { }

    async share(ownerId: string, dto: CreateShareDTO) {
        if (dto.userId === ownerId) throw new BadRequestException('No puedes compartir un recurso contigo mismo');

        const destination = await this.users.findById(dto.userId);
        if (!destination || !destination.stateUser) throw new BadRequestException('El usuario destino no existe o está inactivo');

        const permission = await this.access.effectiveLeave(ownerId, dto.resourceType, dto.resourceId);
        if (permission !== 'OWNER') throw new ForbiddenException('Solo el propietario puede compartir este recurso');

        const share = await this.shareModel.findOneAndUpdate(
            { resourceType: dto.resourceType, resourceId: dto.resourceId, sharedWithId: dto.userId },
            { $set: { ownerId, permission: dto.permission } },
            { upsert: true, new: true },
        );

        await this.activity.register(ownerId, ActionActivity.SHARE, dto.resourceType, dto.resourceId, dto.permission);
        return share;
    }

    async sharedWithMe(userId: string) {
        const shares = await this.shareModel.find({ sharedWithId: userId }).populate('ownerId', 'firstName lastName email').sort({ createdAt: -1 });
        return adjuntarNombres(shares, this.fileModel, this.folderModel);
    }

    async sharedByMe(ownerId: string) {
        const shares = await this.shareModel.find({ ownerId }).populate('sharedWithId', 'firstName lastName email').sort({ createdAt: -1 });
        return adjuntarNombres(shares, this.fileModel, this.folderModel);
    }

    async changePermission(ownerId: string, id: string, dto: UpdateShareDTO) {
        const share = await this.shareModel.findOneAndUpdate(
            { _id: id, ownerId }, { $set: { permission: dto.permission } }, { new: true },
        );
        if (!share) throw new NotFoundException('Compartición no encontrada');

        await this.activity.register(ownerId, ActionActivity.CHANGE_PERMISSION, 'SHARE', id, dto.permission);
        return share;
    }

    async revoke(ownerId: string, id: string) {
        const share = await this.shareModel.findOneAndDelete({ _id: id, ownerId });
        if (!share) throw new NotFoundException('Compartición no encontrada');

        await this.activity.register(ownerId, ActionActivity.REVOKE_PERMISSION, 'SHARE', id);
        return { ok: true };
    }
}