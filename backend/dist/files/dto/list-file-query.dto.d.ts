import { FileType } from '../../common/enums/files.enum.js';
export declare class ListFileQueryDTO {
    folderId?: string;
    search?: string;
    type?: FileType;
    from?: string;
    to?: string;
    sortBy?: 'name' | 'createdAt' | 'size';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
