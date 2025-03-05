import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../services/api.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { User } from '../../interfaces/user';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
 
 
@Component({
  selector: 'app-admin-users',
  imports: [TableModule, TagModule, RatingModule, ButtonModule, CommonModule, ToolbarModule, ToastModule, CommonModule, FormsModule, FloatLabelModule, ConfirmPopup],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class AdminUsersComponent {
 
  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;
 
  users:any = [];
 
 
  clonedUsers: { [s: string]: any } = {};
 
  constructor(private api: ApiService, private messageService: MessageService, private confirmationService: ConfirmationService) {}
 
  ngOnInit(): void {
   this.getUsers();
    
 
  }
 
accept() {
  this.confirmPopup.onAccept();
}
 
reject() {
  this.confirmPopup.onReject();
}
 
confirm(event: Event, user:any) {
  this.confirmationService.confirm({
    target: event.currentTarget as EventTarget,
      message: 'Delete user?',
      accept: () => {
        let email = user.email;
          this.api.deleteByEmail(email).subscribe(res=>{
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'User deleted'});
            this.getUsers();
          })
 
      },
      reject: () => {
        this.confirmationService.close();
      }
  });
}
 
getUsers(){
  this.api.getAllUsers().subscribe((res:any)=>{
    this.users = res.users;
    console.log(this.users);
    console.log("res", res.users);
  })
}
 
onRowEditInit(user: any) {
  this.clonedUsers[this.users.id as string] = { ...user };
}
 
onRowEditSave(user: any) {
      delete this.clonedUsers[user.id as string];
      let id = user.id;
      this.api.editUser(id).subscribe(res =>{
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User is updated' });
      });
}
 
onRowEditCancel(user: any, index: number) {
  this.users[index] = this.clonedUsers[user.id as string];
  this.getUsers();
}

}