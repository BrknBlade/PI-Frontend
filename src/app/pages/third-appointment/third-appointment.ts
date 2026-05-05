import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../models/appointment-model';
import { AppointmentStylist } from '../../models/secondAppointment-model';
import { AppointmentDatetime } from '../../models/thirdAppointment-model';
@Component({
  selector: 'app-third-appointment',
  imports: [RouterLink],
  templateUrl: './third-appointment.html',
  styleUrl: './third-appointment.css',
})
export class ThirdAppointment implements OnInit {
  appointmentService = inject(AppointmentService);
  appointmentStylist = inject(AppointmentStylist);
  appointmentDatetime = inject(AppointmentDatetime);

  ngOnInit(): void {
    this.getCalendarContent();
  }
  contenidoCalendario: any[] = [];
  estiloGridPrimerDia = signal<string>('');
  mesElegido = '';

  mes = new Date().getMonth();
  year = new Date().getFullYear();

  diaActual = new Date().getDate();
  mesActual = new Date().getMonth();
  yearActual = new Date().getFullYear();

  pruebaDia = signal<any>('');
  pruebaHora = signal<any>('');
  pruebaFecha = signal<any>('');
  pruebaMes: any;
  mesCondicion: any;
  yearCondicion: any;
  pruebaYear: any;

  inicioColumna = 0;
  finColumna = 0;

  horas = [
    { hora: '09:00', disponible: true },
    { hora: '10:00', disponible: false },
    { hora: '11:00', disponible: true },
    { hora: '12:00', disponible: true },
    { hora: '13:00', disponible: false },
    { hora: '14:00', disponible: true },
    { hora: '15:00', disponible: true },
    { hora: '16:00', disponible: false },
    { hora: '17:00', disponible: true },
    { hora: '18:00', disponible: true },
    { hora: '19:00', disponible: true },
    { hora: '20:00', disponible: true },
  ];

  getCalendarContent() {
    this.contenidoCalendario = [];
    const ultimoDia = new Date(this.year, this.mes + 1, 0).getDate();
    for (let dia = 1; dia <= ultimoDia; dia++) {
      let diaSemana = new Date(this.year, this.mes, dia).getDay();
      let dias: any = {};
      dias['dia'] = dia;
      dias['diaSemana'] = diaSemana;
      if (dia == 1 && diaSemana == 0) {
        this.inicioColumna = diaSemana - 1;
        this.finColumna = diaSemana - 2;
        this.estiloGridPrimerDia.set(`${this.inicioColumna} / ${this.finColumna}`);
      } else if (dia == 1 && diaSemana != 0) {
        this.inicioColumna = diaSemana;
        this.finColumna = diaSemana + 1;
        this.estiloGridPrimerDia.set(`${this.inicioColumna} / ${this.finColumna}`);
      }
      this.contenidoCalendario.push(dias);
    }
  }

  getMes() {
    switch (this.mes) {
      case 0:
        this.mesElegido = 'Enero';
        break;
      case 1:
        this.mesElegido = 'Febrero';
        break;
      case 2:
        this.mesElegido = 'Marzo';
        break;
      case 3:
        this.mesElegido = 'Abril';
        break;
      case 4:
        this.mesElegido = 'Mayo';
        break;
      case 5:
        this.mesElegido = 'Junio';
        break;
      case 6:
        this.mesElegido = 'Julio';
        break;
      case 7:
        this.mesElegido = 'Agosto';
        break;
      case 8:
        this.mesElegido = 'Septiembre';
        break;
      case 9:
        this.mesElegido = 'Octubre';
        break;
      case 10:
        this.mesElegido = 'Noviembre';
        break;
      case 11:
        this.mesElegido = 'Diciembre';
        break;
    }
    return this.mesElegido;
  }

  restarMes() {
    if (this.mes <= 0) {
      this.year = this.year - 1;
      this.mes = 11;
      this.pruebaMes = 11;
    } else {
      this.mes--;
      this.pruebaMes--;
    }
    this.getCalendarContent();
  }

  sumarMes() {
    if (this.mes >= 11) {
      this.year = this.year + 1;
      this.mes = 0;
      this.pruebaMes = 0;
    } else {
      this.mes++;
      this.pruebaMes++;
    }
    this.getCalendarContent();
  }

  seleccionarHora(event: Event) {
    let eleccion = event.target as HTMLElement;
    this.pruebaHora.set(eleccion?.textContent?.trim());
    this.pruebaFecha.set(
      `${this.pruebaYear}-0${this.pruebaMes}-${this.pruebaDia()}T${this.pruebaHora()}`,
    );
  }

  seleccionarDia(event: Event) {
    let eleccion = event.target as HTMLElement;
    this.pruebaDia.set(eleccion?.textContent?.trim());
    if (this.pruebaDia().length == 1) {
      this.pruebaDia.set('0' + this.pruebaDia());
    }
    this.mesCondicion = this.mes;
    this.yearCondicion = this.year;
    this.pruebaFecha.set(
      `${this.pruebaYear}-0${this.pruebaMes}-${this.pruebaDia()}T${this.pruebaHora()}`,
    );
  }

  confirmarCita() {
    if (this.pruebaDia() && this.pruebaHora()) {
      this.appointmentDatetime.setDatetime(
        `${this.year}-${String(this.mes + 1).padStart(2, '0')}-${this.pruebaDia()}`,
        this.pruebaHora(),
      );
    }
  }
}
