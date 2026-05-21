import { ChangeDetectorRef, Component, OnInit, inject, signal} from '@angular/core';
import { UserData } from '../../services/userData/user-data';
import { AuthService } from '../../services/auth/auth-service';
import { CutData } from '../../services/cutData/cut-data';
import { firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CitaService } from '../../services/citas/cita-service';
import { Router, RouterLink } from '@angular/router';

interface NumberDictionary{
  [key: string]: number;
}

@Component({
  selector: 'app-citas',
  imports: [DatePipe, RouterLink],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})


export class Citas implements OnInit{
  modal = false;
  cambiarCita = false;
  cancelarCita = false;
  tabActiva = signal<string>('citas');


  datosNuevos: any = {
    'date': '',
    'hour': '',
  };

  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private userDataService = inject(UserData);
  private cutDataService = inject(CutData);
  private citaService = inject(CitaService);
  private router = inject(Router);

  confirmarLogout = false;
  cargando = signal(true);

  user = this.authService.user;
  citas = this.userDataService.citas;
  cutData = this.cutDataService.cutData;


  citaVars = signal<Record<number, any>>({});
  diaCita: any;
  diaCitaCalendario: any;
  horaCitaCalendario: any;
  empleadoVars = signal<Record<number, string>>({});
  contenidoCalendario:any = [];
  inicioColumna = 0;
  finColumna = 0;
  estiloGridPrimerDia = signal<string>('');

  mes = new Date().getMonth();
  year = new Date().getFullYear();
  mesElegido = '';

  diaActual = new Date().getDate();
  mesActual = new Date().getMonth();
  yearActual = new Date().getFullYear();


  pruebaHora = signal<any>('');
  pruebaFecha = signal<any>('');
  pruebaDia = signal<any>('');
  pruebaMes: any;
  mesCondicion: any;
  yearCondicion: any;
  pruebaYear: any;

  fechaAntigua: any;
  horaAntigua: any;

  idCita: any;
  nombreCorte: any;
  eliminando = signal(false);
  guardando = signal(false);

horasBase = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00',
];

