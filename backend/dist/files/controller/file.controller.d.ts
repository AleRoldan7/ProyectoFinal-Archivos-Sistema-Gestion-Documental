import { StreamableFile } from '@nestjs/common';
import type { AuthUser } from '../../common/interfaces/auth-user.interface.js';
import { UploadFileDTO } from '../dto/upload-file.dto.js';
import { RenameFileDTO } from '../dto/rename-file.dto.js';
import { MoveFileDTO } from '../dto/move-file.dto.js';
import { FileService } from '../service/file-service.service.js';
import { ListFileQueryDTO } from '../dto/list-file-query.dto.js';
export declare class FileController {
    private readonly files;
    constructor(files: FileService);
    upload(user: AuthUser, file: Express.Multer.File, dto: UploadFileDTO): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    list(user: AuthUser, listFileQueryDto: ListFileQueryDTO): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/file.schema.js").FileEntry & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/file.schema.js").FileEntry & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOne(user: AuthUser, id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    download(user: AuthUser, id: string): Promise<StreamableFile>;
    replaceContent(user: AuthUser, id: string, file: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    rename(user: AuthUser, id: string, dto: RenameFileDTO): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    move(user: AuthUser, id: string, dto: MoveFileDTO): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
