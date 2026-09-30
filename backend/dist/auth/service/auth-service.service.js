var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../../users/service/user-service.service.js";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import bcrypt from "bcryptjs";
let AuthService = class AuthService {
    users;
    jwt;
    config;
    constructor(users, jwt, config) {
        this.users = users;
        this.jwt = jwt;
        this.config = config;
    }
    async login(loginDto) {
        const user = await this.users.findByEmailWithPassword(loginDto.email);
        const password = user ? await bcrypt.compare(loginDto.password, user.password) : false;
        if (!user || !password)
            throw new UnauthorizedException('Credenciales invalidas');
        if (!user.stateUser)
            throw new ForbiddenException('Usuario inactivo');
        const payload = { sub: user.id, rol: user.rol };
        return {
            accessToken: await this.jwt.signAsync(payload),
            tokenType: 'Bearer',
            expiresIn: Number(this.config.getOrThrow('JWT_EXPIRES_IN')),
            user: {
                idUser: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                rol: user.rol
            },
        };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UserService, JwtService, ConfigService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth-service.service.js.map