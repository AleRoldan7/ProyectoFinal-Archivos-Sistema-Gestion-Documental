import { FileResponse } from "./file-response";

export interface FilePage {
  items: FileResponse[];
  total: number;
  page: number;
  limit: number;
}