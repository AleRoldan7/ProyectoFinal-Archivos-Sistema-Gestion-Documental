import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "../service/auth-service.service.js";
import { Public } from "../../common/decorators/public.decorator.js";
import { LoginDTO } from "../dto/login.dto.js";
import { ActivityService } from "../../activity/service/activity.service.js";
import { ActionActivity } from "../../common/enums/action-activity.enum.js";

@Controller('auth')
export class AuthController {

    constructor(private readonly auth: AuthService, private readonly activity: ActivityService) { }

    @Public()
    @HttpCode(200)
    @Post('login')
    async login(@Body() loginDto: LoginDTO) {
        const response = await this.auth.login(loginDto);
        await this.activity.register(response.user.idUser, ActionActivity.LOGIN,'USER', response.user.idUser,`Inicio de sesión: ${response.user.email}`);
        return response;

    }
}