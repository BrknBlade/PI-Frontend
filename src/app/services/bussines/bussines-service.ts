import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BussinesService {
  constructor(private http: HttpClient){}

  cutData = signal<any>(null);

  getInfo(): Observable<any>{
    return this.http.get<any>(`${environment.BASE_URL}/api/business/info`);
  }
}
