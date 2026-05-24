import { Component, inject, OnInit, signal } from '@angular/core';
import { BusinessService } from '../../../services/business/business-service';
import { BusinessInfo, contactInfoModel, limitModel, notificationModel, timeModel } from '../../../models/business-models';
import { form, FormField } from '@angular/forms/signals';


@Component({
  selector: 'app-settings-component',
  imports: [FormField],
  templateUrl: './settings-component.html',
  styleUrl: './settings-component.css',
})
export class SettingsComponent implements OnInit {
  bussinessService = inject(BusinessService);

  resolucionWidth = signal(window.innerWidth);
  businessInfo = signal<any>({});

  contactInfoForm = form(contactInfoModel);
  timeForm = form(timeModel);
  limitsForm = form(limitModel);
  notificationsForm = form(notificationModel);


  ngOnInit()
  {
    this.bussinessService.getBusinessInfo().subscribe(async (data: BusinessInfo) => {
      this.businessInfo.set(data);
      timeModel.set({
        week_open_at: data.week_open_at,
        week_close_at: data.week_close_at,
        weekend_open_at: data.weekend_open_at,
        weekend_close_at: data.weekend_close_at,
        sunday_work: data.sunday_work
      });

      notificationModel.set({
        email_reminder: data.email_reminder,
        sms_reminder: data.sms_reminder,
        employee_reminder: data.employee_reminder,
        daily_summary: data.daily_summary,
      });
    });
  }

  updateBusinessContactInfo(e: Event)
  {
    e.preventDefault();
    let businessContantInfo = {
      "company_name": this.contactInfoForm.company_name().value(),
      "phone_number": this.contactInfoForm.phone_number().value(),
      "email": this.contactInfoForm.email().value(),
      "address": this.contactInfoForm.address().value(),
    }

    const cleanBusinessContactInfo = Object.fromEntries(Object.entries(businessContantInfo).filter(([_, value]) => value !== ""));

    this.bussinessService.updateBusinessInfo(cleanBusinessContactInfo).subscribe((data: any) => {
      this.businessInfo.set(data);
    });
  }

  updateBusinessTime(e: Event)
  {
    e.preventDefault();
    let businessTime = {
      "week_open_at": this.timeForm.week_open_at().value(),
      "week_close_at": this.timeForm.week_close_at().value(),
      "weekend_open_at": this.timeForm.weekend_open_at().value(),
      "weekend_close_at": this.timeForm.weekend_close_at().value(),
      "sunday_work": this.timeForm.sunday_work().value()
    }

    const cleanBusinesstime = Object.fromEntries(Object.entries(businessTime).filter(([_, value]) => value !== ""));

    this.bussinessService.updateBusinessInfo(cleanBusinesstime).subscribe((data: any) => {
      this.businessInfo.set(data);
    });
  }

  updateBusinessNotifications(e: Event)
  {
    e.preventDefault();
    let businessNotifications = {
      "email_reminder": this.notificationsForm.email_reminder().value(),
      "sms_reminder": this.notificationsForm.sms_reminder().value(),
      "employee_reminder": this.notificationsForm.employee_reminder().value(),
      "daily_summary": this.notificationsForm.daily_summary().value(),
    }

    this.bussinessService.updateBusinessInfo(businessNotifications).subscribe((data: any) => {
      this.businessInfo.set(data);
    });
  }

  updateBusinessLimits(e: Event)
  {
    e.preventDefault();
    let businessTime = {
      "minimum_booking_days": this.limitsForm.minimum_booking_days().value(),
      "maximum_booking_days": this.limitsForm.maximum_booking_days().value(),
      "limit_cancell_hours": this.limitsForm.limit_cancell_hours().value(),
    }

    const cleanBusinesstime = Object.fromEntries(Object.entries(businessTime).filter(([_, value]) => value !== null));

    this.bussinessService.updateBusinessInfo(cleanBusinesstime).subscribe((data: any) => {
      this.businessInfo.set(data);
    });
  }
}
