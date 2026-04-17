import { Component, OnInit, computed, inject, signal} from '@angular/core';
import { UserData } from '../../services/userData/user-data';

interface NumberDictionary{
  [key: string]: number;
}

@Component({
  selector: 'app-citas',
  imports: [],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})


export class Citas implements OnInit{
  numCitas = signal(0);
  iterableCitas = Array.from({length : this.numCitas()}, (_,i) => i);
  modal = false;

  userService = inject(UserData);

  userData = computed(() => this.userService.currentUser());
  userCitas = computed(() => this.userService.citas());


  contenidoCalendario:any = [];
  inicioColumna = 0;
  finColumna = 0;
  mes = new Date().getMonth();
  year = new Date().getFullYear();
  mesElegido = '';
  contador = signal(1);

  horaGuardada = 0;

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

  ngOnInit(): void {
    console.log(this.userData())
    console.log(this.userService.citas())
  }
  
  showModal(){
    console.log(this.modal);
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
    }, 0);//hago q se espere un poco para encontrar el boton ya qu eal generarlo no se crea en tiempo de ejecucion y daría null com oresultado


  } 

  guardarCambios(){
    let datosNuevos: any = {
      'dia': '',
      'hora': '',
    };
    //guardar el valor de la hora y la fecha nueva seleccionada con la clase eleccion
    let hora = document.querySelector<HTMLButtonElement>('.eleccion');// tambien sirve document.querySelector('.eleccion') as HTMLButtonElement
    let dia = document.querySelector('.dia') as HTMLButtonElement;
    if(hora){
      datosNuevos['hora'] = hora.value.slice(0, 2);
    }else{
      datosNuevos['hora'] = null;
    }
    if(dia){
      datosNuevos['dia'] = dia.textContent;
    }else{
      datosNuevos['dia'] = null;
    }
    console.log(datosNuevos)
    this.modal = !this.modal;
    return datosNuevos;
  }
  deleteCita(){

  }
}