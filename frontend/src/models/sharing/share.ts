export type Permission = 'READ' | 'COMMENT' | 'EDIT';
export type ResourceType = 'FOLDER' | 'FILE';

export interface UserRef {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
}

export interface Share {
  _id: string;
  ownerId: string | UserRef;
  sharedWithId: string | UserRef;
  resourceType: ResourceType;
  resourceId: string;
  resourceName?: string | null;
  permission: Permission;
  createdAt: string;
}

export interface CreateShareRequest {
  resourceType: ResourceType;
  resourceId: string;
  userId: string;
  permission: Permission;
}
