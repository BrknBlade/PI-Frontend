import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient){}

  login(credentials: Object) {
    return this.http.get<any>(`${environment.BASE_URL}/sanctum/csrf-cookie`).pipe(
      switchMap(() => {
        return this.http.post<any>(`${environment.BASE_URL}/api/login`, credentials)
      })
    )
  }
}
