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
import { IsEnum, IsIn, IsInt, IsISO8601, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import { FileType } from '../../common/enums/files.enum.js';
export class ListFileQueryDTO {
    folderId;
    search;
    type;
    from;
    to;
    sortBy;
    order;
    page;
    limit;
}
__decorate([
    IsOptional(),
    Matches(/^(root|[a-f\d]{24})$/i, { message: 'folderId debe ser "root" o un id válido' }),
    __metadata("design:type", String)
], ListFileQueryDTO.prototype, "folderId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], ListFileQueryDTO.prototype, "search", void 0);
__decorate([
    IsOptional(),
    IsEnum(FileType),
    __metadata("design:type", String)
], ListFileQueryDTO.prototype, "type", void 0);
__decorate([
    IsOptional(),
    IsISO8601(),
    __metadata("design:type", String)
], ListFileQueryDTO.prototype, "from", void 0);
__decorate([
    IsOptional(),
    IsISO8601(),
    __metadata("design:type", String)
], ListFileQueryDTO.prototype, "to", void 0);
__decorate([
    IsOptional(),
    IsIn(['name', 'createdAt', 'size']),
    __metadata("design:type", String)
], ListFileQueryDTO.prototype, "sortBy", void 0);
__decorate([
    IsOptional(),
    IsIn(['asc', 'desc']),
    __metadata("design:type", String)
], ListFileQueryDTO.prototype, "order", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], ListFileQueryDTO.prototype, "page", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], ListFileQueryDTO.prototype, "limit", void 0);
//# sourceMappingURL=list-file-query.dto.js.map