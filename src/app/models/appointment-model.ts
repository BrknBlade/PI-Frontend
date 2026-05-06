import { Injectable, signal } from '@angular/core';

export interface Service {
  name: string;
  description: string;
  time: string;
  price: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  selectedService = signal<Service | null>(null);
}