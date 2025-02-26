import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from "./components/login/login.component";
import { LandingComponent } from './components/landing/landing.component';
import { ProfileComponent } from "./components/profile/profile.component";
import { RegisterComponent } from "./components/register/register.component";
import { ForgottenPasswordComponent } from './components/forgotten-password/forgotten-password.component';
import { MatchHistoryComponent } from "./components/match-history/match-history.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, HeaderComponent, LoginComponent,  ProfileComponent, RegisterComponent, ForgottenPasswordComponent, MatchHistoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Yourdle';
}
