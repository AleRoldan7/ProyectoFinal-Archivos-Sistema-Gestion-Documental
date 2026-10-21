import { Rol } from "./rol";

export interface UserResponse {
  idUser: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  rol: Rol;
  stateUser: boolean;
  createdAt?: string;

}

export interface UsuarioDirectorio {
  _id: string;
  firstName: string;
  email: string;
}

export interface UsuarioCambios {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  rol?: Rol;
}
