import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ActionActivity, ResourceType } from "../../common/enums/action-activity.enum.js";
import { dateFilter } from "../../common/utils/date-filter.js";
import { Activity, ActivityDocument } from "../schemas/activity.schema.js";

@Injectable()
export class ActivityService {

    constructor(@InjectModel(Activity.name) private readonly model: Model<ActivityDocument>) {}

    async register(userId: string, actionActivity: ActionActivity, resourceType: ResourceType, resourceId: string | null = null, detail = '') {

        await this.model.create({ userId, actionActivity, resourceType, resourceId, detail }).catch(() => undefined);
    }

   async consult(f: { userId?: string, actionActivity?: ActionActivity, from?: string; to?: string; page?: number; limit?: number }) {

        const filter: Record<string, unknown> = { ...dateFilter(f.from, f.to) };

        if (f.userId) filter.userId = f.userId;
        if (f.actionActivity) filter.actionActivity = f.actionActivity;

        const page = f.page ?? 1;
        const limit = f.limit ?? 10;
        
        const [items, total] = await Promise.all([
            this.model.find(filter)
                .populate('userId', 'firstName lastName email') 
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            this.model.countDocuments(filter),
        ]);

        return { items, total, page, limit };
    }
}