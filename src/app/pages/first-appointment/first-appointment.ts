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

hairPhotos = [
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1470259078422-826894b933aa?w=400&h=400&fit=crop',
];

getPhoto(index: number): string {
  return this.hairPhotos[index % this.hairPhotos.length];
}
}
