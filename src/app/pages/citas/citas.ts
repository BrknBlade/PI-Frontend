import { Component, signal} from '@angular/core';

interface NumberDictionary{
  [key: string]: number;
}

@Component({
  selector: 'app-citas',
  imports: [],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})


export class Citas {
  numCitas = signal(2);
  iterableCitas = Array.from({length : this.numCitas()}, (_,i) => i);
  modal = false;
  contenidoCalendario:any = [];
  inicioColumna = 0;
  finColumna = 0;
  mes = 1;
  mesElegido = '';
  
  showModal(){
    this.contenidoCalendario = [];
    let fecha = new Date();
    this.mes = new Date(fecha.getFullYear(), fecha.getMonth()-2, 1).getMonth();
    console.log(this.mes)
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth()+1, 0).getDate();
    for (let dia = 1; dia <= ultimoDia; dia++) {
      
      let diaSemana = new Date(fecha.getFullYear(), fecha.getMonth()+0, dia).getDay();
      let dias: NumberDictionary = {};
      dias['dia'] = dia;
      dias['diaSemana'] = diaSemana;
      if(dia == 1 && diaSemana == 0){
        this.inicioColumna = diaSemana - 1;
        this.finColumna = diaSemana - 2;
        console.log(this.inicioColumna)
      }else if(dia == 1 && diaSemana != 0){
        this.inicioColumna = diaSemana;
        this.finColumna = diaSemana + 1;
      }
      this.contenidoCalendario.push(dias);
    }
    console.log(this.contenidoCalendario)
 
    return this.modal = !this.modal;
  }
  getMes(){
    switch(this.mes){
      case 0:
        this.mesElegido = 'Diciembre'
        break;
      case 1:
        this.mesElegido = 'Enero'
        break;
      case 2:
        this.mesElegido = 'Febrero'
        break;
      case 3:
        this.mesElegido = 'Marzo'
        break;
      case 4:
        this.mesElegido = 'Abril'
        break;
      case 5:
        this.mesElegido = 'Mayo'
        break;
      case 6:
        this.mesElegido = 'Junio'
        break;
      case 7:
        this.mesElegido = 'Julio'
        break;
      case 8:
        this.mesElegido = 'Agosto'
        break;
      case 9:
        this.mesElegido = 'Septiembre'
        break;
      case 10:
        this.mesElegido = 'Octubre'
        break;
      case 11:
        this.mesElegido = 'Noviembre'
        break;
    }
      return this.mesElegido;
  }
  
  blurred(){
    
  }

  deleteCita(){

  }
}
