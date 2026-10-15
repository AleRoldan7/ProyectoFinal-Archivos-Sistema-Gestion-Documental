import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Permission, Range_Permission, ResourceType } from "../../common/enums/shraing.enum.js";
import { InjectModel } from "@nestjs/mongoose";
import { Share, ShareDocument } from "../schemas/share.schema.js";
import { Folder, FolderDocument } from "../../folders/schemas/folder.schema.js";
import { FileEntry, FileEntryDocument } from "../../files/schemas/file.schema.js";
import { Model, Types } from "mongoose";

export type EffectiveLeave = 'OWNER' | Permission;

@Injectable()
export class AccessService {
    constructor(@InjectModel(Share.name) private readonly shareModel: Model<ShareDocument>,
                @InjectModel(Folder.name) private readonly folderModel: Model<FolderDocument>,
                @InjectModel(FileEntry.name) private readonly fileModel: Model<FileEntryDocument>) {}


    async effectiveLeave(userId: string, resourceType: ResourceType, id: string): Promise<EffectiveLeave | null> {
        const folders: Types.ObjectId[] = [];
        let ownerId: string;

        if (resourceType === ResourceType.FILE) {
            const file = await this.fileModel.findById(id).select('ownerId folderId deletedAt');
            if (!file || file.deletedAt) return null;
            ownerId = file.ownerId.toString();
            if (file.folderId) {
                const father = await this.folderModel.findById(file.folderId).select('ancestors');
                folders.push(file.folderId, ...(father?.ancestors ?? []));
            }
        } else {
            const folder = await this.folderModel.findById(id).select('ownerId ancestors');
            if (!folder) return null;
            ownerId = folder.ownerId.toString();
            folders.push(folder._id, ...folder.ancestors);
        }

        if (ownerId === userId) return 'OWNER';

        const condiciones: Record<string, unknown>[] = [
            { resourceType: ResourceType.FOLDER, resourceId: { $in: folders } },
        ];
        if (resourceType === ResourceType.FILE) {
            condiciones.push({ resourceType: ResourceType.FILE, resourceId: new Types.ObjectId(id) });
        }

        const shares = await this.shareModel.find({ sharedWithId: userId, $or: condiciones }).select('permission');
        if (!shares.length) return null;

        return shares.reduce<Permission>(
            (mejor, s) => (Range_Permission[s.permission] > Range_Permission[mejor] ? s.permission : mejor),
            shares[0].permission,
        );
    }

    async require(userId: string, tipo: ResourceType, id: string, minimo: Permission): Promise<EffectiveLeave> {
        const permission = await this.effectiveLeave(userId, tipo, id);
        if (!permission) throw new NotFoundException('Recurso no encontrado');
        if (permission === 'OWNER') return permission;
        if (Range_Permission[permission] < Range_Permission[minimo]) {
            throw new ForbiddenException('No tienes permiso para realizar esta acción');
        }
        return permission;
    }
}