import { FileType } from "./file-type";

export interface FileResponse {
  _id: string;
  ownerId: string;
  folderId: string | null;
  name: string;
  fileType: FileType;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}