horas = this.horasBase.map(h => ({ hora: h, disponible: true }));
horasCargadas = false;

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


  ngOnInit(): void {
    this.pintarCitas()

    console.log('Datos: ', this.user())
  }

  async pintarCitas() {
  const response: any = await firstValueFrom(this.userDataService.getCitas());
  const citas = response.data;

  const empleados: any = await firstValueFrom(this.citaService.getEmployees());
  const mapaEmpleados: Record<number, string> = {};
  for (const emp of (empleados.data ?? empleados)) {
    mapaEmpleados[emp.id] = emp.name;
  }
  this.empleadoVars.set(mapaEmpleados);

  for (const cita of citas) {
    const data: any = await firstValueFrom(this.cutDataService.getCut(cita.cut_type_id));
    if (!data) continue;

    this.citaVars.update(current => ({
      ...current,
      [cita.cut_type_id]: {
        name: data.data.name,
        price: data.data.price ? `${data.data.price}€` : null,
        duration: data.data.duration ? `${data.data.duration} min` : null,
      }
    }));
  }

  this.cargando.set(false);
  console.log('citas:', citas);
console.log('empleados:', mapaEmpleados);
}

  openCancelCita(event: Event) {
  const boton = event.target as HTMLButtonElement;
  const div = boton.closest('.cita-info') as HTMLElement;
  const h2 = div.querySelector('h2');

  this.nombreCorte = h2?.textContent?.trim();
  this.idCita = div.dataset['id'];

  this.cancelarCita = true;
  this.controlHeader();
}

  closeCancel(){
    this.controlHeader();
    this.cancelarCita = false;
  }

  openAlert() {
  if (!this.datosNuevos['date']) {
    this.datosNuevos['date'] = this.fechaAntigua;
  }
  if (!this.datosNuevos['hour']) {
    this.datosNuevos['hour'] = this.horaAntigua;
  }
  console.log('openAlert datos:', this.datosNuevos);
  this.cambiarCita = true;
  this.closeModal();
}

  async closeAlert(){
    this.cambiarCita = false;
    this.modal = false;

    this.cdr.detectChanges();

    await new Promise(resolve => setTimeout(resolve, 0));
    this.controlHeader();
  }

  cancelAlert(){
    this.controlHeader();

    this.cambiarCita = false;

    this.modal = true;
  }

  showModal(event: Event) {
  const boton = event.target as HTMLButtonElement;
  const div = boton.closest('.cita-info') as HTMLElement;

  const fecha = div.dataset['date']!;
  const hora = div.dataset['hour']!;
  const id = div.dataset['id']!;

  this.idCita = id;
  this.fechaAntigua = fecha;

  const horaValores = hora.split(':');
  this.horaAntigua = `${horaValores[0]}:${horaValores[1]}`;

const partesFecha = fecha.split('-');
this.pruebaYear = partesFecha[0];
this.pruebaMes = parseInt(partesFecha[1]);
this.pruebaDia.set(partesFecha[2]);
this.mesCondicion = this.pruebaMes - 1;
this.yearCondicion = parseInt(this.pruebaYear);
this.mes = this.pruebaMes - 1;
this.year = parseInt(this.pruebaYear);

const horaLimpia = hora.slice(0, 5);
this.pruebaHora.set(horaLimpia);
this.pruebaFecha.set(`${fecha}T${horaLimpia}`);

  this.getCalendarContent();
  this.cargarHorasOcupadas(fecha);
this.modal = true;
  this.modal = true;
  this.controlHeader();
}
  closeModal(){
    this.modal = false;

    this.controlHeader();
  }

  recogerDatosCitasDOM(event: Event){
    let e = event.target as HTMLButtonElement;
    let div = e.parentElement?.parentElement;
    let divHijos = div?.children;
      console.log(divHijos)

    if(divHijos){
      let dia = divHijos[2];
      let hora = divHijos[3];
      console.log(dia.textContent.match(/,\s*(\d{1,2})/)?.[1]);
      this.pruebaDia.set(dia.textContent.match(/,\s*(\d{1,2})/)?.[1]);

      this.pruebaMes = this.getMesNumero((dia.textContent.match(/\d{1,2} de (\w+) de/)?.[1]));

      this.mesCondicion = this.pruebaMes;

      this.pruebaMes = (this.pruebaMes +1);

      this.pruebaYear = dia.textContent?.match(/de (\d{4})/)?.[1];

      this.yearCondicion = this.pruebaYear;

      console.log(this.pruebaDia())
      console.log(this.pruebaDia().length)
      if(this.pruebaDia().length == 1){
        this.pruebaDia.set('0' + this.pruebaDia());
        console.log(this.pruebaDia())

      }

      this.pruebaHora.set(hora.textContent)

      if(this.pruebaHora().length == 4){
        this.pruebaHora.set('0' + this.pruebaHora());
      }
      console.log(this.pruebaDia())


      this.pruebaFecha.set(`${this.pruebaYear}-0${this.pruebaMes}-${this.pruebaDia()}T${this.pruebaHora()}`);
      console.log(this.pruebaFecha())

    }

  }
  getMesNumero(mes: any) {
    switch(mes){
      case 'enero':
        return 0;
      case 'febrero':
        return 1;
      case 'marzo':
        return 2;
      case 'abril':
        return 3;
      case 'mayo':
        return 4;
      case 'junio':
        return 5;
      case 'julio':
        return 6;
      case 'agosto':
        return 7;
      case 'septiembre':
        return 8;
      case 'octubre':
        return 9;
      case 'noviembre':
        return 10;
      case 'diciembre':
        return 11;
      default:
        return null;
    }
  }


  getCalendarContent(){
    this.contenidoCalendario = [];
    const ultimoDia = new Date(this.year, this.mes+1, 0).getDate();
    for (let dia = 1; dia <= ultimoDia; dia++) {
      let diaSemana = new Date(this.year, this.mes, dia).getDay();
      let dias: NumberDictionary = {};
      dias['dia'] = dia;
      dias['diaSemana'] = diaSemana;
      if(dia == 1 && diaSemana == 0){
        this.inicioColumna = diaSemana - 1;
        this.finColumna = diaSemana - 2;
        this.estiloGridPrimerDia.set(`${this.inicioColumna} / ${this.finColumna}`);
      }else if(dia == 1 && diaSemana != 0){
        this.inicioColumna = diaSemana;
        this.finColumna = diaSemana + 1;
        this.estiloGridPrimerDia.set(`${this.inicioColumna} / ${this.finColumna}`);
      }
      this.contenidoCalendario.push(dias);
    }
  }

  getMes(){
    switch(this.mes){
      case 0:
        this.mesElegido = 'Enero'
        break;
      case 1:
        this.mesElegido = 'Febrero'
        break;
      case 2:
        this.mesElegido = 'Marzo'
        break;
      case 3:
        this.mesElegido = 'Abril'
        break;
      case 4:
        this.mesElegido = 'Mayo'
        break;
      case 5:
        this.mesElegido = 'Junio'
        break;
      case 6:
        this.mesElegido = 'Julio'
        break;
      case 7:
        this.mesElegido = 'Agosto'
        break;
      case 8:
        this.mesElegido = 'Septiembre'
        break;
      case 9:
        this.mesElegido = 'Octubre'
        break;
      case 10:
        this.mesElegido = 'Noviembre'
        break;
      case 11:
        this.mesElegido = 'Diciembre'
        break;
    }
      return this.mesElegido;
  }

  restarMes(){
    if(this.mes <= 0){
      this.year = this.year-1;
      this.mes = 11;
      this.pruebaMes = 11;
    }else{
      this.mes--;
      this.pruebaMes--;
    }

    this.getCalendarContent();


  }

  sumarMes(){
    if(this.mes >= 11){
      this.year = this.year+1;
      this.mes = 0;
      this.pruebaMes = 0;
    }else{
      this.mes++;
      this.pruebaMes++;
    }
    console.log(this.yearActual, this.yearCondicion, this.mesActual, this.mesCondicion, this.mes)
    this.getCalendarContent();


  }

