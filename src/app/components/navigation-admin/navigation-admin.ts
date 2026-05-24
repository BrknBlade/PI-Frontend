import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-navigation-admin',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './navigation-admin.html',
  styleUrl: './navigation-admin.css',
})
export class NavigationAdmin {

}
