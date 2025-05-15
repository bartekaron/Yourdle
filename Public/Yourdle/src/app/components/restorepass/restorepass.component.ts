import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import * as bcrypt from 'bcryptjs';
import * as uuid from 'uuid';

@Component({
  selector: 'app-restorepass',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './restorepass.component.html',
  styleUrl: './restorepass.component.scss'
})

export class RestorepassComponent implements OnInit{
  newpass:string = '';
  newpassconfirm:string = '';
  userID:string = '';
  resetToken:string = '';
  oldpassHash:string = '';
  tokenExpired:boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private message: MessageService,
    private router: Router
  ){}

  changeable:boolean = false;

  ngOnInit(): void {
    this.userID = this.activatedRoute.snapshot.params['userId'];
    this.resetToken = this.activatedRoute.snapshot.params['token'];

    this.api.read('users', 'id', 'eq', this.userID).subscribe((res:any) => {
      if (res && res.length > 0) {
        const user = res[0];
        this.oldpassHash = user.passwd;
        
        // Check if token exists and is not expired
        if (user.reset_token === this.resetToken && user.token_expires_at) {
          const tokenExpirationStr = user.token_expires_at;
          console.log("Token expiration from DB:", tokenExpirationStr);
          
          // Parse the MySQL datetime with Budapest timezone adjustment
          const parseDateTime = (dateTimeStr: string) => {
            // Handle MySQL format YYYY-MM-DD HH:MM:SS
            const parts = dateTimeStr.split(/[- :]/);
            if (parts.length >= 6) {
              const year = parseInt(parts[0]);
              const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
              const day = parseInt(parts[2]);
              const hour = parseInt(parts[3]);
              const minute = parseInt(parts[4]);
              const second = parseInt(parts[5]);
              
              return new Date(Date.UTC(year, month, day, hour, minute, second));
            }
            // Fallback: try to parse as is
            return new Date(dateTimeStr);
          };
          
          const tokenExpiration = parseDateTime(tokenExpirationStr);
          
          // Get current time
          const now = new Date();
          
          console.log("Current time (UTC):", now.toUTCString());
          console.log("Token expiration time (UTC):", tokenExpiration.toUTCString());
          console.log("Time difference (ms):", tokenExpiration.getTime() - now.getTime());
          
          if (now.getTime() <= tokenExpiration.getTime()) {
            this.changeable = true;
          } else {
            this.tokenExpired = true;
            this.message.add({ 
              severity: 'error', 
              summary: 'Hiba', 
              detail: 'A jelszó visszaállítási link lejárt! Kérjük igényelj újat.' 
            });
          }
        } else {
          this.message.add({ 
            severity: 'error', 
            summary: 'Hiba', 
            detail: 'Érvénytelen vagy lejárt jelszó visszaállítási link!' 
          });
        }
      }
    });
  }

  async save() {
    if (!this.newpass || !this.newpassconfirm) {
      this.message.add({ severity: 'error', summary: 'Hiba', detail: 'Nem adtál meg minden adatot!' });
      return;
    }
  
    if (this.newpass != this.newpassconfirm) {
      this.message.add({ severity: 'error', summary: 'Hiba', detail: 'A megadott jelszavak nem egyeznek!' });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(this.newpass)) {
      this.message.add({ severity: 'error', summary: 'Hiba', detail: 'A jelszónak legalább 8 karakter hosszúnak kell lennie, tartalmaznia kell kis- és nagybetűt, valamint számot!' });
      return;
    }
  
    const hashedNewPass = await bcrypt.hash(this.newpass, 10);
    
    if (await bcrypt.compare(this.newpass, this.oldpassHash)) {
      this.message.add({ severity: 'error', summary: 'Hiba', detail: 'A megadott jelszó megegyezik az jelenlegivel!' });
      return;
    }
  
    let data = {
      passwd: hashedNewPass,
      reset_token: null,      // Clear the reset token
      token_expires_at: null  // Clear the expiration
    };
  
    console.log('Sending data:', data);
  
    this.api.updatePasswd('users', 'id', 'eq', this.userID, data).subscribe(
      res => {
        this.message.add({ severity: 'success', summary: 'Siker', detail: 'Jelszó módosítva!' });
        this.router.navigate(['/']);
      },
      err => {
        console.error('Error updating password:', err);
        this.message.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a jelszó módosítása során!' });
      }
    );
  }
}
