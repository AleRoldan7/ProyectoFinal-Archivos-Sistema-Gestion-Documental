import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthUser } from '../../common/interfaces/auth-user.interface.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { CreateFolderDTO } from '../dto/create-folder.dto.js';
import { RenameFolderDTO } from '../dto/rename-folder.dto.js';
import { MoveFolderDTO } from '../dto/move-folder.dto.js';
import { ListFolderQueryDTO } from '../dto/list-folder-query.dto.js';
import { FolderService } from '../service/folder-service.service.js';
import { ActivityService } from '../../activity/service/activity.service.js';
import { ActionActivity } from '../../common/enums/action-activity.enum.js';

@Controller('folders')
export class FolderController {

    constructor(private readonly folders: FolderService, private readonly activity: ActivityService) { }

    @Post()
    async create(@CurrentUser() user: AuthUser, @Body() dto: CreateFolderDTO) {
        const carpeta = await this.folders.create(user.idUser, dto);
        await this.activity.register(user.idUser, ActionActivity.CREATE_FOLDER, 'FOLDER', carpeta.id, carpeta.name);
        return carpeta;
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
    async rename(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string, @Body() dto: RenameFolderDTO) {
        const carpeta = await this.folders.rename(user.idUser, id, dto.name);
        await this.activity.register(user.idUser, ActionActivity.RENAME_FOLDER, 'FOLDER', id, carpeta.name);
        return carpeta;
    }

    @Patch(':id/move')
    async move(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string, @Body() dto: MoveFolderDTO) {
        const carpeta = await this.folders.move(user.idUser, id, dto.parentId);
        await this.activity.register(user.idUser, ActionActivity.MOVE_FOLDER, 'FOLDER', id, carpeta.name);
        return carpeta;
    }

}