import { Component, DoCheck } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-navigation-admin',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './navigation-admin.html',
  styleUrl: './navigation-admin.css',
})
export class NavigationAdmin implements DoCheck{

  ngDoCheck(): void {
    this.controlActivo();
  }

  controlActivo(){
    let seccionActual = location.href.split('/admin/')[1];

    let enlaces = document.querySelectorAll('.admin-acciones a');
    enlaces.forEach( a => {
      a.classList.remove('activo');
      if(seccionActual.toLocaleLowerCase() == a.textContent.toLocaleLowerCase()){
        a.classList.add('activo');
      }
    });
  }
}
