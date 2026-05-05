import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppointmentDatetime {
  selectedDatetime = signal<{ fecha: string; hora: string } | null>(null);

  setDatetime(fecha: string, hora: string) {
    this.selectedDatetime.set({ fecha, hora });
  }
}
