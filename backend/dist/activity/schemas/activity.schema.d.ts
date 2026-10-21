import mongoose, { HydratedDocument } from "mongoose";
import { ActionActivity } from "../../common/enums/action-activity.enum.js";
import type { ResourceType } from "../../common/enums/action-activity.enum.js";
export type ActivityDocument = HydratedDocument<Activity>;
export declare class Activity {
    userId: mongoose.Types.ObjectId;
    actionActivity: ActionActivity;
    resourceType: ResourceType;
    resourceId: mongoose.Types.ObjectId | null;
    detail: string;
}
export declare const ActivitySchema: mongoose.Schema<Activity, mongoose.Model<Activity, any, any, any, any, any, Activity>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Activity, mongoose.Document<unknown, {}, Activity, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Activity & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    userId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Activity, mongoose.Document<unknown, {}, Activity, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Activity & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    actionActivity?: mongoose.SchemaDefinitionProperty<ActionActivity, Activity, mongoose.Document<unknown, {}, Activity, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Activity & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resourceType?: mongoose.SchemaDefinitionProperty<ResourceType, Activity, mongoose.Document<unknown, {}, Activity, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Activity & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resourceId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId | null, Activity, mongoose.Document<unknown, {}, Activity, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Activity & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    detail?: mongoose.SchemaDefinitionProperty<string, Activity, mongoose.Document<unknown, {}, Activity, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Activity & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Activity>;
