import { FileType } from "./file-type";

export interface FileQuery {
  folderId?: string;
  search?: string;
  type?: FileType | '';
  sortBy?: 'name' | 'createdAt' | 'size';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
