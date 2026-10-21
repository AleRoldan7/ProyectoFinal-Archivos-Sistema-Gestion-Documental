import { Model } from 'mongoose';
import { Share, ShareDocument } from '../schemas/share.schema.js';
import { AccessService } from './access.service.js';
import { UserService } from '../../users/service/user-service.service.js';
import { ActivityService } from '../../activity/service/activity.service.js';
import { CreateShareDTO, UpdateShareDTO } from '../dto/share.dto.js';
import { FileEntryDocument } from '../../files/schemas/file.schema.js';
import { FolderDocument } from '../../folders/schemas/folder.schema.js';
export declare class SharingService {
    private readonly shareModel;
    private readonly access;
    private readonly users;
    private readonly activity;
    private readonly fileModel;
    private readonly folderModel;
    constructor(shareModel: Model<ShareDocument>, access: AccessService, users: UserService, activity: ActivityService, fileModel: Model<FileEntryDocument>, folderModel: Model<FolderDocument>);
    share(ownerId: string, dto: CreateShareDTO): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Share, {}, import("mongoose").DefaultSchemaOptions> & Share & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Share, {}, import("mongoose").DefaultSchemaOptions> & Share & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    sharedWithMe(userId: string): Promise<any[]>;
    sharedByMe(ownerId: string): Promise<any[]>;
    changePermission(ownerId: string, id: string, dto: UpdateShareDTO): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Share, {}, import("mongoose").DefaultSchemaOptions> & Share & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Share, {}, import("mongoose").DefaultSchemaOptions> & Share & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    revoke(ownerId: string, id: string): Promise<{
        ok: boolean;
    }>;
}
