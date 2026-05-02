import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.development';
import { HomePage } from './pages/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, HomePage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend');
  private http = inject(HttpClient);

  test() {
    this.http.get<any>(`${environment.BASE_URL}/api/test`).subscribe((data:any) => {
      console.log(data);
    });
  }

  logout() {
    this.http.post<any>(`${environment.BASE_URL}/api/logout`,{}).subscribe((data:any) => {
      console.log(data);
    });
  }
}
