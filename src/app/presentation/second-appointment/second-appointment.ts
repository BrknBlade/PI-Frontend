import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../models/appointment-model';
import { AppointmentStylist } from '../../models/secondAppointment-model';
import { Stylist } from '../../models/secondAppointment-model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-second-appointment',
  imports: [RouterModule, CommonModule],
  templateUrl: './second-appointment.html',
  styleUrl: './second-appointment.css',
})
export class SecondAppointment {
  appointmentService = inject(AppointmentService);

  private secondAppointment = inject(AppointmentStylist);
  private router = inject(Router);

  services: Stylist[] = [
    {
      name: 'Don Paquito',
      specialty: 'Especialista en cortes de pelo',
      description: 'Corte y peinado',
      image: 'DonPaquito.webp'
    },
    {
      name: 'Doña Lupelta',
      specialty: 'Especialista en coloración de pelo',
      description: 'Coloración y mechas',
      image: 'donsexo.jpg'
    },
    {
      name: 'Destructor de Multiversos Gomez',
      specialty: 'Vendedor de tacos y enanos albinos',
      description: 'Todos los servicios',
      image: 'Garfield.jpg'
    }
  ]

  selectStylist(stylist: Stylist){
    this.secondAppointment.selectedService.set(stylist);
    this.router.navigate(['/home/appointment/third-appointment']);
  }
}
