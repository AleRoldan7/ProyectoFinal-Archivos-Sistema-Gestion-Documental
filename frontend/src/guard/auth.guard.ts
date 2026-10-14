import { CanActivateFn } from "@angular/router";
import { LoginService } from "../service/login-service/login.service";
import { Router } from "express";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(LoginService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};