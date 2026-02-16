import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isLoggedIn = !!sessionStorage.getItem('token');

  if (isLoggedIn) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
