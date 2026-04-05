import { Component, inject } from '@angular/core';
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

  constructor(private router: Router){}


  login(e:Event) {
    e.preventDefault();

    const credentials: Object = {
      email : this.loginForm.email().value(),
      password : this.loginForm.password().value()
    }

    this.authService.login(credentials).subscribe((data:any) => {
      console.log(data);
      if(data){
        this.router.navigate(['/citas']);
      }
    });
  }
}
