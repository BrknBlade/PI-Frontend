import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { switchMap, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  user = signal<any>(null);
  userID = signal<any>(null);

  login(credentials: Object) {
    return this.http.get<any>(`${environment.BASE_URL}/sanctum/csrf-cookie`).pipe(
      switchMap(() => {
        return this.http.post<any>(`${environment.BASE_URL}/api/login`, credentials);
      }),
      tap((response) => {
        console.log(response);
        if (response?.user_id) {
          this.userID.set(response.user_id);
          localStorage.setItem('auth_token', response.token);
        } else {
          throw new Error(response?.message ?? 'Login fallido');
        }
      }),
      switchMap(() => this.loadCurrentUser()),
    );
  }

  register(credentials: Object) {
    return this.http.get<any>(`${environment.BASE_URL}/sanctum/csrf-cookie`).pipe(
      switchMap(() => {
        return this.http.post<any>(`${environment.BASE_URL}/api/register`, credentials)
      })
    );
  }

  loadCurrentUser() {
    return this.http.get<any>(`${environment.BASE_URL}/api/user`).pipe(
      tap((user) => {
        this.user.set(user);
        this.userID.set(user.id);
      }),
      catchError(() => {
        this.user.set(null);
        return of(null);
      }),
    );
  }

  logout() {
  return this.http.post(`${environment.BASE_URL}/api/logout`, {}).pipe(
    tap(() => {
      this.user.set(null);
      this.userID.set(null);
      localStorage.removeItem('auth_token');
    })
  );
}
}
