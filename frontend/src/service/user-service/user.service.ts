import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RestConst } from '../../shared/rest-api-const';
import { UserResponse, UsuarioCambios, UsuarioDirectorio } from '../../models/user/user-response';
import { UserRequest } from '../../models/user/user-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly http = inject(HttpClient);
  private readonly url = new RestConst().getApiUrl() + "/users";

  me() { return this.http.get<UserResponse>(`${this.url}/me`); }

  directorio() { return this.http.get<UsuarioDirectorio[]>(`${this.url}/directory`); }

  todos() { return this.http.get<UserResponse[]>(`${this.url}/all-users`); }

  crear(datos: UserRequest) { return this.http.post<UserResponse>(`${this.url}/create-user`, datos); }

  actualizar(id: string, cambios: UsuarioCambios) { return this.http.patch<UserResponse>(`${this.url}/${id}/update`, cambios); }

  cambiarEstado(id: string, state: boolean) { return this.http.patch<UserResponse>(`${this.url}/${id}/state`, { state }); }
}
