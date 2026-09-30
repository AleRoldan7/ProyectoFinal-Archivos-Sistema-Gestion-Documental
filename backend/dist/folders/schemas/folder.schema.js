var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
let Folder = class Folder {
    ownerId;
    name;
    parentId;
    ancestors;
    deletedAt;
};
__decorate([
    Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose.Types.ObjectId)
], Folder.prototype, "ownerId", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], Folder.prototype, "name", void 0);
__decorate([
    Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }),
    __metadata("design:type", Object)
], Folder.prototype, "parentId", void 0);
__decorate([
    Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] }),
    __metadata("design:type", Array)
], Folder.prototype, "ancestors", void 0);
__decorate([
    Prop({ type: Date, default: null }),
    __metadata("design:type", Object)
], Folder.prototype, "deletedAt", void 0);
Folder = __decorate([
    Schema({ timestamps: true, collection: 'folders' })
], Folder);
export { Folder };
export const FolderSchema = SchemaFactory.createForClass(Folder);
FolderSchema.index({ ownerId: 1, parentId: 1, deletedAt: 1 });
FolderSchema.index({ ancestors: 1 });
//# sourceMappingURL=folder.schema.js.map