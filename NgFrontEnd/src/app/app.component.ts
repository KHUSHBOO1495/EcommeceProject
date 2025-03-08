import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'NgProject';

  showNavbar:boolean = true;

  constructor(private router:Router){
    router.events.subscribe(()=>{
      this.showNavbar =!['/login','/register'].includes(this.router.url);
    })
  }
}
