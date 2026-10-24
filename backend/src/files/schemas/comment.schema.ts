import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FileCommentDocument = HydratedDocument<FileComment>;

@Schema({ timestamps: true, collection: 'comments' })
export class FileComment {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'FileEntry', required: true })
    fileId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    authorId: mongoose.Types.ObjectId;

    @Prop({ required: true, trim: true, maxlength: 1000 })
    text: string;
}

export const FileCommentSchema = SchemaFactory.createForClass(FileComment);
FileCommentSchema.index({ fileId: 1, createdAt: 1 });
