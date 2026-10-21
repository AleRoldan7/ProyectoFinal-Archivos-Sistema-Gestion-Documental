import { Folder, FolderDocument } from "../../folders/schemas/folder.schema.js";
import { Model, Types } from "mongoose";
import { FileEntry, FileEntryDocument } from "../../files/schemas/file.schema.js";
import { GridFsService } from "../../files/service/gridfs-service.service.js";
import { ActivityService } from "../../activity/service/activity.service.js";
export declare class TrashService {
    private readonly folderModel;
    private readonly fileModel;
    private readonly gridFs;
    private readonly activityService;
    constructor(folderModel: Model<FolderDocument>, fileModel: Model<FileEntryDocument>, gridFs: GridFsService, activityService: ActivityService);
    sendFolder(ownerId: string, id: string): Promise<{
        ok: boolean;
    }>;
    sendFile(ownerId: string, id: string): Promise<{
        ok: boolean;
    }>;
    list(ownerId: string): Promise<{
        folders: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Folder, {}, import("mongoose").DefaultSchemaOptions> & Folder & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Folder, {}, import("mongoose").DefaultSchemaOptions> & Folder & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        files: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, FileEntry, {}, import("mongoose").DefaultSchemaOptions> & FileEntry & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, FileEntry, {}, import("mongoose").DefaultSchemaOptions> & FileEntry & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
    }>;
    restoredFolder(ownerId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Folder, {}, import("mongoose").DefaultSchemaOptions> & Folder & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Folder, {}, import("mongoose").DefaultSchemaOptions> & Folder & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    restoredFile(ownerId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, FileEntry, {}, import("mongoose").DefaultSchemaOptions> & FileEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, FileEntry, {}, import("mongoose").DefaultSchemaOptions> & FileEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    deleteFolder(ownerId: string, id: string): Promise<{
        ok: boolean;
    }>;
    deleteFile(ownerId: string, id: string): Promise<{
        ok: boolean;
    }>;
    private subtreeIds;
}
