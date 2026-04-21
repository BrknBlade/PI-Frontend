import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CutData {
  constructor(private http: HttpClient){}

  cutData = signal<any>(null);

  getCut(cutId: any): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/api/cut_types/${cutId}`).pipe(
      tap((data) => {
        this.cutData.set(data.data);
      }),
      catchError(() => {
        this.cutData.set(null);
        return of(null);
      })
    )
  }
}
