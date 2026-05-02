import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  
  displayNotif(e: HTMLElement, typeOf:boolean) {
    if(typeOf){
      e?.classList.remove('salida');
      e?.classList.add('entrada');
    }
  }

  hideNotif(e: HTMLElement, typeOf:boolean){
    if(!typeOf){
      e?.classList.remove('entrada')
      e?.classList.add('salida')
    }
  }
}
