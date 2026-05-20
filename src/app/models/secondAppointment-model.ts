import { Injectable, signal } from '@angular/core';

export interface Stylist {
  id: number;
  name: string;
  specialty: string;
  description: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentStylist {
  selectedService = signal<Stylist | null>(
    JSON.parse(localStorage.getItem('apt_stylist') ?? 'null')
  );

  setStylist(stylist: Stylist) {
    this.selectedService.set(stylist);
    localStorage.setItem('apt_stylist', JSON.stringify(stylist));
  }

  clear() {
    this.selectedService.set(null);
    localStorage.removeItem('apt_stylist');
  }
}
