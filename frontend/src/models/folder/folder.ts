export interface Folder {
  _id: string;
  ownerId: string;
  name: string;
  parentId: string | null;
  ancestors: string[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FolderPathItem {
  _id: string;
  name: string;
}

export interface FolderDetail {
  folder: Folder;
  path: FolderPathItem[];
}
