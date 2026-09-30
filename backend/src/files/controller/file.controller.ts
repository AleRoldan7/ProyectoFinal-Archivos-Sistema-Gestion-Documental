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

    constructor(private readonly files: FileService) { }

    @Post('upload-file')
    @UseInterceptors(uploadInterceptor)
    upload(@CurrentUser() user: AuthUser, @UploadedFile() file: Express.Multer.File, @Body() dto: UploadFileDTO) {
        return this.files.upload(user.idUser, dto.folderId, file);
    }

    @Get('list-file')
    list(@CurrentUser() user: AuthUser, @Query() listFileQueryDto: ListFileQueryDTO) {
        return this.files.list(user.idUser, listFileQueryDto);
    }

    @Get(':id')
    getOne(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
        return this.files.getOwned(user.idUser, id);
    }

    @Get(':id/download')
    async download(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
        const { file, stream } = await this.files.download(user.idUser, id);
        return new StreamableFile(stream, {
            type: `${file.mimeType}; charset=utf-8`,
            disposition: `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
            length: file.size,
        });
    }

    @Put(':id/content')
    @UseInterceptors(uploadInterceptor)
    replaceContent(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string, @UploadedFile() file: Express.Multer.File) {
        return this.files.replaceContent(user.idUser, id, file);
    }

    @Patch(':id/rename')
    rename(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string, @Body() dto: RenameFileDTO) {
        return this.files.rename(user.idUser, id, dto.name);
    }

    @Patch(':id/move')
    move(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string, @Body() dto: MoveFileDTO) {
        return this.files.move(user.idUser, id, dto.folderId);
    }
}