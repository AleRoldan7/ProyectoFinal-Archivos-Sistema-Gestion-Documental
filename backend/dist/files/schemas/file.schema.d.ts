import mongoose, { HydratedDocument } from 'mongoose';
import { FileType } from '../../common/enums/files.enum.js';
export type FileEntryDocument = HydratedDocument<FileEntry>;
export declare class FileEntry {
    ownerId: mongoose.Types.ObjectId;
    folderId: mongoose.Types.ObjectId | null;
    name: string;
    fileType: FileType;
    mimeType: string;
    size: number;
    gridFsId: mongoose.Types.ObjectId;
    deletedAt: Date | null;
}
export declare const FileEntrySchema: mongoose.Schema<FileEntry, mongoose.Model<FileEntry, any, any, any, any, any, FileEntry>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, FileEntry, mongoose.Document<unknown, {}, FileEntry, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<FileEntry & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    ownerId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, FileEntry, mongoose.Document<unknown, {}, FileEntry, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    folderId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | null, FileEntry, mongoose.Document<unknown, {}, FileEntry, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: mongoose.SchemaDefinitionProperty<string, FileEntry, mongoose.Document<unknown, {}, FileEntry, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fileType?: mongoose.SchemaDefinitionProperty<FileType, FileEntry, mongoose.Document<unknown, {}, FileEntry, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mimeType?: mongoose.SchemaDefinitionProperty<string, FileEntry, mongoose.Document<unknown, {}, FileEntry, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    size?: mongoose.SchemaDefinitionProperty<number, FileEntry, mongoose.Document<unknown, {}, FileEntry, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    gridFsId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, FileEntry, mongoose.Document<unknown, {}, FileEntry, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    deletedAt?: mongoose.SchemaDefinitionProperty<Date | null, FileEntry, mongoose.Document<unknown, {}, FileEntry, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<FileEntry & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, FileEntry>;
