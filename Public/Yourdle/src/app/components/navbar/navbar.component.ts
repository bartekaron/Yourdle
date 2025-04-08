import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/auth.service';
import { ProfileComponent } from '../profile/profile.component';
import { RouterLink } from '@angular/router';
import { routes } from '../../app.routes';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  constructor(private auth: AuthService, private api:ApiService) {}
  isMenuOpen = false;
  items: any[] = [];
  user:any 
  loggedIn:boolean = false;

  ngOnInit() {

      this.auth.isLoggedIn$.subscribe(res => {
        this.loggedIn = res;
        this.Menu(res);
        this.auth.loggedUser$.subscribe(user => {
          if (user) {
            this.user = user.data;
            this.user.image = this.user.image || 'http://localhost:3000/uploads/placeholder.png';
            this.api.select('users/user', this.auth.loggedUser().data.id).subscribe((res: any) => {
              if (res) {
                this.user.image = res.user.profilePic; 
              }
            });
          }
        });
      });
      
    
    
  }

  Menu(isLoggedIn: boolean) {
    if (isLoggedIn) {
      const user = this.auth.loggedUser();
      if (user) {
        this.user = user.data;
        if (this.auth.isAdmin()) {
          this.items = [
            { label: 'Kategóriák', routerLink: '/admin-kategoriak' },
            { label: 'Felhasználók', routerLink: '/admin-felhasznalok' },
            { command: () => this.openProfileDialog() }
          ];
        } else {
          this.items = [
            { label: 'Egyjátékos', routerLink: '/egyjatekos' },
            { label: 'Toplista', routerLink: '/toplista' },
            { label: 'Párbaj', routerLink: '/parbaj' },
            { label: 'Kategória készítő', routerLink: '/kategoria-keszito' },
            { command: () => this.openProfileDialog() }
          ];
        }
      }
    } else {
      this.items = [
        { label: 'Egyjátékos', routerLink: '/egyjatekos' },
        { label: 'Toplista', routerLink: '/toplista' },
        { label: 'Bejelentkezés', command: () => this.openLoginDialog() }
      ];
    }
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
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

}
