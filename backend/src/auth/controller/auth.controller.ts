import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "../service/auth-service.service.js";
import { Public } from "../../common/decorators/public.decorator.js";
import { LoginDTO } from "../dto/login.dto.js";

@Controller('auth')
export class AuthController {

    constructor(private readonly auth: AuthService) {}

    @Public()
    @HttpCode(200)
    @Post('login')
    login(@Body() loginDto: LoginDTO) {
        return this.auth.login(loginDto);
    }
}