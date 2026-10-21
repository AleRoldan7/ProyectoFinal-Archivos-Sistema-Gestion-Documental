import { FileResponse } from "../file/file-response";
import { Folder } from "../folder/folder";

export interface TrashContent {
  folders: Folder[];
  files: FileResponse[];
}
