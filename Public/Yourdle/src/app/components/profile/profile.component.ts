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
import { FileUploadModule } from 'primeng/fileupload';
import { MatchHistoryComponent } from '../match-history/match-history.component';


@Component({
  selector: 'app-profile',
  imports: [ButtonModule, Dialog, InputTextModule, FormsModule, ToastModule, ConfirmDialogModule, FileUploadModule],
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
    image:"",
    role:""
  }

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(data=>{
      if (data) {
        this.user.id = this.auth.loggedUser().data.id;
        this.user.name = this.auth.loggedUser().data.name;
        this.user.email = this.auth.loggedUser().data.email;
        this.api.select('users', this.user.id).subscribe((res: any) => {
          if (res) {
            this.user.image = res.user.profilePic; 
          }
        });
      }
    })
  }

  onBasicUploadAuto(event: any){
    if (this.user.image != "http://localhost:3000/uploads/placeholder.png") {
      this.api.deleteProfilePicture(this.user.id).subscribe(res=>{
        if (!event.files[0]) {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Nem választottál ki fájlt!' });
          return;
        }
        this.api.uploadFile(event.files[0], this.user.id).subscribe(res=>{
          if (res) {
            this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Sikeres profilkép feltöltés' });
            this.user.image = URL.createObjectURL(event.files[0]);
          }
          else{
            this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'A kép feltöltése sikertelen.' });
          }
        })  
      })
    }
      
    else{
      if (!event.files[0]) {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Nem választottál ki fájlt!' });
        return;
      }
      this.api.uploadFile(event.files[0], this.user.id).subscribe(res=>{
        if (res) {
          this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Sikeres profilkép feltöltés' });
          this.user.image = URL.createObjectURL(event.files[0]);
        }
        else{
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'A kép feltöltése sikertelen.' });
        }
      })
    }

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
              this.user = res.user.user;
              this.auth.logout();
              this.auth.login(res.user.token)
              this.messageService.add({severity: 'success', summary: 'Sikeres mentés', detail: 'A profil frissítése sikerült.'});
            }
            else{
              this.messageService.add({severity: 'error', summary: 'Hiba', detail: 'A profil frissítése sikertelen volt.' });

            }
        }
    );
}

deleteProfilePicture() {
  this.confirmationService.confirm({
    message: 'Biztosan törölni szeretnéd a profilképed?',
    header: 'Megerősítés',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Igen',
    rejectLabel: 'Mégse',
    accept: () => {
      this.api.deleteProfilePicture(this.user.id).subscribe((res: any) => {
        if (res.success) {
          this.user.image = "http://localhost:3000/uploads/placeholder.png"; // Visszaállítjuk az alapértelmezett képet
          this.messageService.add({ severity: 'success', summary: 'Siker', detail: 'Profilkép sikeresen törölve!' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Nem sikerült törölni a profilképet.' });
        }
      });
    }
  });
}


  Logout(){
    this.auth.logout();
    this.closeDialog();
    this.messageService.add({severity: 'success', summary: 'Kilépés', detail: 'Sikeres kijelentkezés.'});
  }

  MatchHistory(){
    if (MatchHistoryComponent.instance) {
      this.closeDialog();
      MatchHistoryComponent.instance.showDialog();
    } 
  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }
}
