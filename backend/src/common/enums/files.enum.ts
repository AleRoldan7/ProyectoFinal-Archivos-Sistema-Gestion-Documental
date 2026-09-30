export enum FileType {
    TXT = 'txt',
    MD = 'md',
}

export const ALLOWED_EXTENSIONS = ['.txt', '.md'];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const MIME_BY_TYPE: Record<FileType, string> = {
    [FileType.TXT]: 'text/plain',
    [FileType.MD]: 'text/markdown',
};