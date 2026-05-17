import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppointmentDatetime {
  selectedDatetime = signal<{ fecha: string; hora: string } | null>(
    JSON.parse(localStorage.getItem('apt_datetime') ?? 'null')
  );

  setDatetime(fecha: string, hora: string) {
    this.selectedDatetime.set({ fecha, hora });
    localStorage.setItem('apt_datetime', JSON.stringify({ fecha, hora }));
  }

  clear() {
    this.selectedDatetime.set(null);
    localStorage.removeItem('apt_datetime');
  }
}
