import { Rol } from "../enums/rol.enum.js";

export interface AuthUser {
    idUser: string;
    email: string;
    rol: Rol;
}