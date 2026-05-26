import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CutData {
  constructor(private http: HttpClient) {}

  //LISTADO DE LOS CORTES DE PELO
  cutsData = signal<any[]>([]);
  getCuts(): Observable<any> {
    return this.http.get<any>(`${environment.BASE_URL}/api/cut_types`).pipe(
      tap((data) => {
        this.cutsData.set(data.data);
      }),
    );
  }
  
  //OPTENER UN CORTE DE PELO POR ID
  cutData = signal<any>(null);
  getCut(cutId: any): Observable<any> {
    return this.http.get<any>(`${environment.BASE_URL}/api/cut_types/${cutId}`).pipe(
      tap((data) => {
        this.cutData.set(data.data);
      }),
      catchError(() => {
        this.cutData.set(null);
        return of(null);
      }),
    );
  }

  //CREAR UN CORTE DE PELO
  createCut(data: any): Observable<any> {
    return this.http.post<any>(`${environment.BASE_URL}/api/cut_types`, data).pipe(
      tap(() => this.getCuts().subscribe()),
      catchError(() => of(null)),
    );
  }

  //EDITAR UN CORTE DE PELO
  updateCut(cutId: any, data: any): Observable<any> {
    return this.http.put<any>(`${environment.BASE_URL}/api/cut_types/${cutId}`, data).pipe(
      tap(() => this.getCuts().subscribe()),
      catchError(() => of(null)),
    );
  }

  //ELIMINAR UN CORTE DE PELO
  deleteCut(cutId: any): Observable<any> {
    return this.http.delete<any>(`${environment.BASE_URL}/api/cut_types/${cutId}`).pipe(
      tap(() => {
        this.cutsData.update((cuts) => cuts.filter((c) => c.id !== cutId));
      }),
      catchError(() => of(null)),
    );
  }

  getTotalServices()
  {
    return this.http.get<any>(`${environment.BASE_URL}/api/cut_types/total_services`);
  }
}
