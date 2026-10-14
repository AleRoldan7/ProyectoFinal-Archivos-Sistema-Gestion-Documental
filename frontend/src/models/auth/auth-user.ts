import { Rol } from "../user/rol";

export interface AuthUser {
    idUser: string;
    firstName: string;
    lastName: string;
    email: string;
    rol: Rol;
}