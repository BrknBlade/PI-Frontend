import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BusinessInfo } from '../../models/business-model';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  constructor( private http: HttpClient ) { }

  getBusinessInfo()
  {
    return this.http.get<BusinessInfo>(`${environment.BASE_URL}/api/business/info`);
  }

  getBusinessEarnings()
  {
    return this.http.get<any>(`${environment.BASE_URL}/api/business/earnings`);
  }
}
