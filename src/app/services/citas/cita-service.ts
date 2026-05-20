import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  constructor(private http: HttpClient) {}

  cutData = signal<any>(null);

  postCita(body: any): Observable<any> {
    return this.http.post<any>(`${environment.BASE_URL}/api/bookings`, body);
  }
  updateCita(citaId: any, body: any): Observable<any> {
    return this.http.patch<any>(`${environment.BASE_URL}/api/bookings/${citaId}`, body);
  }
  getCita(citaId: any): Observable<any> {
    return this.http.get<any>(`${environment.BASE_URL}/api/bookings/${citaId}`);
  }
  deleteCita(citaId: any): Observable<any> {
    return this.http.delete<any>(`${environment.BASE_URL}/api/bookings/${citaId}`);
  }
  getEmployees(): Observable<any> {
    return this.http.get<any>(`${environment.BASE_URL}/api/employees`);
  }
  getCutTypes(): Observable<any> {
    return this.http.get<any>(`${environment.BASE_URL}/api/cut_types`);
  }
  getOccupiedHours(fecha: string): Observable<{ occupied: string[] }> {
  return this.http.get<any>(`${environment.BASE_URL}/api/bookings`).pipe(
    map(response => {
      const bookings = response.data ?? response;
      return {
        occupied: bookings
          .filter((b: any) => b.date === fecha)
          .map((b: any) => b.hour.substring(0, 5))
      };
    })
  );
}
}
