import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsISO8601, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import { FileType } from '../../common/enums/files.enum.js';

export class ListFileQueryDTO {

    @IsOptional() @Matches(/^(root|[a-f\d]{24})$/i, { message: 'folderId debe ser "root" o un id válido' })
    folderId?: string;

    @IsOptional() @IsString() @MaxLength(100)
    search?: string;

    @IsOptional() @IsEnum(FileType)
    type?: FileType;

    @IsOptional() @IsISO8601()
    from?: string;

    @IsOptional() @IsISO8601()
    to?: string;

    @IsOptional() @IsIn(['name', 'createdAt', 'size'])
    sortBy?: 'name' | 'createdAt' | 'size';

    @IsOptional() @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc';

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page?: number;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    limit?: number;
}