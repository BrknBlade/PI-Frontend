import { Component, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-bookings-card',
  imports: [],
  templateUrl: './bookings-card.html',
  styleUrl: './bookings-card.css',
})
export class BookingsCard
{
  booking = input<any>();
  closeAction = output();

  close()
  {
    this.closeAction.emit();
  }
}
