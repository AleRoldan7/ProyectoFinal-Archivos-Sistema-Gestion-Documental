import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'docs_access_token';
const USER_KEY = 'docs_current_user';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  }

  saveToken(token: string): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
  }

  saveUser(user: unknown): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    if (!this.isBrowser) {
      return null;
    }

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
    if (!this.isBrowser) {
      return;
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}