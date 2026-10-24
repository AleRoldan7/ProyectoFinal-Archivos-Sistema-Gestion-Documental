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
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, StreamableFile, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { UploadFileDTO } from '../dto/upload-file.dto.js';
import { RenameFileDTO } from '../dto/rename-file.dto.js';
import { MoveFileDTO } from '../dto/move-file.dto.js';
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from '../../common/enums/files.enum.js';
import { FileService } from '../service/file-service.service.js';
import { ListFileQueryDTO } from '../dto/list-file-query.dto.js';
import { Permission, ResourceType } from '../../common/enums/shraing.enum.js';
import { AccessService } from '../../sharing/service/access.service.js';
import { ActivityService } from '../../activity/service/activity.service.js';
import { ActionActivity } from '../../common/enums/action-activity.enum.js';
import { CommentService } from '../service/comment.service.js';
import { CreateCommentDTO } from '../dto/create-comment.dto.js';
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
    access;
    activity;
    comments;
    constructor(files, access, activity, comments) {
        this.files = files;
        this.access = access;
        this.activity = activity;
        this.comments = comments;
    }
    async upload(user, file, dto) {
        const creado = await this.files.upload(user.idUser, dto.folderId, file);
        await this.activity.register(user.idUser, ActionActivity.UPLOAD_FILE, 'FILE', creado.id, creado.name);
        return creado;
    }
    list(user, listFileQueryDto) {
        return this.files.list(user.idUser, listFileQueryDto);
    }
    async getOne(user, id) {
        await this.access.require(user.idUser, ResourceType.FILE, id, Permission.READ);
        return this.files.findById(id);
    }
    async download(user, id) {
        await this.access.require(user.idUser, ResourceType.FILE, id, Permission.READ);
        const { file, stream } = await this.files.download(id);
        await this.activity.register(user.idUser, ActionActivity.DOWNLOAD_FILE, 'FILE', id, file.name);
        return new StreamableFile(stream, {
            type: `${file.mimeType}; charset=utf-8`,
            disposition: `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
            length: file.size,
        });
    }
    async replaceContent(user, id, file) {
        await this.access.require(user.idUser, ResourceType.FILE, id, Permission.EDIT);
        const actualizado = await this.files.replaceContent(id, file);
        await this.activity.register(user.idUser, ActionActivity.EDIT_FILE, 'FILE', id, actualizado.name);
        return actualizado;
    }
    async rename(user, id, dto) {
        const actualizado = await this.files.rename(user.idUser, id, dto.name);
        await this.activity.register(user.idUser, ActionActivity.RENAME_FILE, 'FILE', id, actualizado.name);
        return actualizado;
    }
    async move(user, id, dto) {
        const actualizado = await this.files.move(user.idUser, id, dto.folderId);
        await this.activity.register(user.idUser, ActionActivity.MOVE_FILE, 'FILE', id, actualizado.name);
        return actualizado;
    }
    listComments(user, id) {
        return this.comments.list(user.idUser, id);
    }
    addComment(user, id, dto) {
        return this.comments.create(user.idUser, id, dto.text);
    }
    async removeComment(user, id, commentId) {
        await this.comments.remove(user.idUser, id, commentId);
        return { ok: true };
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
    __metadata("design:returntype", Promise)
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
    __metadata("design:returntype", Promise)
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
    __metadata("design:returntype", Promise)
], FileController.prototype, "replaceContent", null);
__decorate([
    Patch(':id/rename'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, RenameFileDTO]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "rename", null);
__decorate([
    Patch(':id/move'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, MoveFileDTO]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "move", null);
__decorate([
    Get(':id/comments'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "listComments", null);
__decorate([
    Post(':id/comments'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateCommentDTO]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "addComment", null);
__decorate([
    Delete(':id/comments/:commentId'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __param(2, Param('commentId', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "removeComment", null);
FileController = __decorate([
    Controller('files'),
    __metadata("design:paramtypes", [FileService, AccessService, ActivityService,
        CommentService])
], FileController);
export { FileController };
//# sourceMappingURL=file.controller.js.map