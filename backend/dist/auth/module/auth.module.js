var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { UserModule } from "../../users/module/user.module.js";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthController } from "../controller/auth.controller.js";
import { AuthService } from "../service/auth-service.service.js";
import { JwtStrategy } from "../strategies/jwt.strategy.js";
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
        imports: [
            UserModule,
            PassportModule,
            JwtModule.registerAsync({
                inject: [ConfigService],
                useFactory: (config) => ({
                    secret: config.getOrThrow('JWT_SECRET'),
                    signOptions: { expiresIn: Number(config.getOrThrow('JWT_EXPIRES_IN')) },
                }),
            }),
        ],
        controllers: [AuthController],
        providers: [AuthService, JwtStrategy]
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map