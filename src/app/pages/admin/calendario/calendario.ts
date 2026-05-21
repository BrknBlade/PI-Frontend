import { Component, inject, OnInit, signal } from '@angular/core';
import { BusinessService } from '../../../services/business/business-service';
import { BusinessInfo } from '../../../models/business-model';
import { CitaService } from '../../../services/citas/cita-service';
import { BookingsCard } from '../../../components/bookings-card/bookings-card';

@Component({
  selector: 'app-calendario',
  imports: [ BookingsCard ],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario implements OnInit {
  businessService = inject(BusinessService);
  bookingService = inject(CitaService);

  businessInfo = signal<any>({});
  months = [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ];
  days = [ 'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab' ];

  date = new Date();
  year = signal<number>(this.date.getFullYear());
  month = signal<number>(this.date.getMonth());
  monthDays = signal<number>(this.getMonthDays(this.month(), this.year()));
  firstMonthDay = signal<number>(new Date(this.year(), this.month(), 1).getDay());
  currentWeekDays = signal<any>([]);
  today = signal<number>(this.date.getDate());

  monthBookings = signal<Array<any>>([]);
  start_date = signal<Date>(new Date());
  end_date = signal<Date>(new Date());

  rowsForGrid = signal<number>(0);
  gridSize = signal<Array<any>>([]);

  hours = signal<Array<any>>([]);
  showBookingInfo = signal<string>('hidding');
  selectedBooking = signal<any>(null);

  ngOnInit(): void
  {
    this.businessService.getBusinessInfo().subscribe(async (data: BusinessInfo) => {
      this.businessInfo.set(data);
      this.getRowsForGrid();
    });

    this.getStartEndDates();
    this.getCalendarContent();
    this.getDayToPrint();
  }

  getMonthDays(month: number, year: number)
  {
    return new Date(year, month, 0).getDate()
  }

  updateCalendar(direction: string)
  {
    let start = this.start_date().getDate();
    let end = this.end_date().getDate();

    switch(direction)
    {
      case '+':
        // this.month.update(month => month + 1);
        this.start_date().setDate(start + 7);
        this.end_date().setDate(end + 7);
        break;

      case '-':
        // this.month.update(month => month - 1);
        this.start_date().setDate(start - 7);
        this.end_date().setDate(end - 7);
        break;

      default:
        break;
    }

    this.updateCalendarContent();
  }

  getRowsForGrid()
  {
    let open_at: Array<string> = new String(this.businessInfo().week_open_at).split(':');
    let close_at: Array<string> = new String(this.businessInfo().week_close_at).split(':');
    let hours: number = parseInt(close_at[0]) - parseInt(open_at[0]);

    if(hours < 0)
    {
      this.rowsForGrid.set((hours * -1) + 1)
    }
    else
    {
      this.rowsForGrid.set(hours + 1);
    }
  }

  async getHours()
  {
    this.hours.set([]);

    let open_at = parseInt(new String(this.businessInfo().week_open_at).split(':')[0]);
    let close_at = parseInt(new String(this.businessInfo().week_close_at).split(':')[0]);

    for(open_at; open_at <= close_at; open_at++)
    {
      this.hours().push(open_at < 10 ? "0" + open_at : open_at);
    }
  }

  async getBookingsGridContent()
  {
    this.gridSize.set([]);
    let size = 7 * this.rowsForGrid();
    let dayOfWeek = 0;
    let hour = 0;

    for(let i = 1; i <= size; i++)
    {
      this.gridSize().push({
        "day_of_week": dayOfWeek,
        "hour": this.hours()[hour]
      });

      if(i % 7 == 0)
      {
        dayOfWeek = 0;
        hour += 1;
      }
      else
      {
        dayOfWeek+= 1;
      }
    }
  }

  getCalendarContent()
  {
    let start = this.start_date().toISOString().split('T')[0];
    let end = this.end_date().toISOString().split('T')[0];

    this.bookingService.getFullWeekBookings(start, end).subscribe(async (data: any) => {
      let bookings: Array<any> = [];
      for(let day of data.data)
      {
        let date = new Date(day.date);
        let dateHour = day.hour.split(':')[0];
        let fullDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), dateHour);

        day.date = fullDate;
        bookings.push(day);
      }
      this.monthBookings.set(bookings);
      this.getHours();
      this.getBookingsGridContent();
    });
  }

  updateCalendarContent()
  {
    let start = this.start_date().toISOString().split('T')[0];
    let end = this.end_date().toISOString().split('T')[0];
    this.monthBookings.set([]);

    this.bookingService.getFullWeekBookings(start, end).subscribe(async (data: any) => {
      let bookings: Array<any> = [];
      for(let day of data.data)
      {
        let date = new Date(day.date);
        let dateHour = day.hour.split(':')[0];
        let fullDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), dateHour);

        day.date = fullDate;
        bookings.push(day);
      }

      this.monthBookings.set(bookings);
      this.getDayToPrint();
    });
  }

  renderBookingsInfo(booking: any)
  {
    if(this.showBookingInfo() == 'showing')
    {
      this.showBookingInfo.set('hidding');
    }
    else
    {
      this.selectedBooking.set(booking);
      this.showBookingInfo.set('showing');
    }
  }

  getStartEndDates()
  {
    for(let i = 6; i >= 0; i--)
    {
      if(this.start_date().getDay() === 0)
      {
        this.end_date().setDate(this.start_date().getDate() + 6);
        break;
      }
      else
      {
        let actualDay = this.start_date().getDate() - 1;
        this.start_date().setDate(actualDay);
      }
    }
  }

  getDayToPrint()
  {
    let local_start_date = new Date(this.start_date());
    this.currentWeekDays.set([]);

    for(let i = 0; i < 7; i++)
    {
      this.currentWeekDays().push({
        "month": local_start_date.getMonth(),
        "day": local_start_date.getDay(),
        "date": local_start_date.getDate()
      });
      local_start_date.setDate(local_start_date.getDate() + 1);
    }
  }
}
