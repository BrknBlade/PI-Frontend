import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { loginModel } from '../../models/login-model';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification-service';


@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = form(loginModel);
  private authService = inject(AuthService);
  cargando = signal(false);
  private notificacionService = inject(NotificationService);
  tipoNotificacion = signal(false);
  error = signal(false);


  constructor(private router: Router){}

  addColorRojo(){
    let inputs = document.querySelectorAll('input.error');
    inputs.forEach((i) =>{
        i.classList.remove('error-fix');
    });
  }

  addFix(){
    let inputs = document.querySelectorAll('input.error');
    inputs.forEach((i) =>{
      i.classList.add('error-fix');
    });
  }

  login(e:Event) {
    e.preventDefault();
    let button = e.target as HTMLButtonElement;
    let notificacion = document.querySelector('.login-notificacion') as HTMLElement;

    this.cargando.set(true);
    if(this.cargando()){
      button.lastElementChild?.classList.add('carga-disabled')
      
    }

    const credentials: Object = {
      email : this.loginForm.email().value(),
      password : this.loginForm.password().value()
    }
    this.authService.login(credentials).subscribe({
      next: () =>{
        this.tipoNotificacion.set(true);
        this.addFix();
        console.log('ya se ha resuleto')
        this.notificacionService.displayNotif(notificacion, this.cargando());
        this.cargando.set(false);
        button.lastElementChild?.classList.remove('carga-disabled')
        setTimeout(() => {
          this.notificacionService.hideNotif(notificacion, this.cargando());
          this.router.navigate(['/citas'])
        }, 2500);
      },
      error: (err) =>{
        this.error.set(true)
        this.addColorRojo();
        this.tipoNotificacion.set(false);
        this.notificacionService.displayNotif(notificacion, this.cargando());
        this.cargando.set(false);
        button.lastElementChild?.classList.remove('carga-disabled')
        setTimeout(() => {
          this.notificacionService.hideNotif(notificacion, this.cargando());
        }, 3000);        
      },
    });
  }
}
