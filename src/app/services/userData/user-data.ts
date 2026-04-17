import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../auth/auth-service';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserData {
  constructor(private http: HttpClient){}
  authService = inject(AuthService)
  currentUser = signal<any>(null);

  userId = signal<any>(null);
  citas = signal<any>(null);

  loadUser(): Observable<any> {
    return this.http.get<any>(`${environment.BASE_URL}/api/user`).pipe(
      tap((user) => {
        this.currentUser.set(user);
        this.userId.set(user.id);
      }),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  getCitas(): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/users/1/bookings`).pipe(
      tap((data) => {
        console.log(data)
        this.citas.set(data);
      }),
      catchError(() => {
        this.citas.set(null);
        return of(null);
      })
    );;
  }

}
