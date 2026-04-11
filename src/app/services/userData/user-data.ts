import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../auth/auth-service';

@Injectable({
  providedIn: 'root',
})
export class UserData {
  constructor(private http: HttpClient){}
  authService = inject(AuthService)


  getData(){
    //return this.http.get<any>(`${environment.BASE_URL}/api/users/1}`);
  }

}
