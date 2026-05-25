import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HomePage {
  router = inject(Router);
  authService = inject(AuthService);
  cerrarSesion = signal(false);
  cancelarCita = false;
  isAdmin = computed(() => this.authService.user()?.role === 1);

  logout(){
    this.authService.logout().subscribe(() => {
      this.closeCancel()
      this.router.navigate(['/login']);
    });
  }

  async controlHeader(abriendo: boolean) {
    await new Promise(resolve => setTimeout(resolve, 0));

    const header = document.querySelector('app-header header');

    if (abriendo) {
      header?.classList.add('header-off');
    } else {
      header?.classList.remove('header-off');
    }
  }

  closeCancel(){
    this.cerrarSesion.set(false);
    this.controlHeader(false);
    this.cancelarCita = false;
  }

  mostrarAviso(){
    if(this.cerrarSesion()){
      this.cerrarSesion.set(false);
      this.controlHeader(false);
    }else{
      this.cerrarSesion.set(true);
      this.controlHeader(true);
    }
  }
}
