import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { switchMap,tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient){}

  userId = signal<any>(null);

  login(credentials: Object) {
    return this.http.get<any>(`${environment.BASE_URL}/sanctum/csrf-cookie`).pipe(
      switchMap(() => {
        return this.http.post<any>(`${environment.BASE_URL}/api/login`, credentials)
      }),
      tap(data => {
        // Guarda lo que devuelva el login (user, token, etc.)
        console.log('Login response:', data.user_id);
        this.userId.set(data.user_id);
        console.log(this.userId())
      })
    )
  }
}
