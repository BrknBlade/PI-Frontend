import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Citas } from './pages/citas/citas';
import { authGuard } from './guards/auth.guard';
import { UserData } from './services/userData/user-data';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path : '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path : 'login',
    component : Login
  },
  {
    path : 'citas',
    component : Citas,
    canActivate: [authGuard],
    resolve: {
      citas: () => inject(UserData).getCitas()
    }
  }
];
