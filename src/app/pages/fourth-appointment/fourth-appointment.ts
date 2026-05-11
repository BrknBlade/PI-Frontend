import { Component, inject } from '@angular/core';
import { AppointmentDatetime } from '../../models/thirdAppointment-model';
import { AppointmentService } from '../../models/appointment-model';
import { AppointmentStylist } from '../../models/secondAppointment-model';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CheckShared } from "../../shared/check-shared/check-shared";

@Component({
  selector: 'app-fourth-appointment',
  imports: [DatePipe, FormsModule, RouterLink, CheckShared],
  templateUrl: './fourth-appointment.html',
  styleUrl: './fourth-appointment.css',
})
export class FourthAppointment {
  appointmentDatetime = inject(AppointmentDatetime);
  appointmentService = inject(AppointmentService);
  appointmentStylist = inject(AppointmentStylist);

  fullName = '';
  email = '';
  phone = '';
  acceptedTerms = false;

  reservarCita() {
    if (!this.fullName || !this.email || !this.phone || !this.acceptedTerms) return;
    console.log({
        servicio: this.appointmentService.selectedService(),
        peluquero: this.appointmentStylist.selectedService(),
        datetime: this.appointmentDatetime.selectedDatetime(),
        nombre: this.fullName,
        email: this.email,
        telefono: this.phone,
    });
}
}
