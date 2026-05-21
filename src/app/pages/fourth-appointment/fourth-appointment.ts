import { Component, inject, OnInit, signal } from '@angular/core';
import { AppointmentDatetime } from '../../models/thirdAppointment-model';
import { AppointmentService } from '../../models/appointment-model';
import { AppointmentStylist } from '../../models/secondAppointment-model';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CheckShared } from "../../shared/check-shared/check-shared";
import { CitaService } from '../../services/citas/cita-service';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-fourth-appointment',
  imports: [DatePipe, FormsModule, RouterLink, CheckShared],
  templateUrl: './fourth-appointment.html',
  styleUrls: ['./fourth-appointment.css'],
})
export class FourthAppointment implements OnInit {
  appointmentDatetime = inject(AppointmentDatetime);
  appointmentService = inject(AppointmentService);
  appointmentStylist = inject(AppointmentStylist);
  citaService = inject(CitaService);
  authService = inject(AuthService);
  router = inject(Router);
  confirmando = signal(false);

  fullName = '';
  email = '';
  phone = '';
  gender = '';
  description = '';
  acceptedTerms = false;
  genderOpen = false;

selectGender(value: string) {
  this.gender = value;
  this.genderOpen = false;
}

  ngOnInit() {
    const user = this.authService.user();
    if (user) {
      this.fullName = user.name ?? '';
      this.email = user.email ?? '';
    }
  }

reservarCita() {
  if (!this.fullName || !this.email || !this.phone || !this.acceptedTerms || !this.description || !this.gender) return;

  const service = this.appointmentService.selectedService();
  const datetime = this.appointmentDatetime.selectedDatetime();
  const stylist = this.appointmentStylist.selectedService();

  if (!service || !datetime) return;

  this.confirmando.set(true);

  this.citaService.postCita({
    cut_type_id: service.id,
    employee_id: stylist?.id ?? null,
    date: datetime.fecha,
    hour: datetime.hora,
    gender: this.gender,
    description: this.description,
  }).subscribe({
    next: () => {
      this.appointmentService.clear();
      this.appointmentStylist.clear();
      this.appointmentDatetime.clear();
      this.router.navigate(['/citas']);
    },
    error: (err) => {
      this.confirmando.set(false);
      console.error('Error al reservar cita:', err.error);
    }
  });
}
}
