import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Put, Query, StreamableFile, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthUser } from '../../common/interfaces/auth-user.interface.js';
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

const uploadInterceptor = FileInterceptor('file', {
    limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
    fileFilter: (request, file, cb) => {
        const name = FileService.decodeName(file.originalname).toLowerCase();
        const ok = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
        cb(ok ? null : new BadRequestException('Solo se permiten archivos .txt y .md'), ok);
    },
});

@Controller('files')
export class FileController {

    constructor(private readonly files: FileService, private readonly access: AccessService, private readonly activity: ActivityService) { }

    @Post('upload-file')
    @UseInterceptors(uploadInterceptor)
    async upload(@CurrentUser() user: AuthUser, @UploadedFile() file: Express.Multer.File, @Body() dto: UploadFileDTO) {
        const creado = await this.files.upload(user.idUser, dto.folderId, file);
        await this.activity.register(user.idUser, ActionActivity.UPLOAD_FILE, 'FILE', creado.id, creado.name);
        return creado;
    }

    @Get('list-file')
    list(@CurrentUser() user: AuthUser, @Query() listFileQueryDto: ListFileQueryDTO) {
        return this.files.list(user.idUser, listFileQueryDto);
    }

    @Get(':id')
    async getOne(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
        await this.access.require(user.idUser, ResourceType.FILE, id, Permission.READ);
        return this.files.findById(id);
    }

    @Get(':id/download')
    async download(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
        await this.access.require(user.idUser, ResourceType.FILE, id, Permission.READ);
        const { file, stream } = await this.files.download(id);
        await this.activity.register(user.idUser, ActionActivity.DOWNLOAD_FILE, 'FILE', id, file.name);
        return new StreamableFile(stream, {
            type: `${file.mimeType}; charset=utf-8`,
            disposition: `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
            length: file.size,
        });
    }

    @Put(':id/content')
    @UseInterceptors(uploadInterceptor)
    async replaceContent(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string, @UploadedFile() file: Express.Multer.File) {
        await this.access.require(user.idUser, ResourceType.FILE, id, Permission.EDIT);
        const actualizado = await this.files.replaceContent(id, file);
        await this.activity.register(user.idUser, ActionActivity.EDIT_FILE, 'FILE', id, actualizado.name);
        return actualizado;
    }

    @Patch(':id/rename')
    async rename(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string, @Body() dto: RenameFileDTO) {
        const actualizado = await this.files.rename(user.idUser, id, dto.name);
        await this.activity.register(user.idUser, ActionActivity.RENAME_FILE, 'FILE', id, actualizado.name);
        return actualizado;
    }

    @Patch(':id/move')
    async move(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string, @Body() dto: MoveFileDTO) {
        const actualizado = await this.files.move(user.idUser, id, dto.folderId);
        await this.activity.register(user.idUser, ActionActivity.MOVE_FILE, 'FILE', id, actualizado.name);
        return actualizado;
    }
}