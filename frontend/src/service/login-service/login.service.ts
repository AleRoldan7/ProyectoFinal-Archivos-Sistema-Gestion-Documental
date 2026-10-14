import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenService } from '../toke-service/token.service';
import { RestConst } from '../../shared/rest-api-const';
import { LoginRequest } from '../../models/login/login-request';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../models/login/login-response';
import { response } from 'express';
import { AuthUser } from '../../models/auth/auth-user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private readonly httpClient = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  private apiUrl = new RestConst();

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl.getApiUrl()}/auth/login`, credentials).pipe(tap((response) => {
      this.tokenService.saveToken(response.accessToken);
      this.tokenService.saveUser(response.user);
    }),
  );
  }

  getCurrentUser(): AuthUser | null {
    return this.tokenService.getUser<AuthUser>();
  }

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  logout(): void {
    this.tokenService.clear();
  }
}
