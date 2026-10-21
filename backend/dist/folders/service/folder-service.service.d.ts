import mongoose, { Model } from 'mongoose';
import { Folder, FolderDocument } from '../schemas/folder.schema.js';
import { CreateFolderDTO } from '../dto/create-folder.dto.js';
import { AccessService } from '../../sharing/service/access.service.js';
export declare class FolderService {
    private readonly folderModel;
    private readonly access;
    constructor(folderModel: Model<FolderDocument>, access: AccessService);
    getOwned(ownerId: string, id: string): Promise<FolderDocument>;
    private assertNameFree;
    create(ownerId: string, dto: CreateFolderDTO): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    findChildren(ownerId: string, parentId?: string): Promise<(mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>)[]>;
    getWithPath(ownerId: string, id: string): Promise<{
        folder: mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>;
        path: {
            _id: mongoose.Types.ObjectId;
            name: string | undefined;
        }[];
    }>;
    rename(ownerId: string, id: string, newName: string): Promise<mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    move(ownerId: string, id: string, newParentId: string | null): Promise<mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findById(id: string): mongoose.Query<(mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>) | null, mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, Folder, {}, mongoose.DefaultSchemaOptions> & Folder & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, "findOne", {}>;
}
