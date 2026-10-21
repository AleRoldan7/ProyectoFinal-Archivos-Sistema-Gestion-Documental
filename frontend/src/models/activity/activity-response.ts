export const ACTION = [
    'LOGIN', 'CREATE_FOLDER', 'RENAME_FOLDER', 'MOVE_FOLDER', 'UPLOAD_FILE', 'DOWNLOAD_FILE',
    'EDIT_FILE', 'RENAME_FILE', 'MOVE_FILE', 'MOVE_TO_TRASH', 'RESTORE', 'PERMANENTLY_DELETE',
    'SHARE', 'CHANGE_PERMISSION', 'REVOKE_PERMISSION'
] as const;

export type ActionActivity = (typeof ACTION)[number];

export interface ActivityResponse {
    _id: string;
    userId: string;
    actionActivity: ActionActivity;
    resourceType: string;
    resourceId: string | null;
    detail: string;
    createdAt: string;
}