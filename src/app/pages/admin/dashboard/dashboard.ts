import { Component, inject, OnInit, signal } from '@angular/core';
import { CitaService } from '../../../services/citas/cita-service';
import { BusinessService } from '../../../services/business/business-service';
import { BusinessInfo } from '../../../models/business-models';
import { CutData } from '../../../services/cutData/cut-data';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  constructor(private http: HttpClient) { }

  bookingsService = inject(CitaService);
  businessService = inject(BusinessService);
  cutDataService = inject(CutData);

  businessInfo = signal<any>(null);
  businessEarnings = signal<number>(0);
  cancelledBookings = signal<number>(0);
  acceptedBookings = signal<number>(0);
  totalServices = signal<number>(0);
  totalEmployees = signal<number>(0);

  currentDate = new Date();
  todayBookings = signal<any>([]);
  weekBookings = signal<any>([]);
  weekOcupacy = signal<number>(0);

  ngOnInit()
  {
    this.getBusinessInfo();
    this.getTodayBookings();
    this.getWeekBookings();
    this.getBusinessEarnings();
    this.getCancelledBookings();
    this.getAcceptedBookings();
    this.getTotalServices();
    this.getTotalEmployees();
  }

  getBusinessInfo()
  {
    this.businessService.getBusinessInfo().subscribe((data: BusinessInfo) => {
      this.businessInfo.set(data);
    })
  }

  getTodayBookings()
  {
    let date = this.currentDate.toISOString().split('T')[0];

    this.bookingsService.getFullWeekBookings(date,date).subscribe((data:any) => {
      this.todayBookings.set(data.data);
    })
  }

  getWeekBookings()
  {
    let date = this.currentDate;
    let dates = this.getStartEndDates(date);
    let start_date = dates[0].toISOString().split("T")[0];
    let end_date = dates[1].toISOString().split("T")[0];

    this.bookingsService.getFullWeekBookings(start_date, end_date).subscribe((data:any) => {
      this.weekBookings.set(data.data);
      this.getWeekOcupacyPercentage();
    })
  }

  getStartEndDates(date: Date)
  {
    let start_date = new Date(date);
    let end_date = new Date(date);

    for(let i = 6; i >= 0; i--)
    {
      if(start_date.getDay() === 0)
      {
        end_date.setDate(start_date.getDate() + 6);
        break;
      }
      else
      {
        let actualDay = start_date.getDate() - 1;
        start_date.setDate(actualDay);
      }
    }

    return [start_date,end_date];
  }

  getWeekOcupacyPercentage()
  {
    let open_at: number = parseInt(this.businessInfo().week_open_at.split(':')[0]);
    let close_at: number = parseInt(this.businessInfo().week_close_at.split(':')[0]);
    let hours: number = (close_at - open_at) * 7;

    let percentage: number = (this.weekBookings().length * 100) / hours;
    this.weekOcupacy.set(parseFloat(percentage.toFixed(2)));
  }

  getBusinessEarnings()
  {
    this.businessService.getBusinessEarnings().subscribe((data: number) => {
      this.businessEarnings.set(data);
    })
  }

  getCancelledBookings()
  {
    this.bookingsService.getCancelledBookings().subscribe((data: number) => {
      this.cancelledBookings.set(data);
    });
  }

  getAcceptedBookings()
  {
    this.bookingsService.getAcceptedBookings().subscribe((data: number) => {
      this.acceptedBookings.set(data);
    });
  }

  getTotalServices()
  {
    this.cutDataService.getTotalServices().subscribe((data: number) => {
      this.totalServices.set(data);
    });
  }

  getTotalEmployees()
  {
    this.http.get<any>(`${environment.BASE_URL}/api/employees/total`).subscribe((data: number) => {
      this.totalEmployees.set(data);
    })
  }
}
