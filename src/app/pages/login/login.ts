import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { loginModel } from '../../models/login-model';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';


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

  constructor(private router: Router){}

  login(e:Event) {
    e.preventDefault();
    let button = e.target as HTMLButtonElement;

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
        console.log('ya se ha resuleto')

        setTimeout(() => {
          console.log('ha pasado un segundo')
          this.cargando.set(false);
          button.lastElementChild?.classList.remove('carga-disabled')

          this.router.navigate(['/citas'])
        }, 500);
        
      },
      error: (err) =>{
        this.cargando.set(false);

        button.lastElementChild?.classList.remove('carga-disabled')

        console.error('Login fallido', err)
      },
    });
  }
}
