import { Component, Input, OnInit, inject, signal} from '@angular/core';
import { UserData } from '../../services/userData/user-data';
import { AuthService } from '../../services/auth/auth-service';
import { CutData } from '../../services/cutData/cut-data';
import { firstValueFrom, forkJoin, map, Observable } from 'rxjs';
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

  contenidoCalendario:any = [];
  inicioColumna = 0;
  finColumna = 0;
  mes = new Date().getMonth();
  year = new Date().getFullYear();
  mesElegido = '';

  diaActual = new Date().getDate();
  mesActual = new Date().getMonth();
  yearActual = new Date().getFullYear();

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

  idCita: any;

  ngOnInit(): void {
    this.pintarCitas()

    console.log('Datos: ', this.user())
  }

  pintarCitas(){
    this.userDataService.getCitas().subscribe(() => {
      const requests = this.citas().map((cita: any) => {
        this.diaCita = cita.date;
        this.diaCita = this.diaCita.slice(8, 10);
        return this.cutDataService.getCut(cita.id);
      }
      )  as Observable<any>[];

      forkJoin(requests).subscribe((resultados: any[]) => {//investigar esto
        resultados.forEach(data => {
          if (!data) return;
          this.citaVars.update(current => ({
            ...current,
            [data.data.id]: data.data.name
          }));
        });
        this.cargando.set(false); 
      });
    });
  }
  
  showModal(event: Event){
    let boton = event.target as HTMLButtonElement;
    let inputID = boton.parentElement?.firstElementChild as HTMLElement;
    this.idCita = inputID.getAttribute('value');

    this.getCalendarContent();
    return this.modal = true;
  }
  closeModal(){
    return this.modal = false;
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
      }else if(dia == 1 && diaSemana != 0){
        this.inicioColumna = diaSemana;
        this.finColumna = diaSemana + 1;
      }
      this.contenidoCalendario.push(dias);
      }
    this.ajustarcalendario();
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
    }else{
      this.mes--;
    }
    this.getCalendarContent();
  }

  sumarMes(){
    if(this.mes >= 11){
      this.year = this.year+1;
      this.mes = 0;
    }else{
      this.mes++;
    }
    this.getCalendarContent();
  }

  seleccionarHora(event: Event){
    let eleccion = event.target as HTMLElement;
    let boton = document.querySelector('.hora.eleccion');

    if(boton?.className.includes('eleccion')){
      boton.classList.remove('eleccion');
      if(eleccion == boton){
        return;
      }
    }
    eleccion.classList.add('eleccion')
  }

  seleccionarDia(event: Event){
    let eleccion = event.target as HTMLElement;
    let botonAntiguo = document.querySelector('.calendario button.dia');

    if(botonAntiguo?.className.includes('dia')){
      botonAntiguo.classList.remove('dia');
      if(eleccion == botonAntiguo){
        return;
      }
    }
    eleccion.classList.add('dia')
  }

  ajustarcalendario(){
    setTimeout(() => {
      const primerDia = document.querySelector('.calendario button') as HTMLButtonElement;
      primerDia.style.gridColumn = `${this.inicioColumna} / ${this.finColumna}`;
    }, 0);//hago q se espere un poco para encontrar el boton ya que al generarlo no se crea en tiempo de ejecucion y daría null como resultado
  } 

  async guardarCambios(){
    let datosNuevos: any = {
      'date': '',
      'hour': '',
    };
    //guardar el valor de la hora y la fecha nueva seleccionada con la clase eleccion
    let hora = document.querySelector<HTMLButtonElement>('.eleccion');// tambien sirve document.querySelector('.eleccion') as HTMLButtonElement
    let dia = document.querySelector('.dia') as HTMLButtonElement;
    if(hora){
      datosNuevos['hour'] = hora.value;
    }else{
      datosNuevos['hour'] = null;
    }
    if(dia){
      datosNuevos['date'] = this.year + '-0' + (this.mes + 1)  + '-' + dia.textContent;
    }else{
      datosNuevos['date'] = null;
    }
    console.log(datosNuevos)

    await firstValueFrom(this.citaService.updateCita(this.idCita, datosNuevos));
    this.pintarCitas();

    this.modal = !this.modal;

    return datosNuevos;
  }
  deleteCita(){

  }
}