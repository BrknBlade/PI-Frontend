import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../models/appointment-model';
import { AppointmentStylist } from '../../models/secondAppointment-model';
import { Stylist } from '../../models/secondAppointment-model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckShared } from '../../shared/check-shared/check-shared';
import { CitaService } from '../../services/citas/cita-service';

@Component({
  selector: 'app-second-appointment',
  imports: [RouterModule, CommonModule, CheckShared],
  templateUrl: './second-appointment.html',
  styleUrl: './second-appointment.css',
})
export class SecondAppointment implements OnInit {
  appointmentService = inject(AppointmentService);
  private secondAppointment = inject(AppointmentStylist);
  private router = inject(Router);
  private citaService = inject(CitaService);

employees = signal<any[]>([]);

ngOnInit() {
  this.citaService.getEmployees().subscribe({
    next: (res) => this.employees.set(res.data ?? res),
    error: (err) => console.error(err)
  });
}

  selectStylist(employee: any) {
  this.secondAppointment.setStylist(employee);
  this.router.navigate(['/appointment/fecha-y-hora']);
}
}
