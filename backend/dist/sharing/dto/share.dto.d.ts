import { Permission, ResourceType } from '../../common/enums/shraing.enum.js';
export declare class CreateShareDTO {
    resourceType: ResourceType;
    resourceId: string;
    userId: string;
    permission: Permission;
}
export declare class UpdateShareDTO {
    permission: Permission;
}
