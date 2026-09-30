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
import { ListFolderQueryDTO } from '../dto/list-folder-query.dto.js';
import { FolderService } from '../service/folder-service.service.js';
let FolderController = class FolderController {
    folders;
    constructor(folders) {
        this.folders = folders;
    }
    create(user, dto) {
        return this.folders.create(user.idUser, dto);
    }
    list(user, query) {
        return this.folders.findChildren(user.idUser, query.parentId);
    }
    getOne(user, id) {
        return this.folders.getWithPath(user.idUser, id);
    }
    rename(user, id, dto) {
        return this.folders.rename(user.idUser, id, dto.name);
    }
    move(user, id, dto) {
        return this.folders.move(user.idUser, id, dto.parentId);
    }
};
__decorate([
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateFolderDTO]),
    __metadata("design:returntype", void 0)
], FolderController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ListFolderQueryDTO]),
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
    __metadata("design:returntype", void 0)
], FolderController.prototype, "rename", null);
__decorate([
    Patch(':id/move'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, MoveFolderDTO]),
    __metadata("design:returntype", void 0)
], FolderController.prototype, "move", null);
FolderController = __decorate([
    Controller('folders'),
    __metadata("design:paramtypes", [FolderService])
], FolderController);
export { FolderController };
//# sourceMappingURL=folder.controller.js.map