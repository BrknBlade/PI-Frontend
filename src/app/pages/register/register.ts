import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { AuthService } from '../../services/auth/auth-service';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification/notification-service';
import { HomePage as Header } from '../../components/header/header';
import { registerModel } from '../../models/register-model';

@Component({
  selector: 'app-register',
  imports: [ FormField, Header, RouterLink ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm = form(registerModel);
  private authService = inject(AuthService);
  cargando = signal(false);
  private notificacionService = inject(NotificationService);
  tipoNotificacion = signal(false);
  error = signal(false);
  verPswd = signal(false);

  constructor(private router: Router) {}

  addColorRojo() {
    let inputs = document.querySelectorAll('input.error');
    inputs.forEach((i) => {
      i.classList.remove('error-fix');
    });
  }

  cambiarPswd() {
    if (this.verPswd()) {
      this.verPswd.set(false);
    } else {
      this.verPswd.set(true);
    }
    //this.verPswd() ? this.verPswd.set(true) : this.verPswd.set(false);
  }

  addFix() {
    let inputs = document.querySelectorAll('input.error');
    inputs.forEach((i) => {
      i.classList.add('error-fix');
    });
  }

  register(e: Event)
  {
    e.preventDefault();

    if(this.registerForm.name().value() == '' || this.registerForm.email().value() == '' || this.registerForm.password().value() == '')
    {
      this.error.set(true);
      this.addColorRojo();
      return
    }

    let notificacion = document.querySelector('.login-notificacion') as HTMLElement;
    let button = e.target as HTMLButtonElement;

    this.cargando.set(true);
    if (this.cargando()) {
      button.lastElementChild?.classList.add('carga-disabled');
    }

    let credentials: Object = {
      'name': this.registerForm.name().value(),
      'email': this.registerForm.email().value(),
      'password': this.registerForm.password().value(),
    }

    this.authService.register(credentials).subscribe({
      next: () => {
        this.tipoNotificacion.set(true);
        this.addFix();
        console.log('ya se ha resuleto');
        this.notificacionService.displayNotif(notificacion, this.cargando());
        this.cargando.set(false);
        button.lastElementChild?.classList.remove('carga-disabled');
        setTimeout(() => {
          this.notificacionService.hideNotif(notificacion, this.cargando());
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: () => {
        this.error.set(true);
        this.addColorRojo();
        this.tipoNotificacion.set(false);
        this.notificacionService.displayNotif(notificacion, this.cargando());
        this.cargando.set(false);
        button.lastElementChild?.classList.remove('carga-disabled');
        setTimeout(() => {
          this.notificacionService.hideNotif(notificacion, this.cargando());
        }, 3000);
        notificacion.classList.remove('salida');
      }
    });
  }
}
