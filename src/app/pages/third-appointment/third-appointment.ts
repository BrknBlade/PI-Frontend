import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../models/appointment-model';
import { AppointmentStylist } from '../../models/secondAppointment-model';
import { AppointmentDatetime } from '../../models/thirdAppointment-model';
import { CheckShared } from "../../shared/check-shared/check-shared";
import { CitaService } from '../../services/citas/cita-service';

@Component({
  selector: 'app-third-appointment',
  imports: [RouterLink, CheckShared],
  templateUrl: './third-appointment.html',
  styleUrl: './third-appointment.css',
})
export class ThirdAppointment implements OnInit {
  appointmentService = inject(AppointmentService);
  appointmentStylist = inject(AppointmentStylist);
  appointmentDatetime = inject(AppointmentDatetime);
  citaService = inject(CitaService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.getCalendarContent();

    const dt = this.appointmentDatetime.selectedDatetime();
    if (dt) {
      const partes = dt.fecha.split('-');
      this.year = parseInt(partes[0]);
      this.mes = parseInt(partes[1]) - 1;
      this.pruebaMes = parseInt(partes[1]);
      this.pruebaYear = parseInt(partes[0]);
      this.pruebaDia.set(partes[2]);
      this.pruebaHora.set(dt.hora);
      this.mesCondicion = this.mes;
      this.yearCondicion = this.year;
      this.getCalendarContent();

      // Al entrar en el paso 3 con fecha preseleccionada, cargamos las horas
      // ocupadas inmediatamente sin esperar a que el usuario clique un día
      this.cargarHorasOcupadas(dt.fecha);
    }
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
  pruebaMes = this.mes + 1;
  mesCondicion: any;
  yearCondicion: any;
  pruebaYear = this.year;

  inicioColumna = 0;
  finColumna = 0;
  horasCargadas = false;

  horasBase = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
  ];

  // El array de horas lo generamos siempre desde horasBase para evitar
  // que un .map() sobre datos corruptos acumule estado raro entre días
  horas = this.horasBase.map(h => ({ hora: h, disponible: true }));

  private cargarHorasOcupadas(fecha: string): void {
  this.horasCargadas = false;
  this.horas = this.horasBase.map(h => ({ hora: h, disponible: true }));

  this.citaService.getOccupiedHours(fecha).subscribe({
    next: ({ occupied }) => {
      const normalizadas = occupied.map((h: string) => h.substring(0, 5));
      this.horas = this.horasBase.map(h => ({
        hora: h,
        disponible: !normalizadas.includes(h),
      }));
      this.horasCargadas = true;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error cargando horas:', err);
      this.horasCargadas = true;
      this.cdr.detectChanges();
    },
  });
}

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
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    this.mesElegido = meses[this.mes];
    return this.mesElegido;
  }

  restarMes() {
    if (this.mes <= 0) {
      this.year--;
      this.mes = 11;
      this.pruebaMes = 12;
    } else {
      this.mes--;
      this.pruebaMes--;
    }
    this.pruebaYear = this.year;
    this.getCalendarContent();
  }

  sumarMes() {
    if (this.mes >= 11) {
      this.year++;
      this.mes = 0;
      this.pruebaMes = 1;
    } else {
      this.mes++;
      this.pruebaMes++;
    }
    this.pruebaYear = this.year;
    this.getCalendarContent();
  }

  seleccionarDia(event: Event) {
    let eleccion = event.target as HTMLElement;
    this.pruebaDia.set(eleccion?.textContent?.trim());

    if (this.pruebaDia().length == 1) {
      this.pruebaDia.set('0' + this.pruebaDia());
    }

    this.mesCondicion = this.mes;
    this.yearCondicion = this.year;
    this.pruebaHora.set('');

    const fecha = `${this.pruebaYear}-${String(this.pruebaMes).padStart(2, '0')}-${this.pruebaDia()}`;
    this.cargarHorasOcupadas(fecha);
    // Ya no hay reset manual aquí — cargarHorasOcupadas lo hace internamente al principio
  }

  seleccionarHora(event: Event) {
    let eleccion = event.target as HTMLButtonElement;
    this.pruebaHora.set(eleccion?.value?.trim());
  }

  confirmarCita() {
    if (this.pruebaDia() && this.pruebaHora()) {
      this.appointmentDatetime.setDatetime(
        `${this.year}-${String(this.mes + 1).padStart(2, '0')}-${this.pruebaDia()}`,
        this.pruebaHora(),
      );
      this.router.navigate(['/appointment/confirmacion']);
    }
  }
}
