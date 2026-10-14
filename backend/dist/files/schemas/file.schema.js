var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { FileType } from '../../common/enums/files.enum.js';
let FileEntry = class FileEntry {
    ownerId;
    folderId;
    name;
    fileType;
    mimeType;
    size;
    gridFsId;
    deletedAt;
};
__decorate([
    Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose.Types.ObjectId)
], FileEntry.prototype, "ownerId", void 0);
__decorate([
    Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }),
    __metadata("design:type", Object)
], FileEntry.prototype, "folderId", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], FileEntry.prototype, "name", void 0);
__decorate([
    Prop({ type: String, enum: FileType, required: true }),
    __metadata("design:type", String)
], FileEntry.prototype, "fileType", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], FileEntry.prototype, "mimeType", void 0);
__decorate([
    Prop({ required: true, min: 0 }),
    __metadata("design:type", Number)
], FileEntry.prototype, "size", void 0);
__decorate([
    Prop({ type: mongoose.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose.Types.ObjectId)
], FileEntry.prototype, "gridFsId", void 0);
__decorate([
    Prop({ type: Date, default: null }),
    __metadata("design:type", Object)
], FileEntry.prototype, "deletedAt", void 0);
FileEntry = __decorate([
    Schema({ timestamps: true, collection: 'files' })
], FileEntry);
export { FileEntry };
export const FileEntrySchema = SchemaFactory.createForClass(FileEntry);
FileEntrySchema.index({ ownerId: 1, folderId: 1, deletedAt: 1 });
FileEntrySchema.index({ ownerId: 1, deletedAt: 1, fileType: 1 });
FileEntrySchema.index({ createdAt: 1 });
//# sourceMappingURL=file.schema.js.map