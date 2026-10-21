import { ActivityService } from "../service/activity.service.js";
import type { AuthUser } from "../../common/interfaces/auth-user.interface.js";
import { ListActivityDTO } from "../dto/list-activity.dto.js";
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    list(user: AuthUser, query: ListActivityDTO): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/activity.schema.js").Activity, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/activity.schema.js").Activity & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/activity.schema.js").Activity, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/activity.schema.js").Activity & {
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