seleccionarHora(event: Event) {
  const eleccion = event.target as HTMLElement;
  const hora = eleccion?.textContent?.trim() ?? '';
  this.pruebaHora.set(hora);
  this.datosNuevos['hour'] = hora; // sin :00
  this.pruebaFecha.set(`${this.pruebaYear}-${String(this.pruebaMes).padStart(2,'0')}-${this.pruebaDia()}T${hora}`);
}

seleccionarDia(event: Event) {
  const eleccion = event.target as HTMLElement;
  const dia = eleccion?.textContent?.trim().padStart(2,'0') ?? '';
  this.pruebaDia.set(dia);
  this.mesCondicion = this.mes;
  this.yearCondicion = this.year;
  const mesNum = String(this.mes + 1).padStart(2, '0');
  this.datosNuevos['date'] = `${this.year}-${mesNum}-${dia}`;
  this.pruebaFecha.set(`${this.year}-${mesNum}-${dia}T${this.pruebaHora()}`);

  // Añade esto:
  const fecha = `${this.year}-${mesNum}-${dia}`;
  this.cargarHorasOcupadas(fecha);
}

  getDiaCita(id: any): any{
    this.citaService.getCita(id).subscribe((r)=>{
      this.diaCitaCalendario =  r.data.date.slice(8, 10);

      if(this.diaCitaCalendario.slice(0, 1) == 0){
        this.diaCitaCalendario =  this.diaCitaCalendario.slice(1, 2);
      }
      this.horaCitaCalendario = r.data.hour.slice(0,5);

      setTimeout(() => {
        let diasCalendario = document.querySelectorAll('.calendario button')

        for (const diaIndv of diasCalendario) {
          if(this.diaCitaCalendario == diaIndv.textContent){
            diaIndv.classList.add('dia')
          }
        }
      }, 0);
    });
  }

  async guardarCambios() {
  this.guardando.set(true);
  console.log('Enviando:', this.datosNuevos);
  try {
    await firstValueFrom(this.citaService.updateCita(this.idCita, this.datosNuevos));
    await this.pintarCitas();
    this.guardando.set(false);
    await this.closeAlert();
  } catch (err: any) {
    console.log('Error detallado:', err.error);
    this.guardando.set(false);
  }
}

  async controlHeader() {
    await new Promise(resolve => setTimeout(resolve, 0));

    const header = document.querySelector('app-header');
    const dialog = document.querySelector('dialog');

    if (dialog) {
      header?.classList.add('header-off');
    } else {
      header?.classList.remove('header-off');
    }
  }

  async deleteCita() {
  this.eliminando.set(true);
  this.citaService.deleteCita(this.idCita).subscribe(async () => {
    await this.pintarCitas();
    this.eliminando.set(false);
    this.cancelarCita = false;
    document.querySelector('app-header')?.classList.remove('header-off');
  });
}

logout() {
  this.confirmarLogout = false;
  this.authService.logout().subscribe({
    next: () => this.router.navigate(['/login']),
    error: () => this.router.navigate(['/login'])
  });
}
}
