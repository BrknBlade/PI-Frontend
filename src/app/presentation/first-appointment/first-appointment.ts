import { Component, inject } from '@angular/core';
import { AppointmentService, Service } from '../../models/appointment-model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-first-appointment',
  imports: [CommonModule],
  templateUrl: './first-appointment.html',
  styleUrl: './first-appointment.css',
})
export class FirstAppointment {
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);

  services: Service[] = [
    {
      name: 'Corte y estilo de cabello',
      description: 'Corte de pelo profesional con lavado, corte y peinado',
      time: '60 min',
      price: '45€',
      image: 'corte_de_cabello.png'
    },
    {
      name: 'Coloración del cabello',
      description: 'Servicio completo de coloración con consulta y estilismo',
      time: '120 min',
      price: '95€',
      image: 'tipos-tintes.webp'
    },
    {
      name: 'Mechas',
      description: 'Mechas parciales o completas con matización',
      time: '150 min',
      price: '120€',
      image: 'tipos-tintes.webp'
    },
    {
      name: 'Secado y estilismo',
      description: 'Secado y peinado profesional',
      time: '45 min',
      price: '35€',
      image: 'corte_de_cabello.png'
    },
    {
      name: 'Tratamiento de acondicionamiento',
      description: 'Tratamiento capilar intensivo para cabello dañado o seco',
      time: '60 min',
      price: '55€',
      image: 'tipos-tintes.webp'
    },
    {
      name: 'Tratamiento de queratina',
      description: 'Tratamiento alisador para un cabello sin frizz',
      time: '180 min',
      price: '200€',
      image: 'tipos-tintes.webp'
    },
  ];

  selectService(service: Service) {
    this.appointmentService.selectedService.set(service);
    this.router.navigate(['/home/appointment/second-appointment']);
  }
}
