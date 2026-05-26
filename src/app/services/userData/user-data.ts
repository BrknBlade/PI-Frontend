import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
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

  getAll(): Observable<any> {
    return this.http.get<any>(`${environment.BASE_URL}/api/users`);
  }

  getCitasEachClient(id: any): Observable<any> {
    return this.http.get<any>(`${environment.BASE_URL}/api/users/${id}/bookings`);
  }

  getCitas(): Observable<any> {
    const id = this.userId();
    
    if (!id) {
      this.citas.set([]);
      return of(null);
    }

    return this.http.get<any>(`${environment.BASE_URL}/api/users/${id}/bookings`).pipe(
      tap((data) => {
        this.citas.set(data.data ?? []);
      }),
      catchError(() => {
        this.citas.set([]);
        return of(null);
      })
    );
  }

}
