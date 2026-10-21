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
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { SharingService } from '../service/sharing.service.js';
import { CreateShareDTO, UpdateShareDTO } from '../dto/share.dto.js';
import { ActivityService } from '../../activity/service/activity.service.js';
import { ActionActivity } from '../../common/enums/action-activity.enum.js';
let SharingController = class SharingController {
    sharing;
    activity;
    constructor(sharing, activity) {
        this.sharing = sharing;
        this.activity = activity;
    }
    async compartir(user, dto) {
        const compartido = await this.sharing.share(user.idUser, dto);
        await this.activity.register(user.idUser, ActionActivity.SHARE, 'SHARE', compartido.id, dto.permission);
        return compartido;
    }
    conmigo(user) {
        return this.sharing.sharedWithMe(user.idUser);
    }
    porMi(user) {
        return this.sharing.sharedByMe(user.idUser);
    }
    async cambiar(user, id, dto) {
        const actualizado = await this.sharing.changePermission(user.idUser, id, dto);
        await this.activity.register(user.idUser, ActionActivity.CHANGE_PERMISSION, 'SHARE', id, dto.permission);
        return actualizado;
    }
    async revocar(user, id) {
        const eliminado = await this.sharing.revoke(user.idUser, id);
        await this.activity.register(user.idUser, ActionActivity.REVOKE_PERMISSION, 'SHARE', id);
        return eliminado;
    }
};
__decorate([
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateShareDTO]),
    __metadata("design:returntype", Promise)
], SharingController.prototype, "compartir", null);
__decorate([
    Get('with-me'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SharingController.prototype, "conmigo", null);
__decorate([
    Get('by-me'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SharingController.prototype, "porMi", null);
__decorate([
    Patch(':id'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateShareDTO]),
    __metadata("design:returntype", Promise)
], SharingController.prototype, "cambiar", null);
__decorate([
    Delete(':id'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SharingController.prototype, "revocar", null);
SharingController = __decorate([
    Controller('shares'),
    __metadata("design:paramtypes", [SharingService, ActivityService])
], SharingController);
export { SharingController };
//# sourceMappingURL=sharing.controller.js.map