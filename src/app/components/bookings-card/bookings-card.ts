import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bookings-card',
  imports: [ RouterLink ],
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
