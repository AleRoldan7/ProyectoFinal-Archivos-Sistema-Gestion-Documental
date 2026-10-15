import { Type } from 'class-transformer';
import { IsIn, IsInt, IsISO8601, IsMongoId, IsOptional, Max, Min } from 'class-validator';

export class FiltroReporteDTO {
  @IsOptional() @IsISO8601() from?: string;
  @IsOptional() @IsISO8601() to?: string;
  @IsOptional() @IsMongoId() userId?: string;
  @IsOptional() @IsIn(['DIA', 'MES']) periodo?: 'DIA' | 'MES';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}