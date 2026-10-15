import { CanActivateFn, Router } from "@angular/router";
import { Rol } from "../models/user/rol";
import { LoginService } from "../service/login-service/login.service";
import { inject } from "@angular/core";

export const roleGuard = (roles: Rol[]): CanActivateFn => {
  return () => {
    const authService = inject(LoginService);
    const router = inject(Router);
    const user = authService.getCurrentUser();

    if (!user) {
      return router.createUrlTree(['/login']);
    }

    if (roles.includes(user.rol)) {
      return true;
    }

    return router.createUrlTree(['/page-principal']);
  };
};