import { Rol } from "./rol";

export interface UserResponse {
    idUser: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    rol: Rol;
}