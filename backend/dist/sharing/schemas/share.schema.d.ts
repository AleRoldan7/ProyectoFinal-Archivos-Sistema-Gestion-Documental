import mongoose, { HydratedDocument } from "mongoose";
import { Permission, ResourceType } from "../../common/enums/shraing.enum.js";
export type ShareDocument = HydratedDocument<Share>;
export declare class Share {
    ownerId: mongoose.Types.ObjectId;
    sharedWithId: mongoose.Types.ObjectId;
    resourceType: ResourceType;
    resourceId: mongoose.Types.ObjectId;
    permission: Permission;
}
export declare const ShareSchema: mongoose.Schema<Share, mongoose.Model<Share, any, any, any, any, any, Share>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Share, mongoose.Document<unknown, {}, Share, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Share & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    ownerId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Share, mongoose.Document<unknown, {}, Share, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Share & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sharedWithId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Share, mongoose.Document<unknown, {}, Share, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Share & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resourceType?: mongoose.SchemaDefinitionProperty<ResourceType, Share, mongoose.Document<unknown, {}, Share, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Share & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resourceId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Share, mongoose.Document<unknown, {}, Share, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Share & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    permission?: mongoose.SchemaDefinitionProperty<Permission, Share, mongoose.Document<unknown, {}, Share, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Share & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Share>;
