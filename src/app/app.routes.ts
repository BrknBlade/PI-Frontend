import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Citas } from './pages/citas/citas';

export const routes: Routes = [
  {
    path : 'login',
    component : Login
  },
  {
    path : 'citas',
    component : Citas
  }
];
