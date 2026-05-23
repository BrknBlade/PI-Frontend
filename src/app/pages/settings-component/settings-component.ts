import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-settings-component',
  imports: [],
  templateUrl: './settings-component.html',
  styleUrl: './settings-component.css',
})
export class SettingsComponent {

  resolucionWidth = signal(window.innerWidth);
}
