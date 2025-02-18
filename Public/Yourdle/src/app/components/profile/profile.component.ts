import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-profile',
  imports: [ButtonModule, Dialog, InputTextModule, FormsModule, ToastModule, ConfirmDialogModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [ConfirmationService]
})
export class ProfileComponent implements OnInit {
  static instance: ProfileComponent;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    ProfileComponent.instance = this;
  }

  user ={
    id:"",
    name:"",
    email:"",
    image:""
  }

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(data=>{
      if (data) {
        console.log(this.auth.loggedUser());
        this.user.id = this.auth.loggedUser().data.id;
        this.user.name = this.auth.loggedUser().data.name;
        this.user.email = this.auth.loggedUser().data.email;
        this.user.image = this.auth.loggedUser().data.image;
      }
    })
  }

  confirmSave() {
    this.confirmationService.confirm({
      message: 'Biztosan menteni szeretnéd a módosításokat?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Mégse',
      accept: () => {
        this.ProfileSave();
      }
    });
  }

  ProfileSave() {
    this.api.profileSave(this.user).subscribe((res:any) => {
            if (res) {
                this.user.name = res.user.name
                this.user.email = res.user.email
                this.messageService.add({severity: 'success', summary: 'Sikeres mentés', detail: 'A profil frissítése sikerült.'});
                return
            }
            this.messageService.add({severity: 'error', summary: 'Hiba', detail: 'A profil frissítése sikertelen volt.' });
        }
    );
}

  Logout(){
    this.auth.logout();
    this.closeDialog();
    this.messageService.add({severity: 'success', summary: 'Kilépés', detail: 'Sikeres kijelentkezés.'});
  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }
}
