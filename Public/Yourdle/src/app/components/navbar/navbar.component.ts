import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/auth.service';
import { ProfileComponent } from '../profile/profile.component';
import { RouterLink } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-navbar',
  imports: [Menubar, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  constructor(private auth:AuthService){}

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe(res=>{
      this.Menu(res);
    })
    
  }

  Menu(isLoggedIn:boolean){
    this.items = [
      {
        label: 'Yourdle',
        routerLink: '/'
      },
      {
        label: 'Egyjátékos',
        routerLink: '/egyjatekos'
      },
      {
        label: 'Toplista',
        routerLink: '/toplista'
      },
      ...(isLoggedIn) ? [
        ...(this.auth.isAdmin()) ? [ 
          {
            label: 'Kategóriák',
            routerLink: '/kategoriak'
          },
          {
            label: 'Felhasználók',
            routerLink: '/felhasznalok'
          }
        ] : [
          {
            label: 'Párbaj',
            routerLink: '/parbaj'
          },
          {
            label: 'Kategória készítő',
            routerLink: '/kategoria'
          },
          {
            icon: 'pi pi-user',
            command: ()=> this.openProfileDialog()
          }
        ]
       
      ] : [      {
        label: 'Bejelentkezés',
        command: () => this.openLoginDialog()
      }]

    ];
  }

  openLoginDialog() {
    if (LoginComponent.instance) {
      LoginComponent.instance.showDialog();
    }
  }

 

  openProfileDialog() {
    if (ProfileComponent.instance) {
      ProfileComponent.instance.showDialog();
    } 
  }
  

}
