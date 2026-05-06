import { Injectable, signal } from '@angular/core';

export interface Stylist {
  name: string;
  specialty: string;
  description: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentStylist {
  selectedService = signal<Stylist | null>(null);
}