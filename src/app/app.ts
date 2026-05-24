import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.development';
import { HomePage } from './components/header/header';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomePage],
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
