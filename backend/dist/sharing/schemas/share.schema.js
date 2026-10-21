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
import { Permission, ResourceType } from "../../common/enums/shraing.enum.js";
let Share = class Share {
    ownerId;
    sharedWithId;
    resourceType;
    resourceId;
    permission;
};
__decorate([
    Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose.Types.ObjectId)
], Share.prototype, "ownerId", void 0);
__decorate([
    Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose.Types.ObjectId)
], Share.prototype, "sharedWithId", void 0);
__decorate([
    Prop({ type: String, enum: ResourceType, required: true }),
    __metadata("design:type", String)
], Share.prototype, "resourceType", void 0);
__decorate([
    Prop({ type: mongoose.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose.Types.ObjectId)
], Share.prototype, "resourceId", void 0);
__decorate([
    Prop({ type: String, enum: Permission, required: true }),
    __metadata("design:type", String)
], Share.prototype, "permission", void 0);
Share = __decorate([
    Schema({ timestamps: true, collection: 'shares' })
], Share);
export { Share };
export const ShareSchema = SchemaFactory.createForClass(Share);
ShareSchema.index({ resourceType: 1, resourceId: 1, sharedWithId: 1 }, { unique: true });
ShareSchema.index({ sharedWithId: 1 });
ShareSchema.index({ ownerId: 1 });
//# sourceMappingURL=share.schema.js.map