import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-match-history',
  imports: [ButtonModule, Dialog, InputTextModule, FormsModule, ToastModule, ConfirmDialogModule, FileUploadModule],
  templateUrl: './match-history.component.html',
  styleUrl: './match-history.component.scss',
  providers: [ConfirmationService]
})
export class MatchHistoryComponent {
  static instance: MatchHistoryComponent;
  visible: boolean = false;

  constructor(private auth:AuthService, private messageService:MessageService){MatchHistoryComponent.instance = this}

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }


  Profile(){
    if (ProfileComponent.instance) {
      this.closeDialog();
      ProfileComponent.instance.showDialog();
    } 
  }

}
