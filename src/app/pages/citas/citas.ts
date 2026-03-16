import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-citas',
  imports: [],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class Citas {
  numCitas = signal(1);

  iterableCitas = Array.from({length : this.numCitas()}, (_,i) => i);

    
}
