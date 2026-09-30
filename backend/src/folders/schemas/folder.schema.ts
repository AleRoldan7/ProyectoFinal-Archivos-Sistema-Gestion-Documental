import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type FolderDocument = HydratedDocument<Folder>;

@Schema({ timestamps: true, collection: 'folders' })
export class Folder {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    ownerId: mongoose.Types.ObjectId;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null })
    parentId: mongoose.Types.ObjectId | null;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] })
    ancestors: mongoose.Types.ObjectId[];

    @Prop({ type: Date, default: null })
    deletedAt: Date | null;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);

FolderSchema.index({ownerId: 1, parentId: 1, deletedAt: 1});
FolderSchema.index({ancestors: 1});
