import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend');
  private http = inject(HttpClient);

  test() {
    this.http.get<any>(`${environment.BASE_URL}/test`).subscribe((data: any) => {
      console.log(data);
    });
  }
}
