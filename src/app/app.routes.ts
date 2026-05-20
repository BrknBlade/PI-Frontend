import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Citas } from './pages/citas/citas';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { UserData } from './services/userData/user-data';
import { inject } from '@angular/core';
import { HomePage } from './pages/home-page/home-page';
import { AppointmentPage } from './pages/appointment-page/appointment-page';
import { FirstAppointment } from './pages/first-appointment/first-appointment';
import { SecondAppointment } from './pages/second-appointment/second-appointment';
import { ThirdAppointment } from './pages/third-appointment/third-appointment';
import { FourthAppointment } from './pages/fourth-appointment/fourth-appointment';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    // Ruta raíz → carga directamente el HomePage (sin redirect)
    path: '',
    component: HomePage,

  },
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard], // Si ya está logueado, lo manda a /
  },
  {
    path: 'citas',
    component: Citas,
    canActivate: [authGuard],
    resolve: {
      citas: () => inject(UserData).getCitas(),
    },
  },
  {
    path: 'appointment',
    component: AppointmentPage,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'servicio',
      },
      { path: 'servicio', component: FirstAppointment },
      { path: 'peluquero', component: SecondAppointment },
      { path: 'fecha-y-hora', component: ThirdAppointment },
      { path: 'confirmacion', component: FourthAppointment },
    ],
  },
  { path: '**', component: NotFound },
];
