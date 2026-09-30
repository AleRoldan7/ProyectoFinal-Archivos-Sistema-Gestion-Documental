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
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "../service/user-service.service.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { Roles } from "../../common/decorators/rol.decorator.js";
import { Rol } from "../../common/enums/rol.enum.js";
import { CreateUserDTO } from "../dto/create-user.dto.js";
import { UpdateUserDTO } from "../dto/update-user.dto.js";
import { StateUserDTO } from "../dto/state-user.dto.js";
let UserController = class UserController {
    users;
    constructor(users) {
        this.users = users;
    }
    me(user) {
        return this.users.getById(user.idUser);
    }
    directory() {
        return this.users.directory();
    }
    create(createDto) {
        return this.users.create(createDto);
    }
    findAll() {
        return this.users.findAll();
    }
    update(id, updateDto) {
        return this.users.update(id, updateDto);
    }
    setActivo(id, stateDto, actor) {
        return this.users.setActivo(id, stateDto.state, actor.idUser);
    }
};
__decorate([
    Get('me'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "me", null);
__decorate([
    Get('directory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "directory", null);
__decorate([
    Roles(Rol.ADMIN),
    Post('create-user'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDTO]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    Roles(Rol.ADMIN),
    Get('all-users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    Roles(Rol.ADMIN),
    Patch(':id/update'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserDTO]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    Roles(Rol.ADMIN),
    Patch(':id/state'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, StateUserDTO, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "setActivo", null);
UserController = __decorate([
    Controller('users'),
    __metadata("design:paramtypes", [UserService])
], UserController);
export { UserController };
//# sourceMappingURL=user.controller.js.map