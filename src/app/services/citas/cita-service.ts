import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  constructor(private http: HttpClient){}

  cutData = signal<any>(null);

  updateCita(citaId: any, body: any): Observable<any>{
    return this.http.patch<any>(`${environment.BASE_URL}/api/bookings/${citaId}`, body);
  }
  getCita(citaId: any): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/api/bookings/${citaId}`);
  }
  deleteCita(citaId: any): Observable<any>{
    return this.http.delete<any>(`${environment.BASE_URL}/api/bookings/${citaId}`);
  }
  getFullWeekBookings(start_date: string, end_date: string) {
    return this.http.get<any>(`${environment.BASE_URL}/api/bookings/week`, {
      params : {
        'start_date': start_date,
        'end_date': end_date
      }
    })
  }

  getCancelledBookings()
  {
    return this.http.get<any>(`${environment.BASE_URL}/api/bookings/cancelled`);
  }

  getAcceptedBookings()
  {
    return this.http.get<any>(`${environment.BASE_URL}/api/bookings/accepted`);
  }
}
