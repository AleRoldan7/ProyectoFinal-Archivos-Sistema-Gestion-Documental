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
import { Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { TrashService } from "../service/trash.service.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
let TrashController = class TrashController {
    trashService;
    constructor(trashService) {
        this.trashService = trashService;
    }
    sendFolder(user, id) {
        return this.trashService.sendFolder(user.idUser, id);
    }
    sendFile(user, id) {
        return this.trashService.sendFile(user.idUser, id);
    }
    listar(user) {
        return this.trashService.list(user.idUser);
    }
    restaurarCarpeta(user, id) {
        return this.trashService.restoredFolder(user.idUser, id);
    }
    restaurarArchivo(user, id) {
        return this.trashService.restoredFile(user.idUser, id);
    }
    eliminarCarpeta(user, id) {
        return this.trashService.deleteFolder(user.idUser, id);
    }
    eliminarArchivo(user, id) {
        return this.trashService.deleteFile(user.idUser, id);
    }
};
__decorate([
    Delete('folders/:id'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TrashController.prototype, "sendFolder", null);
__decorate([
    Delete('files/:id'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TrashController.prototype, "sendFile", null);
__decorate([
    Get('trash'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrashController.prototype, "listar", null);
__decorate([
    Patch('trash/folders/:id/restore'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TrashController.prototype, "restaurarCarpeta", null);
__decorate([
    Patch('trash/files/:id/restore'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TrashController.prototype, "restaurarArchivo", null);
__decorate([
    Delete('trash/folders/:id'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TrashController.prototype, "eliminarCarpeta", null);
__decorate([
    Delete('trash/files/:id'),
    __param(0, CurrentUser()),
    __param(1, Param('id', ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TrashController.prototype, "eliminarArchivo", null);
TrashController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [TrashService])
], TrashController);
export { TrashController };
//# sourceMappingURL=trash.controller.js.map