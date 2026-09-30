import { AuthService } from "../service/auth-service.service.js";
import { LoginDTO } from "../dto/login.dto.js";
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
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
