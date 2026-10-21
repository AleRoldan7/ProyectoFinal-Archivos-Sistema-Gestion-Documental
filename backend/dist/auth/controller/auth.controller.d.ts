import { AuthService } from "../service/auth-service.service.js";
import { LoginDTO } from "../dto/login.dto.js";
import { ActivityService } from "../../activity/service/activity.service.js";
export declare class AuthController {
    private readonly auth;
    private readonly activity;
    constructor(auth: AuthService, activity: ActivityService);
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
