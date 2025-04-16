import { Component, OnDestroy } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';

import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CardModule, ButtonModule, RouterModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnDestroy {
  isAdmin = false;
  private userSub: Subscription;

  constructor(private router: Router, private auth: AuthService) {
    this.userSub = this.auth.loggedUser$.subscribe(user => {
      this.isAdmin = !!user?.data?.role && user.data.role === 'admin';
    });
  }

  Egyjatekos() {
    this.router.navigate(['/egyjatekos']);
  }

  Toplista() {
    this.router.navigate(['/toplista']);
  }

  AdminFelhasznalok() {
    this.router.navigate(['/admin-felhasznalok']);
  }

  AdminKategoriak() {
    this.router.navigate(['/admin-kategoriak']);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe(); // clean up the subscription when the component is destroyed
  }
}
