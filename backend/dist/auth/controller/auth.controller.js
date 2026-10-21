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
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "../service/auth-service.service.js";
import { Public } from "../../common/decorators/public.decorator.js";
import { LoginDTO } from "../dto/login.dto.js";
import { ActivityService } from "../../activity/service/activity.service.js";
import { ActionActivity } from "../../common/enums/action-activity.enum.js";
let AuthController = class AuthController {
    auth;
    activity;
    constructor(auth, activity) {
        this.auth = auth;
        this.activity = activity;
    }
    async login(loginDto) {
        const response = await this.auth.login(loginDto);
        await this.activity.register(response.user.idUser, ActionActivity.LOGIN, 'USER', response.user.idUser, `Inicio de sesión: ${response.user.email}`);
        return response;
    }
};
__decorate([
    Public(),
    HttpCode(200),
    Post('login'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
AuthController = __decorate([
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService, ActivityService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map