import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Permission, ResourceType } from "../../common/enums/shraing.enum.js";

export type ShareDocument = HydratedDocument<Share>;

@Schema({ timestamps: true, collection: 'shares' })
export class Share {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    ownerId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    sharedWithId: mongoose.Types.ObjectId;

    @Prop({ type: String, enum: ResourceType, required: true })
    resourceType: ResourceType;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    resourceId: mongoose.Types.ObjectId;

    @Prop({ type: String, enum: Permission, required: true })
    permission: Permission;
}
export const ShareSchema = SchemaFactory.createForClass(Share);
ShareSchema.index({ resourceType: 1, resourceId: 1, sharedWithId: 1 }, { unique: true });
ShareSchema.index({ sharedWithId: 1 });
ShareSchema.index({ ownerId: 1 });