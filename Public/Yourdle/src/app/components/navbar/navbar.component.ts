import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  imports: [Menubar, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Egyjátékos',
        icon: 'pi pi-fw pi-info',
        routerLink: '/egyjatekos'
      },
      {
        label: 'Toplista',
        icon: 'pi pi-fw pi-envelope',
        routerLink: '/toplista'
      },
      {
        label: 'Bejelentkezés',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.openLoginDialog()
      }
    ];
  }

  openLoginDialog() {
    if (LoginComponent.instance) {
      LoginComponent.instance.showDialog();
    }
  }

}
