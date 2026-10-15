import { IsIn, IsMongoId } from 'class-validator';
import { Permission, ResourceType } from '../../common/enums/shraing.enum.js';

export class CreateShareDTO {
  @IsIn(Object.values(ResourceType)) resourceType: ResourceType;
  @IsMongoId() resourceId: string;
  @IsMongoId() userId: string;
  @IsIn(Object.values(Permission)) permission: Permission;
}

export class UpdateShareDTO {
  @IsIn(Object.values(Permission)) permission: Permission;
}