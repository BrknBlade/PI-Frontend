import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.userID()) {
    // Ya hay sesión activa → no tiene sentido ver el login → manda a /citas
    return router.createUrlTree(['/citas']);
  }

  return true; // No hay sesión → puede ver el login normalmente
};