import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
//import { MessageService } from '../../services/message.service';
//import * as CryptoJS from 'crypto-js';
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
  secret:string = '';
  oldpassHash:string = ''

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private message: MessageService,
    private router: Router
  ){}

  changeable:boolean = false;

  ngOnInit(): void {
    this.userID = this.activatedRoute.snapshot.params['userId'];

    this.api.read('users', 'id', 'eq', this.userID).subscribe((res:any) => {
      if (res){
        this.changeable = true;
        this.oldpassHash = res[0].passwd;
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
  
    this.newpass = await bcrypt.hash(this.newpass, 10);
    console.log(this.newpass);
    console.log(this.oldpassHash);
    if (this.newpass == this.oldpassHash) {
      this.message.add({ severity: 'error', summary: 'Hiba', detail: 'A megadott jelszó megegyezik az jelenlegivel!' });
      return;
    }
  
    let data = {
      passwd: this.newpass
    };
  
    // Log the data before sending it
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
