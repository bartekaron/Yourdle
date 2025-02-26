import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RegisterComponent } from '../register/register.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-passwrod',
  imports: [CommonModule,Dialog,ButtonModule,InputTextModule,FormsModule,ToastModule],
  templateUrl: './change-passwrod.component.html',
  styleUrl: './change-passwrod.component.scss',
  providers:[MessageService]
})
export class ChangePasswrodComponent  {
  static instance: ChangePasswrodComponent;

  userID:string = ""

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(data=>{
      if (data) {
        this.userID = this.auth.loggedUser().data.id;
      }
    })
  }

  user = {
    oldpasswd:"",
    passwd: "",
    confirm: ""
  }
  visible: boolean = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private messageService: MessageService,
    private router: Router,
  ){
    ChangePasswrodComponent.instance = this;
  }

  ChangePassword(){
    const passwordData ={
      oldpasswd: this.user.oldpasswd,
      passwd: this.user.passwd,
      confirm: this.user.confirm
    }

    this.api.changePassword(this.userID, passwordData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Sikeres jelszó módosítás',
            detail: res.message
          });
          this.closeDialog();
        }
        else{
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba',
            detail: res.message
          });
        }
      }
    });
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.user = {
      oldpasswd:"",
      passwd: "",
      confirm: ""
    }
  }
}