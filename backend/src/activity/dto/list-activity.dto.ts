import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsISO8601, IsMongoId, IsOptional, Max, Min } from 'class-validator';
import { ActionActivity } from '../../common/enums/action-activity.enum.js';

export class ListActivityDTO {

    @IsOptional() @IsMongoId() userId?: string;
    @IsOptional() @IsEnum(ActionActivity) action?: ActionActivity;
    @IsOptional() @IsISO8601() from?: string;
    @IsOptional() @IsISO8601() to?: string;
    @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}