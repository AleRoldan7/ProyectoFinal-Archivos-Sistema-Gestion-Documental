import { Rol } from "../../common/enums/rol.enum.js";
export interface JwtPayload {
    sub: string;
    rol: Rol;
}
