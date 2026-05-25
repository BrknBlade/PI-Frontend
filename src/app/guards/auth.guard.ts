// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.userID()) {
    if(route.url[0].path == 'admin' && authService.user().role !== 1 && authService.user().role !== 2) {
      return router.createUrlTree(['/']);
    }

    return true;
  }

  return router.createUrlTree(['/login']);
};
