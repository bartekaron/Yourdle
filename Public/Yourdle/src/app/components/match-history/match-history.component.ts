import { Component, OnInit } from '@angular/core';
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
import { ApiService } from '../../services/api.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-match-history',
  imports: [ButtonModule, Dialog, InputTextModule, FormsModule, ToastModule, ConfirmDialogModule, FileUploadModule, TableModule, FormsModule, CommonModule],
  templateUrl: './match-history.component.html',
  styleUrl: './match-history.component.scss',
  providers: [ConfirmationService]
})
export class MatchHistoryComponent{
  static instance: MatchHistoryComponent;

  constructor(private auth:AuthService, private messageService:MessageService, private api:ApiService){MatchHistoryComponent.instance = this}

  user:any = "";
  matches:any = [];

  visible: boolean = false;

  showDialog() {
    this.user = this.auth.loggedUser();
    this.api.MatchHistory(this.user.data.id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.matches = res.results.map((match: any) => {
            const isPlayer1 = match.player1ID === this.user.data.id;
            const opponentId = isPlayer1 ? match.player2ID : match.player1ID;
            const opponentName = isPlayer1 ? match.player2Name : match.player1Name;
            const opponentProfilePic = "";
  
            let result = "draw";
            if (match.winnerID === this.user.data.id) {
              result = "win";
            } else if (match.winnerID !== null) {
              result = "lose";
            }
  
            const matchData = {
              opponentId,
              opponentName,
              opponentProfilePic,
              result
            };
  
            this.api.select('users/user', opponentId).subscribe({
              next: (userRes: any) => {
                if (userRes && userRes.user.profilePic) {
                  matchData.opponentProfilePic = userRes.user.profilePic;
                }
              },
              error: () => {
               matchData.opponentProfilePic = 'http://localhost:3000/uploads/placeholder.png'
              }
            });
  
            return matchData;
          });
        }
      },
      error: (err) => {
        this.matches = []; 
      }
    });
  
    this.visible = true;
  }
  


  closeDialog() {
    this.visible = false;
  }


  getRowClass(result: string): string {
    switch (result) {
      case "win": return "win";
      case "lose": return "lose";
      case "draw": return "draw";
      default: return "";
    }
  }
  
  getResultText(result: string): string {
    switch (result) {
      case "win": return "Győzelem";
      case "lose": return "Vereség";
      case "draw": return "Döntetlen";
      default: return "";
    }
  }
  

  Profile(){
    if (ProfileComponent.instance) {
      this.closeDialog();
      ProfileComponent.instance.showDialog();
    } 
  }

}
