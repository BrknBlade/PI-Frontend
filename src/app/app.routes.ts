import { Routes } from '@angular/router';
import { Login } from './presentation/login/login';
import { HomePage } from './presentation/home-page/home-page';
import { AppointmentPage } from './presentation/appointment-page/appointment-page';
import { FirstAppointment } from './presentation/first-appointment/first-appointment';
import { SecondAppointment } from './presentation/second-appointment/second-appointment';
import { ThirdAppointment } from './presentation/third-appointment/third-appointment';
import { FourthAppointment } from './presentation/fourth-appointment/fourth-appointment';

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
