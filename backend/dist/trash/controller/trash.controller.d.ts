import { TrashService } from "../service/trash.service.js";
import type { AuthUser } from "../../common/interfaces/auth-user.interface.js";
export declare class TrashController {
    private readonly trashService;
    constructor(trashService: TrashService);
    sendFolder(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
    sendFile(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
    listar(user: AuthUser): Promise<{
        folders: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../folders/schemas/folder.schema.js").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("../../folders/schemas/folder.schema.js").Folder & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../folders/schemas/folder.schema.js").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("../../folders/schemas/folder.schema.js").Folder & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        files: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../files/schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../../files/schemas/file.schema.js").FileEntry & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../files/schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../../files/schemas/file.schema.js").FileEntry & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    restaurarCarpeta(user: AuthUser, id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../folders/schemas/folder.schema.js").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("../../folders/schemas/folder.schema.js").Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../folders/schemas/folder.schema.js").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("../../folders/schemas/folder.schema.js").Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    restaurarArchivo(user: AuthUser, id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../files/schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../../files/schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../files/schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../../files/schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    eliminarCarpeta(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
    eliminarArchivo(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
