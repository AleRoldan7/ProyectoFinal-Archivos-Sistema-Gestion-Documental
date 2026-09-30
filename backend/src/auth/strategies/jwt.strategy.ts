import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../../users/service/user-service.service.js";
import { JwtPayload } from "../interfaces/jwt-payload.inteface.js";
import { AuthUser } from "../../common/interfaces/auth-user.interface.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(config: ConfigService, private readonly users: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload): Promise<AuthUser> {
        const user = await this.users.findById(payload.sub);

        if (!user || !user.stateUser) throw new UnauthorizedException();
        return {idUser: user.id, email: user.email, rol: user.rol};
    }

}