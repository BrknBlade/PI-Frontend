import { Component } from '@angular/core';
import { HeaderLayout } from '../../shared/hedaer-shared/header-layout';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-appointment-page',
  imports: [HeaderLayout, RouterOutlet],
  templateUrl: './appointment-page.html',
  styleUrl: './appointment-page.css',
})
export class AppointmentPage {

}
