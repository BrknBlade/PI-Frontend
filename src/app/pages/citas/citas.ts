import { ChangeDetectorRef, Component, OnInit, inject, signal} from '@angular/core';
import { UserData } from '../../services/userData/user-data';
import { AuthService } from '../../services/auth/auth-service';
import { CutData } from '../../services/cutData/cut-data';
import { firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CitaService } from '../../services/citas/cita-service';

interface NumberDictionary{
  [key: string]: number;
}

@Component({
  selector: 'app-citas',
  imports: [DatePipe],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})


export class Citas implements OnInit{
  modal = false;
  cambiarCita = false;
  cancelarCita = false;

  datosNuevos: any = {
    'date': '',
    'hour': '',
  };

  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private userDataService = inject(UserData);
  private cutDataService = inject(CutData);
  private citaService = inject(CitaService);

  cargando = signal(true);

  user = this.authService.user;
  citas = this.userDataService.citas;
  cutData = this.cutDataService.cutData;


  citaVars = signal<Record<number, any>>({});
  diaCita: any;
  diaCitaCalendario: any;
  horaCitaCalendario: any;

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
  ];


  ngOnInit(): void {
    this.pintarCitas()

    console.log('Datos: ', this.user())
  }

  async pintarCitas() {
    const response: any = await firstValueFrom(this.userDataService.getCitas());
    const citas = response.data;

    for (const cita of citas) {
      const data: any = await firstValueFrom(this.cutDataService.getCut(cita.cut_type_id));
      if (!data) continue;
      this.citaVars.update(current => ({ ...current, [cita.cut_type_id]: data.data.name }));
    }

    this.cargando.set(false);
  }

  openCancelCita(event: Event){
    this.controlHeader();

    this.cancelarCita = true;
    //guardar el valor de la hora y la fecha nueva seleccionada con la clase eleccion
    let boton = event.target as HTMLButtonElement;
    let inputID = boton.parentElement?.firstElementChild as HTMLElement;
    let nombreCorteElement = boton.parentElement?.parentElement?.firstElementChild as HTMLElement;
    this.nombreCorte = nombreCorteElement.textContent;
    let idCita = inputID.getAttribute('value');

    if(idCita){
      idCita = idCita?.trim();
      let valores = idCita.split(' ');
      let id = valores[0];
      console.log('id: ', id);
      this.idCita = id;
    }
  }

  closeCancel(){
    this.controlHeader();
    this.cancelarCita = false;
  }

  openAlert(){
    let e: Event = new Event('click');

    this.cambiarCita = true;
    //guardar el valor de la hora y la fecha nueva seleccionada con la clase eleccion
    let hora = document.querySelector<HTMLButtonElement>('.eleccion');// tambien sirve document.querySelector('.eleccion') as HTMLButtonElement
    let dia = document.querySelector('.dia') as HTMLButtonElement;
    if(hora){
      this.datosNuevos['hour'] = hora.value;
    }else{
      this.datosNuevos['hour'] = null;
    }

    if(dia){
      console.log(dia.textContent)
      this.datosNuevos['date'] = this.year + '-0' + (this.mes + 1)  + '-' + dia.textContent.trim();
    }else{
      this.datosNuevos['date'] = `${this.pruebaYear}-0${this.pruebaMes}-${this.pruebaDia()}`;
    }
    console.log(this.datosNuevos)

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

  showModal(event: Event){
    let boton = event.target as HTMLButtonElement;
    let inputID = boton.parentElement?.firstElementChild as HTMLElement;

    let idCita = inputID.getAttribute('value');

    if(idCita){
      idCita = idCita?.trim();
      let valores = idCita.split(' ');
      let horaValores = valores[1].split(':');
      this.horaAntigua = `${horaValores[0]}:${horaValores[1]}`;
    }
    this.idCita = inputID.getAttribute('value');

    let div = boton.parentElement?.parentElement?.children;
    if(div){
      let fechaAntigua = div[4] as HTMLInputElement;
      this.fechaAntigua =  fechaAntigua.value;

    }

    //this.getDiaCita(this.idCita);

    this.recogerDatosCitasDOM(event);

    this.getCalendarContent();

    this.modal = true;
    if(this.modal){
      this.controlHeader();
    }
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

  seleccionarHora(event: Event){
    let eleccion = event.target as HTMLElement;

    this.pruebaHora.set(eleccion?.textContent?.trim());

    this.pruebaFecha.set(`${this.pruebaYear}-0${this.pruebaMes}-${this.pruebaDia()}T${this.pruebaHora()}`)

    console.log(this.pruebaHora());

  }

  seleccionarDia(event: Event){
    let eleccion = event.target as HTMLElement;


    this.pruebaDia.set(eleccion?.textContent?.trim());

    if(this.pruebaDia().length == 1){
      this.pruebaDia.set('0' + this.pruebaDia());
    }

    this.mesCondicion = this.mes;
    this.yearCondicion = this.year;

    this.pruebaFecha.set(`${this.pruebaYear}-0${this.pruebaMes}-${this.pruebaDia()}T${this.pruebaHora()}`)


    console.log(this.pruebaDia());
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
          //console.log(diaIndv.textContent)
          if(this.diaCitaCalendario == diaIndv.textContent){
            diaIndv.classList.add('dia')
          }
        }
      }, 0);
    });
  }

  async guardarCambios(){
    await firstValueFrom(this.citaService.updateCita(this.idCita, this.datosNuevos));
    this.pintarCitas();

    await this.closeAlert()

    return this.datosNuevos;
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

  async deleteCita(){
    this.citaService.deleteCita(this.idCita).subscribe(async () => {
      await this.pintarCitas();
      this.cancelarCita = false;
      document.querySelector('app-header')?.classList.remove('header-off');
    });
  }
}
