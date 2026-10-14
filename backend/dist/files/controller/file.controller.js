var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Put, Query, StreamableFile, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { UploadFileDTO } from '../dto/upload-file.dto.js';
import { RenameFileDTO } from '../dto/rename-file.dto.js';
import { MoveFileDTO } from '../dto/move-file.dto.js';
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from '../../common/enums/files.enum.js';
import { FileService } from '../service/file-service.service.js';
import { ListFileQueryDTO } from '../dto/list-file-query.dto.js';
const uploadInterceptor = FileInterceptor('file', {
    limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
    fileFilter: (request, file, cb) => {
        const name = FileService.decodeName(file.originalname).toLowerCase();
        const ok = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
        cb(ok ? null : new BadRequestException('Solo se permiten archivos .txt y .md'), ok);
    },
});
let FileController = class FileController {
    files;
    constructor(files) {
        this.files = files;
    }
    upload(user, file, dto) {
        return this.files.upload(user.idUser, dto.folderId, file);
    }
    list(user, listFileQueryDto) {
        return this.files.list(user.idUser, listFileQueryDto);
    }
    getOne(user, id) {
        return this.files.getOwned(user.idUser, id);
    }
    async download(user, id) {
        const { file, stream } = await this.files.download(user.idUser, id);
        return new StreamableFile(stream, {
            type: `${file.mimeType}; charset=utf-8`,
            disposition: `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
            length: file.size,
        });
    }
    replaceContent(user, id, file) {
        return this.files.replaceContent(user.idUser, id, file);
    }
    rename(user, id, dto) {
        return this.files.rename(user.idUser, id, dto.name);
    }
    move(user, id, dto) {
        return this.files.move(user.idUser, id, dto.folderId);
    }
};
__decorate([
    Post('upload-file'),
    UseInterceptors(uploadInterceptor),
    __param(0, CurrentUser()),
    __param(1, UploadedFile()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, UploadFileDTO]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "upload", null);
__decorate([
    Get('list-file'),
    __param(0, CurrentUser()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ListFileQueryDTO]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "list", null);
__decorate([
    Get(':id'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "getOne", null);
__decorate([
    Get(':id/download'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "download", null);
__decorate([
    Put(':id/content'),
    UseInterceptors(uploadInterceptor),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __param(2, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "replaceContent", null);
__decorate([
    Patch(':id/rename'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, RenameFileDTO]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "rename", null);
__decorate([
    Patch(':id/move'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, MoveFileDTO]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "move", null);
FileController = __decorate([
    Controller('files'),
    __metadata("design:paramtypes", [FileService])
], FileController);
export { FileController };
//# sourceMappingURL=file.controller.js.map