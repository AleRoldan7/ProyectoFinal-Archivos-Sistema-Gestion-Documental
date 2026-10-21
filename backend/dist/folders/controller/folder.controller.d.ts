import type { AuthUser } from '../../common/interfaces/auth-user.interface.js';
import { CreateFolderDTO } from '../dto/create-folder.dto.js';
import { RenameFolderDTO } from '../dto/rename-folder.dto.js';
import { MoveFolderDTO } from '../dto/move-folder.dto.js';
import { FolderService } from '../service/folder-service.service.js';
export declare class FolderController {
    private readonly folders;
    constructor(folders: FolderService);
    create(user: AuthUser, dto: CreateFolderDTO): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/folder.schema.js").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/folder.schema.js").Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/folder.schema.js").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/folder.schema.js").Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    list(user: AuthUser, parentId?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/folder.schema.js").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/folder.schema.js").Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/folder.schema.js").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/folder.schema.js").Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getOne(user: AuthUser, id: string): Promise<{
        folder: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/folder.schema.js").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/folder.schema.js").Folder & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/folder.schema.js").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/folder.schema.js").Folder & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
        path: {
            _id: import("mongoose").Types.ObjectId;
            name: string | undefined;
        }[];
    }>;
    rename(user: AuthUser, id: string, dto: RenameFolderDTO): Promise<import("mongoose").Document<unknown, {}, import("../schemas/folder.schema.js").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/folder.schema.js").Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    move(user: AuthUser, id: string, dto: MoveFolderDTO): Promise<import("mongoose").Document<unknown, {}, import("../schemas/folder.schema.js").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/folder.schema.js").Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
