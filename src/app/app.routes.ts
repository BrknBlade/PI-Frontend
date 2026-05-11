import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { HomePage } from './pages/home-page/home-page';
import { AppointmentPage } from './pages/appointment-page/appointment-page';
import { FirstAppointment } from './pages/first-appointment/first-appointment';
import { SecondAppointment } from './pages/second-appointment/second-appointment';
import { ThirdAppointment } from './pages/third-appointment/third-appointment';
import { FourthAppointment } from './pages/fourth-appointment/fourth-appointment';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'appointment',
    component: AppointmentPage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'appointment-first',
      },
      {
        path: 'appointment-first',
        component: FirstAppointment,
      },
      {
        path: 'appointment-second',
        component: SecondAppointment,
      },
      {
        path: 'appointment-third',
        component: ThirdAppointment,
      },
      {
        path: 'appointment-fourth',
        component: FourthAppointment,
      },
    ],
  },
];
