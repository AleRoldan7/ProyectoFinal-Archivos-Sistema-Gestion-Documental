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
let SharingController = class SharingController {
    sharing;
    constructor(sharing) {
        this.sharing = sharing;
    }
    compartir(user, dto) {
        return this.sharing.share(user.idUser, dto);
    }
    conmigo(user) {
        return this.sharing.sharedWithMe(user.idUser);
    }
    porMi(user) {
        return this.sharing.sharedByMe(user.idUser);
    }
    cambiar(user, id, dto) {
        return this.sharing.changePermission(user.idUser, id, dto);
    }
    revocar(user, id) {
        return this.sharing.revoke(user.idUser, id);
    }
};
__decorate([
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateShareDTO]),
    __metadata("design:returntype", void 0)
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
    __metadata("design:returntype", void 0)
], SharingController.prototype, "cambiar", null);
__decorate([
    Delete(':id'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SharingController.prototype, "revocar", null);
SharingController = __decorate([
    Controller('shares'),
    __metadata("design:paramtypes", [SharingService])
], SharingController);
export { SharingController };
//# sourceMappingURL=sharing.controller.js.map