import { Component, inject, OnInit, signal } from '@angular/core';
import { AppointmentService } from '../../models/appointment-model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckShared } from '../../shared/check-shared/check-shared';
import { CitaService } from '../../services/citas/cita-service';

@Component({
  selector: 'app-first-appointment',
  imports: [CommonModule, CheckShared],
  templateUrl: './first-appointment.html',
  styleUrl: './first-appointment.css',
})
export class FirstAppointment implements OnInit {
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);
  private citaService = inject(CitaService);

  services = signal<any[]>([]);

  ngOnInit() {
    this.citaService.getCutTypes().subscribe({
      next: (res) => this.services.set(res.data ?? res),
      error: (err) => console.error(err)
    });
  }

  selectService(service: any) {
  this.appointmentService.setService(service);
  this.router.navigate(['/appointment/peluquero']);
}
}
