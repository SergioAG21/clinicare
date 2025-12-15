import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = sessionStorage.getItem('auth_token');

  if (token) {
    return true;
  }

  // si no hay token, redirige al login
  return inject(Router).createUrlTree(['/home']);
};
