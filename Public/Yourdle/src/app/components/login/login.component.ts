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
import { RegisterComponent } from '../register/register.component';
import { ForgottenPasswordComponent } from '../forgotten-password/forgotten-password.component';


@Component({
  selector: 'app-login',
  imports: [Dialog, ButtonModule, InputTextModule, FormsModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers:[MessageService]
})
export class LoginComponent {
  static instance: LoginComponent;

  constructor(
    private api:ApiService,
    private auth:AuthService,
    private messageService: MessageService,
    private router:Router
  ){
    LoginComponent.instance = this;
  }
  user ={
    email:"",
    passwd:""
  }
  
  visible: boolean = false;

  Login(){

    this.api.login(this.user).subscribe({
      next: (res: any) => {
        this.auth.login(res.token);
        this.auth.initialize();
        this.messageService.add({
          severity: 'success',
          summary: 'Sikeres bejelentkezés',
          detail: 'Üdv újra!',
          life: 2000
        });
        this.user ={
          email:"",
          passwd:""
        }
        this.closeDialog();
        this.router.navigateByUrl("/")
      },
      error: (err) => {
        const errorMsg = err.error?.message || "Ismeretlen hiba történt.";
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba',
          detail: errorMsg,
          life: 2000
        });
        this.user ={
          email:"",
          passwd:""
        }
      }
    });
  }

  openRegisterDialog() {
    if (RegisterComponent.instance) {
      this.closeDialog();
      RegisterComponent.instance.showDialog();
    }
  }

  openForgottenPasswordDialog() {
    if (ForgottenPasswordComponent.instance) {
      this.closeDialog();
      ForgottenPasswordComponent.instance.showDialog();
    }
  }
  
  
  showDialog() {
      this.visible = true;
  }

  closeDialog() {
      this.visible = false;
      this.user ={
        email:"",
        passwd:""
      }
  }


  
  
}
