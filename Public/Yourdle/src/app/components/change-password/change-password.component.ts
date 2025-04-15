import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ProfileComponent } from '../profile/profile.component';
import { MatchHistoryComponent } from '../match-history/match-history.component';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule,Dialog,ButtonModule,InputTextModule, FormsModule,ToastModule,],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  providers:[MessageService]
})
export class ChangePasswordComponent {
  static instance: ChangePasswordComponent;
  constructor(private auth:AuthService, private messageService:MessageService, private api:ApiService){ChangePasswordComponent.instance = this}

  visible: boolean = false;
  
  user:any = "";

  passwordData = {
    oldpasswd:"",
    passwd: "",
    confirm: ""
  }

  ChangePassword() {
    if (this.passwordData.passwd !== this.passwordData.confirm) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Hiba', 
        detail: 'A két jelszó nem egyezik meg!' 
      });
      return;
    }

    this.api.ChangePassword(this.user.data.id, this.passwordData).subscribe({
      next: (res: any) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Siker', 
          detail: 'A jelszó sikeresen megváltozott!' 
        });
        this.passwordData = {
          oldpasswd: "",
          passwd: "",
          confirm: ""
        };
        this.closeDialog();
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hiba', 
          detail: err.error?.message || 'Hiba történt a jelszó módosításakor!' 
        });
      }
    });
  }

  showDialog() {
    this.user = this.auth.loggedUser();
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.user = {
      oldpasswd: "",
      passwd: "",
      confirm: ""
    };
  }

  Profile() {
    if (ProfileComponent.instance) {
      this.closeDialog();
      ProfileComponent.instance.showDialog();
    } 
  }
  
  MatchHistory() {
    if (MatchHistoryComponent.instance) {
      this.closeDialog();
      MatchHistoryComponent.instance.showDialog();
    } 
  }
}
