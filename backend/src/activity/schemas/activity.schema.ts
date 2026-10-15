import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { ActionActivity} from "../../common/enums/action-activity.enum.js";
import type { ResourceType } from "../../common/enums/action-activity.enum.js";

export type ActivityDocument = HydratedDocument<Activity>;

@Schema({ timestamps: true, collection: 'activities' })
export class Activity {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: mongoose.Types.ObjectId;

    @Prop({ type: String, enum: ActionActivity, required: true })
    actionActivity: ActionActivity;

    @Prop({ type: String, required: true })
    resourceType: ResourceType;

    @Prop({ type: mongoose.Schema.Types.ObjectId, default: null })
    resourceId: mongoose.Types.ObjectId | null;

    @Prop({ type: String, default: '' })
    detail: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
ActivitySchema.index({ userId: 1, createdAt: 1 });
ActivitySchema.index({ actionActivity: 1, createdAt: 1 });


