import { Module } from "@nestjs/common";
import { UserModule } from "../../users/module/user.module.js";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthController } from "../controller/auth.controller.js";
import { AuthService } from "../service/auth-service.service.js";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow<string>('JWT_SECRET'),
                signOptions: {expiresIn: Number(config.getOrThrow('JWT_EXPIRES_IN'))},
            }),
        }),
    ],

    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule {}