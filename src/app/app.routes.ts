import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Citas } from './pages/citas/citas';
import { authGuard } from './guards/auth.guard';
import { UserData } from './services/userData/user-data';
import { inject } from '@angular/core';
import { guestGuard } from './guards/guest.guard';
import { HomePage } from './pages/home-page/home-page';
import { AppointmentPage } from './pages/appointment-page/appointment-page';
import { FirstAppointment } from './pages/first-appointment/first-appointment';
import { SecondAppointment } from './pages/second-appointment/second-appointment';
import { ThirdAppointment } from './pages/third-appointment/third-appointment';
import { FourthAppointment } from './pages/fourth-appointment/fourth-appointment';
import { ClientsComponent } from './pages/clients-component/clients-component';
import { SettingsComponent } from './pages/settings-component/settings-component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path : 'login',
    component : Login,
    canActivate: [guestGuard]
  },
  {
    path : 'citas',
    component : Citas,
    canActivate: [authGuard],
    resolve: {
      citas: () => inject(UserData).getCitas()
    }
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'panel',
      },
      {
        path: 'clientes',
        component: ClientsComponent,
      },
      {
        path: 'ajustes',
        component: SettingsComponent,
      },
    ],
  },
  {
    path: 'appointment',
    component: AppointmentPage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'first',
      },
      {
        path: 'first',
        component: FirstAppointment,
      },
      {
        path: 'second',
        component: SecondAppointment,
      },
      {
        path: 'third',
        component: ThirdAppointment,
      },
      {
        path: 'fourth',
        component: FourthAppointment,
      },
    ],
  },
];
