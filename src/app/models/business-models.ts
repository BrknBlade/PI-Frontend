import { signal } from "@angular/core"

export interface BusinessInfo {
  id: string,
  owner_id: string,
  week_open_at: string,
  week_close_at: string,
  weekend_open_at: string,
  weekend_close_at: string,
  sunday_work: boolean,
  email_reminder: boolean,
  sms_reminder: boolean,
  employee_reminder: boolean,
  daily_summary: boolean
  maximum_booking_days: number,
  limit_cancell_hours: number,
  minimum_booking_days: number
  created_at: string,
  updated_at: string,
}

interface ContactInfoData {
  company_name: string,
  phone_number: string,
  email: string,
  address: string
}

interface TimeData {
  week_open_at: string,
  week_close_at: string,
  weekend_open_at: string,
  weekend_close_at: string,
  sunday_work: boolean
}

interface NotificationData {
  email_reminder: boolean,
  sms_reminder: boolean,
  employee_reminder: boolean,
  daily_summary: boolean,
}

interface LimitsData {
  maximum_booking_days: number | null,
  limit_cancell_hours: number | null,
  minimum_booking_days: number | null
}

export const contactInfoModel = signal<ContactInfoData>({
  company_name: '',
  phone_number: '',
  email: '',
  address: ''
});

export const timeModel = signal<TimeData>({
  week_open_at: '',
  week_close_at: '',
  weekend_open_at: '',
  weekend_close_at: '',
  sunday_work: false
});

export const notificationModel = signal<NotificationData>({
  email_reminder: false,
  sms_reminder: false,
  employee_reminder: false,
  daily_summary: false
});

export const limitModel = signal<LimitsData>({
  maximum_booking_days: null,
  limit_cancell_hours: null,
  minimum_booking_days: null
});
