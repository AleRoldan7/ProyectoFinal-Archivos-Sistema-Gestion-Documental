import { Rol } from "./rol";

export interface UserResponse {
  idUser: string;
  firstName: string;
  lastName: string;
  email: string;
  rol: Rol;
  stateUser: boolean;
  createdAt?: string;

}

/** Lo que devuelve GET /users/directory (solo activos) */
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
