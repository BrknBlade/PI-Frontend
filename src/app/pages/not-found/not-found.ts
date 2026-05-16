// not-found/not-found.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div class="wrap">
      <p class="num">4<span>0</span>4</p>
      <img src="/logo_peluqueria-color.webp" alt="Logo" class="logo" />
      <div class="divider"></div>
      <p class="title">Página no encontrada</p>
      <p class="sub">Parece que esta página se ha ido a cortar el pelo y no ha vuelto.</p>
      <div class="actions">
        <button class="btn-home" (click)="router.navigate(['/'])">Volver al inicio</button>
        <button class="btn-back" (click)="goBack()">Atrás</button>
      </div>
    </div>
  `,
  styleUrl: './not-found.css'
})
export class NotFound {
  constructor(public router: Router) {}
  goBack() { history.back(); }
}
