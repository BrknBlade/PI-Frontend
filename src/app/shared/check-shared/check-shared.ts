import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentService } from '../../models/appointment-model';
import { AppointmentStylist } from '../../models/secondAppointment-model';
import { AppointmentDatetime } from '../../models/thirdAppointment-model';

@Component({
  selector: 'app-check-shared',
  imports: [CommonModule],
  templateUrl: './check-shared.html',
  styleUrl: './check-shared.css',
})
export class CheckShared {
  @Input() currentPage: number = 1;

  totalPages = [1, 2, 3, 4];

  private router = inject(Router);
  private appointmentService = inject(AppointmentService);
  private appointmentStylist = inject(AppointmentStylist);
  private appointmentDatetime = inject(AppointmentDatetime);

  readonly routes: Record<number, string> = {
    1: '/appointment/servicio',
    2: '/appointment/peluquero',
    3: '/appointment/fecha-y-hora',
    4: '/appointment/confirmacion',
  };

  getPage(page: number): 'done' | 'active' | 'pending' {
    if (page < this.currentPage) return 'done';
    if (page === this.currentPage) return 'active';
    return 'pending';
  }

  isUnlocked(page: number): boolean {
    switch (page) {
      case 1: return true;
      case 2: return !!this.appointmentService.selectedService();
      case 3: return !!this.appointmentService.selectedService() && !!this.appointmentStylist.selectedService();
      case 4: return !!this.appointmentService.selectedService() && !!this.appointmentStylist.selectedService() && !!this.appointmentDatetime.selectedDatetime();
      default: return false;
    }
  }

  navigateTo(page: number) {
    if (this.isUnlocked(page) || page <= this.currentPage) {
      this.router.navigate([this.routes[page]]);
    }
  }
}
