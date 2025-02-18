import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from "./components/login/login.component";
import { LandingComponent } from './components/landing/landing.component';
import { RegisterComponent } from "./components/register/register.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, HeaderComponent, LoginComponent, LandingComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Yourdle';
}
