import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { HeaderMain } from '../../layout/header-main/header';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, HeaderMain],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})  
export class HomePage {

}
