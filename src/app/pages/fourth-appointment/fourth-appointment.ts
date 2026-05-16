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

  showToast = false;
  confirmando = signal(false);

  fullName = '';
  email = '';
  phone = '';
  gender = '';
  description = '';
  acceptedTerms = false;

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

    if (!service || !datetime) {
      console.error('Faltan datos del paso anterior');
      return;
    }

    const datos = {
      cut_type_id: service.id,
      date: datetime.fecha,
      hour: datetime.hora,
      gender: this.gender,
      description: this.description,
    };

    this.confirmando.set(true);

    this.citaService.postCita(datos).subscribe({
      next: () => {
        this.confirmando.set(false);
        // Limpiar localStorage al completar la reserva
        this.appointmentService.clear();
        this.appointmentStylist.clear();
        this.appointmentDatetime.clear();
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
          this.router.navigate(['/citas']);
        }, 2500);
      },
      error: (err) => {
        this.confirmando.set(false);
        console.error('Error:', err.error);
      }
    });
  }
}
