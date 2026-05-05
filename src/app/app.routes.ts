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
    pathMatch: 'full'
  },
  {
    path : 'login',
    component : Login
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'home/appointment',
    component: AppointmentPage,
    children: [ 
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'first-appointment'
      },
      {
        path: 'first-appointment',
        component: FirstAppointment
      },
      {
        path: 'second-appointment',
        component: SecondAppointment
      },
      {
        path: 'third-appointment',
        component: ThirdAppointment
      },
      {
        path: 'fourth-appointment',
        component: FourthAppointment
      }

    ]
  }
];
