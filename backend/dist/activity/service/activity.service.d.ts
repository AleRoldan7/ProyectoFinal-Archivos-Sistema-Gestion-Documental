import { Model } from "mongoose";
import { ActionActivity, ResourceType } from "../../common/enums/action-activity.enum.js";
import { Activity, ActivityDocument } from "../schemas/activity.schema.js";
export declare class ActivityService {
    private readonly model;
    constructor(model: Model<ActivityDocument>);
    register(userId: string, actionActivity: ActionActivity, resourceType: ResourceType, resourceId?: string | null, detail?: string): Promise<void>;
    consult(f: {
        userId?: string;
        actionActivity?: ActionActivity;
        from?: string;
        to?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Activity, {}, import("mongoose").DefaultSchemaOptions> & Activity & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Activity, {}, import("mongoose").DefaultSchemaOptions> & Activity & {
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
}
