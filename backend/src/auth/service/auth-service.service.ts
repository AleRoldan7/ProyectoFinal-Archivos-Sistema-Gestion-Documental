import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../../users/service/user-service.service.js";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { LoginDTO } from "../dto/login.dto.js";
import bcrypt from "bcryptjs";
import { JwtPayload } from "../interfaces/jwt-payload.inteface.js";

@Injectable()
export class AuthService {

    constructor(private readonly users: UserService, private readonly jwt: JwtService, private readonly config: ConfigService) {}

    async login(loginDto: LoginDTO) {

        const user = await this.users.findByEmailWithPassword(loginDto.email);
        const password = user ? await bcrypt.compare(loginDto.password, user.password) : false;

        if (!user || !password) throw new UnauthorizedException('Credenciales invalidas');
        if (!user.stateUser) throw new ForbiddenException('Usuario inactivo');

        const payload: JwtPayload = {sub: user.id, rol: user.rol};

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
}