import mongoose, { HydratedDocument } from 'mongoose';
export type FileCommentDocument = HydratedDocument<FileComment>;
export declare class FileComment {
    fileId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    text: string;
}
export declare const FileCommentSchema: mongoose.Schema<FileComment, mongoose.Model<FileComment, any, any, any, any, any, FileComment>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, FileComment, mongoose.Document<unknown, {}, FileComment, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<FileComment & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    fileId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, FileComment, mongoose.Document<unknown, {}, FileComment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<FileComment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    authorId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, FileComment, mongoose.Document<unknown, {}, FileComment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<FileComment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    text?: mongoose.SchemaDefinitionProperty<string, FileComment, mongoose.Document<unknown, {}, FileComment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<FileComment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, FileComment>;
