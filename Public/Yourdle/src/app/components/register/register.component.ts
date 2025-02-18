import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register',
  imports: [CommonModule,Dialog, ButtonModule, InputTextModule, FormsModule, ToastModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers:[MessageService]

})
export class RegisterComponent {
  static instance: RegisterComponent;

  user = {
    name: "",
    email: "",
    passwd: "",
    confirm: "",
  };

  visible: boolean = false;
  showPassword: boolean = false; // Ezt használjuk a jelszó láthatóságának kezelésére.

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    RegisterComponent.instance = this;
  }
  Register() {

  
    const registrationData = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.passwd,
      confirm: this.user.confirm
    };
  
    this.api.registration(registrationData).subscribe(
      (res: any) => {
        if (res.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Sikeres Regisztáció!',
            detail: res.message
          });
          this.user = {
            name: "",
            email: "",
            passwd: "",
            confirm: "",
          };
          this.closeDialog();
          this.openLoginDialog();
        } else {
          // Ha valami probléma van (pl. hiányzó adat), akkor itt jelenítjük meg a hibaüzenetet
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba!',
            detail: res.message
          });
        }
      },
      (error) => {
        if (error.status === 400 && error.error && error.error.message) {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba!',
            detail: error.error.message
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Ismeretlen hiba történt!',
            detail: 'Kérjük próbálja újra később.'
          });
        }
      }
    );
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.user = {
      name: "",
      email: "",
      passwd: "",
      confirm: "",
    };
  }

  openLoginDialog() {
    if (LoginComponent.instance) {
      LoginComponent.instance.showDialog();
    }
  }
}