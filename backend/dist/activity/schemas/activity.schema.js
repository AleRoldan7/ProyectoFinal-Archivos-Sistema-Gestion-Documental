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
import { ActionActivity } from "../../common/enums/action-activity.enum.js";
let Activity = class Activity {
    userId;
    actionActivity;
    resourceType;
    resourceId;
    detail;
};
__decorate([
    Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose.Types.ObjectId)
], Activity.prototype, "userId", void 0);
__decorate([
    Prop({ type: String, enum: ActionActivity, required: true }),
    __metadata("design:type", String)
], Activity.prototype, "actionActivity", void 0);
__decorate([
    Prop({ type: String, required: true }),
    __metadata("design:type", String)
], Activity.prototype, "resourceType", void 0);
__decorate([
    Prop({ type: mongoose.Schema.Types.ObjectId, default: null }),
    __metadata("design:type", Object)
], Activity.prototype, "resourceId", void 0);
__decorate([
    Prop({ type: String, default: '' }),
    __metadata("design:type", String)
], Activity.prototype, "detail", void 0);
Activity = __decorate([
    Schema({ timestamps: true, collection: 'activities' })
], Activity);
export { Activity };
export const ActivitySchema = SchemaFactory.createForClass(Activity);
ActivitySchema.index({ userId: 1, createdAt: 1 });
ActivitySchema.index({ actionActivity: 1, createdAt: 1 });
//# sourceMappingURL=activity.schema.js.map