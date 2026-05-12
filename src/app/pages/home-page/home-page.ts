import { Component } from '@angular/core';
import { provideRouter, RouterLink, withInMemoryScrolling } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  scrollsToServices() {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  }
}
