export var FileType;
(function (FileType) {
    FileType["TXT"] = "txt";
    FileType["MD"] = "md";
})(FileType || (FileType = {}));
export const ALLOWED_EXTENSIONS = ['.txt', '.md'];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const MIME_BY_TYPE = {
    [FileType.TXT]: 'text/plain',
    [FileType.MD]: 'text/markdown',
};
//# sourceMappingURL=files.enum.js.map