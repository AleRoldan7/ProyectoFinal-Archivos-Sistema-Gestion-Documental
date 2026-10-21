var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsISO8601, IsMongoId, IsOptional, Max, Min } from 'class-validator';
import { ActionActivity } from '../../common/enums/action-activity.enum.js';
export class ListActivityDTO {
    userId;
    action;
    from;
    to;
    page;
    limit;
}
__decorate([
    IsOptional(),
    IsMongoId(),
    __metadata("design:type", String)
], ListActivityDTO.prototype, "userId", void 0);
__decorate([
    IsOptional(),
    IsEnum(ActionActivity),
    __metadata("design:type", String)
], ListActivityDTO.prototype, "action", void 0);
__decorate([
    IsOptional(),
    IsISO8601(),
    __metadata("design:type", String)
], ListActivityDTO.prototype, "from", void 0);
__decorate([
    IsOptional(),
    IsISO8601(),
    __metadata("design:type", String)
], ListActivityDTO.prototype, "to", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], ListActivityDTO.prototype, "page", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], ListActivityDTO.prototype, "limit", void 0);
//# sourceMappingURL=list-activity.dto.js.map