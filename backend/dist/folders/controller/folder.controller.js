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
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { CreateFolderDTO } from '../dto/create-folder.dto.js';
import { RenameFolderDTO } from '../dto/rename-folder.dto.js';
import { MoveFolderDTO } from '../dto/move-folder.dto.js';
import { FolderService } from '../service/folder-service.service.js';
import { ActivityService } from '../../activity/service/activity.service.js';
import { ActionActivity } from '../../common/enums/action-activity.enum.js';
let FolderController = class FolderController {
    folders;
    activity;
    constructor(folders, activity) {
        this.folders = folders;
        this.activity = activity;
    }
    async create(user, dto) {
        const carpeta = await this.folders.create(user.idUser, dto);
        await this.activity.register(user.idUser, ActionActivity.CREATE_FOLDER, 'FOLDER', carpeta.id, carpeta.name);
        return carpeta;
    }
    list(user, parentId) {
        return this.folders.findChildren(user.idUser, parentId);
    }
    getOne(user, id) {
        return this.folders.getWithPath(user.idUser, id);
    }
    async rename(user, id, dto) {
        const carpeta = await this.folders.rename(user.idUser, id, dto.name);
        await this.activity.register(user.idUser, ActionActivity.RENAME_FOLDER, 'FOLDER', id, carpeta.name);
        return carpeta;
    }
    async move(user, id, dto) {
        const carpeta = await this.folders.move(user.idUser, id, dto.parentId);
        await this.activity.register(user.idUser, ActionActivity.MOVE_FOLDER, 'FOLDER', id, carpeta.name);
        return carpeta;
    }
};
__decorate([
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateFolderDTO]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FolderController.prototype, "list", null);
__decorate([
    Get(':id'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FolderController.prototype, "getOne", null);
__decorate([
    Patch(':id/rename'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, RenameFolderDTO]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "rename", null);
__decorate([
    Patch(':id/move'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, MoveFolderDTO]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "move", null);
FolderController = __decorate([
    Controller('folders'),
    __metadata("design:paramtypes", [FolderService, ActivityService])
], FolderController);
export { FolderController };
//# sourceMappingURL=folder.controller.js.map