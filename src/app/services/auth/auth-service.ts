import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient){}

  login(credentials: Object) {
    this.http.get<any>(`${environment.BASE_URL}/sanctum/csrf-cookie`).subscribe(() => {
      return this.http.post<any>(`${environment.BASE_URL}/api/login`, credentials, {
        withCredentials : true
      });
    })
  }
}
