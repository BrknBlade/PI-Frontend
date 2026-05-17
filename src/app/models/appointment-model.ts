import { Injectable, signal } from '@angular/core';

export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  selectedService = signal<Service | null>(
    JSON.parse(localStorage.getItem('apt_service') ?? 'null')
  );

  setService(service: Service) {
    this.selectedService.set(service);
    localStorage.setItem('apt_service', JSON.stringify(service));
  }

  clear() {
    this.selectedService.set(null);
    localStorage.removeItem('apt_service');
  }
}
