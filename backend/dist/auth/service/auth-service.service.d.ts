import { UserService } from "../../users/service/user-service.service.js";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { LoginDTO } from "../dto/login.dto.js";
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    private readonly config;
    constructor(users: UserService, jwt: JwtService, config: ConfigService);
    login(loginDto: LoginDTO): Promise<{
        accessToken: string;
        tokenType: string;
        expiresIn: number;
        user: {
            idUser: string;
            firstName: string;
            lastName: string;
            email: string;
            rol: import("../../common/enums/rol.enum.js").Rol;
        };
    }>;
}
