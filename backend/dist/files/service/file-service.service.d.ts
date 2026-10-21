import mongoose, { Model } from 'mongoose';
import { FileEntry, FileEntryDocument } from '../schemas/file.schema.js';
import { GridFsService } from './gridfs-service.service.js';
import { FolderService } from '../../folders/service/folder-service.service.js';
import { ListFileQueryDTO } from '../dto/list-file-query.dto.js';
import { AccessService } from '../../sharing/service/access.service.js';
export declare class FileService {
    private readonly fileModel;
    private readonly gridFs;
    private readonly folders;
    private readonly access;
    constructor(fileModel: Model<FileEntryDocument>, gridFs: GridFsService, folders: FolderService, access: AccessService);
    static decodeName(originalname: string): string;
    private validateUpload;
    getOwned(ownerId?: string, id?: string): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    private assertNameFree;
    upload(ownerId: string, folderId: string | undefined, file: Express.Multer.File | undefined): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    findById(id: string): mongoose.Query<(mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>) | null, mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, "findOne", {}>;
    list(ownerId: string, listFileQueryDto: ListFileQueryDTO): Promise<{
        items: (mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
        total: number;
        page: number;
        limit: number;
    }>;
    download(id: string): Promise<{
        file: mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>;
        stream: mongoose.mongo.GridFSBucketReadStream;
    }>;
    replaceContent(id: string, upload: Express.Multer.File | undefined): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    rename(ownerId: string, id: string, newName: string): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    move(ownerId: string, id: string, folderId: string | null): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<unknown, {}, FileEntry, {}, mongoose.DefaultSchemaOptions> & FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
}
