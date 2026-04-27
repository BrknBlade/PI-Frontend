import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AppointmentService } from '../../models/appointment-model';
import { AppointmentStylist } from '../../models/secondAppointment-model';
@Component({
  selector: 'app-third-appointment',
  imports: [ RouterLink],
  templateUrl: './third-appointment.html',
  styleUrl: './third-appointment.css',
})
export class ThirdAppointment {
  appointmentService = inject(AppointmentService);
  appointmentStylist = inject(AppointmentStylist);
}
