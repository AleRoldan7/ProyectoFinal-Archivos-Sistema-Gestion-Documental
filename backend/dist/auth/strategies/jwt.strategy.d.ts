import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { UserService } from "../../users/service/user-service.service.js";
import { JwtPayload } from "../interfaces/jwt-payload.inteface.js";
import { AuthUser } from "../../common/interfaces/auth-user.interface.js";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly users;
    constructor(config: ConfigService, users: UserService);
    validate(payload: JwtPayload): Promise<AuthUser>;
}
export {};
