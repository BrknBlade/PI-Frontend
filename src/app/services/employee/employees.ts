import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  // LISTADO DE EMPLEADOS
  employeesData = signal<any[]>([]);
  getEmployees(): Observable<any> {
    return this.http.get<any>(`${environment.BASE_URL}/api/employees`).pipe(
      tap((data) => {
        this.employeesData.set(data);
      }),
    );
  }

  // OBTENER UN EMPLEADO POR ID
  employeeData = signal<any>(null);
  getEmployee(employeeId: any): Observable<any> {
    return this.http.get<any>(`${environment.BASE_URL}/api/employees/${employeeId}`).pipe(
      tap((data) => {
        this.employeeData.set(data);
      }),
      catchError(() => {
        this.employeeData.set(null);
        return of(null);
      }),
    );
  }

  // CREAR UN EMPLEADO
  createEmployee(data: any): Observable<any> {
    return this.http.post<any>(`${environment.BASE_URL}/api/employees`, data).pipe(
      tap(() => this.getEmployees().subscribe()),
      catchError(() => of(null)),
    );
  }

  // EDITAR UN EMPLEADO
  updateEmployee(employeeId: any, data: any): Observable<any> {
    return this.http.put<any>(`${environment.BASE_URL}/api/employees/${employeeId}`, data).pipe(
      tap(() => this.getEmployees().subscribe()),
      catchError(() => of(null)),
    );
  }

  // ELIMINAR UN EMPLEADO
  deleteEmployee(employeeId: any): Observable<any> {
    return this.http.delete<any>(`${environment.BASE_URL}/api/employees/${employeeId}`).pipe(
      tap(() => {
        this.employeesData.update((employees) => employees.filter((e) => e.id !== employeeId));
      }),
      catchError(() => of(null)),
    );
  }
}