import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthUser } from '../../common/interfaces/auth-user.interface.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { CreateFolderDTO } from '../dto/create-folder.dto.js';
import { RenameFolderDTO } from '../dto/rename-folder.dto.js';
import { MoveFolderDTO } from '../dto/move-folder.dto.js';
import { ListFolderQueryDTO } from '../dto/list-folder-query.dto.js';
import { FolderService } from '../service/folder-service.service.js';

@Controller('folders')
export class FolderController {

    constructor(private readonly folders: FolderService) { }

    @Post()
    create(@CurrentUser() user: AuthUser, @Body() dto: CreateFolderDTO) {
        return this.folders.create(user.idUser, dto);
    }

    @Get()
    list(@CurrentUser() user: AuthUser, @Query('parentId') parentId?: string) {
        return this.folders.findChildren(user.idUser, parentId);
    }

    @Get(':id')
    getOne(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
        return this.folders.getWithPath(user.idUser, id);
    }

    @Patch(':id/rename')
    rename(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string, @Body() dto: RenameFolderDTO) {
        return this.folders.rename(user.idUser, id, dto.name);
    }

    @Patch(':id/move')
    move(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string, @Body() dto: MoveFolderDTO) {
        return this.folders.move(user.idUser, id, dto.parentId);
    }

}