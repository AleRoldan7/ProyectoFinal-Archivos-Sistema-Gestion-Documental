import mongoose, { HydratedDocument, Types } from "mongoose";
export type FolderDocument = HydratedDocument<Folder>;
export declare class Folder {
    ownerId: mongoose.Types.ObjectId;
    name: string;
    parentId: mongoose.Types.ObjectId | null;
    ancestors: mongoose.Types.ObjectId[];
    deletedAt: Date | null;
}
export declare const FolderSchema: mongoose.Schema<Folder, mongoose.Model<Folder, any, any, any, any, any, Folder>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Folder, mongoose.Document<unknown, {}, Folder, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Folder & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    ownerId?: mongoose.SchemaDefinitionProperty<Types.ObjectId, Folder, mongoose.Document<unknown, {}, Folder, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Folder & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: mongoose.SchemaDefinitionProperty<string, Folder, mongoose.Document<unknown, {}, Folder, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Folder & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    parentId?: mongoose.SchemaDefinitionProperty<Types.ObjectId | null, Folder, mongoose.Document<unknown, {}, Folder, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Folder & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    ancestors?: mongoose.SchemaDefinitionProperty<Types.ObjectId[], Folder, mongoose.Document<unknown, {}, Folder, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Folder & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    deletedAt?: mongoose.SchemaDefinitionProperty<Date | null, Folder, mongoose.Document<unknown, {}, Folder, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Folder & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Folder>;
