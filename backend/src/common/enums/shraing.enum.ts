export enum ResourceType { FOLDER = 'FOLDER', FILE = 'FILE' }
export enum Permission { READ = 'READ', COMMENT = 'COMMENT', EDIT = 'EDIT' }
export const Range_Permission: Record<Permission, number> = { READ: 1, COMMENT: 2, EDIT: 3 };