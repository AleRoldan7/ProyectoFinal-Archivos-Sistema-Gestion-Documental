import { Injectable } from '@angular/core';

const TOKEN_KEY = 'docs_access_token';
const USER_KEY = 'docs_current_user';

@Injectable({
  providedIn: 'root',
})

export class TokenService {

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  saveUser(user: unknown): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as T;
    } catch {
      this.clear();
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
