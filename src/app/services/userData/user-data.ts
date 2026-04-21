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

  userId = this.authService.userID;
  citas = signal<any>(null);

  getCitas(): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/api/users/${this.userId()}/bookings`).pipe(
      tap((data) => {
        console.log(data.data)
        this.citas.set(data.data ?? []);
      }),
      catchError(() => {
        this.citas.set([]);
        return of(null);
      })
    );;
  }

}
