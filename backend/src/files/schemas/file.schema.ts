import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { FileType } from '../../common/enums/files.enum.js';

export type FileEntryDocument = HydratedDocument<FileEntry>;

@Schema({ timestamps: true, collection: 'files' })
export class FileEntry {
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    ownerId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null })
    folderId: mongoose.Types.ObjectId | null;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ type: String, enum: FileType, required: true })
    fileType: FileType;

    @Prop({ required: true })
    mimeType: string;

    @Prop({ required: true, min: 0 })
    size: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    gridFsId: mongoose.Types.ObjectId;

    @Prop({ type: Date, default: null })
    deletedAt: Date | null;
}

export const FileEntrySchema = SchemaFactory.createForClass(FileEntry);

FileEntrySchema.index({ ownerId: 1, folderId: 1, deletedAt: 1 }); 
FileEntrySchema.index({ ownerId: 1, deletedAt: 1, fileType: 1 });  
FileEntrySchema.index({ createdAt: 1 });                           