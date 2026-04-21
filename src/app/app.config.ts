import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, provideAppInitializer, inject, LOCALE_ID  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './services/auth/auth-service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([ authInterceptor ])
    ),
    { provide: LOCALE_ID, useValue: 'es' }, 
    // Al arrancar la app, intenta recuperar el usuario de la sesión activa
    provideAppInitializer(() => {
      const authService = inject(AuthService);

      return firstValueFrom(authService.loadCurrentUser());
    })
  ]
};
