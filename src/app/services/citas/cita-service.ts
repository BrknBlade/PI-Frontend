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
}
