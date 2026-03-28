import { Component, DoCheck, signal} from '@angular/core';

interface NumberDictionary{
  [key: string]: number;
}

@Component({
  selector: 'app-citas',
  imports: [],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})


export class Citas implements DoCheck{
  numCitas = signal(2);
  iterableCitas = Array.from({length : this.numCitas()}, (_,i) => i);
  modal = false;

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

  showModal(){

    this.getCalendarContent();
    return this.modal = !this.modal;
  }

  getCalendarContent(){
    //TODO eliminar cualquier clase eleccion apra q no este selccioando 
    this.contenidoCalendario = [];
    let fecha = new Date();
    console.log('Dia ACTUAL: ' +  this.diaActual);
    //console.log('Mes ACTUAL: ' +  new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()).getMonth())
    //console.log('Mes: ' +this.mes)
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
    //console.log(this.contenidoCalendario)
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

  ngDoCheck(): void {
    console.log(`Mes actual: ${this.mesActual}. Mes: ${this.mes}`)
    this.ajustarcalendario()
    //return //console.log('Mes: ' + this.mes)
  }

  seleccionarHora(event: Event){
    console.log(event.target)
    let eleccion = event.target as HTMLElement;
    let boton = document.querySelector('.hora.eleccion');

    if(boton?.className.includes('eleccion')){
      boton.classList.remove('eleccion');
    }
    eleccion.classList.add('eleccion')
  }

  seleccionarDia(event: Event){
    console.log(event.target)
    let eleccion = event.target as HTMLElement;
    let botonAntiguo = document.querySelector('.calendario button.dia');
    console.log(botonAntiguo)

    if(botonAntiguo?.className.includes('dia')){
      botonAntiguo.classList.remove('dia');
    }
    eleccion.classList.add('dia')
  }

  async ajustarcalendario(){
    const diaUno = await this.waitForElement('.calendario button');
    console.log(diaUno)
  } 
  waitForElement(selector: string): Promise<Element> {
    return new Promise((resolve) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
  }


  guardarCambios(){
    //guardar el valor de la hora y la fecha nueva seleccionada con la clase eleccion
    let eleccion = document.querySelector<HTMLButtonElement>('.eleccion');// tambien sirve document.querySelector('.eleccion') as HTMLButtonElement
    console.log('Hora: ' +  eleccion?.value);//hora y en caso de ser null devuelve undefined
  }
  deleteCita(){

  }
}