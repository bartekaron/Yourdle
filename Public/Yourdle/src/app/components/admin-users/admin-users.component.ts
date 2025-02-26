import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../services/api.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { User } from '../../interfaces/user';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

interface AdminUser{
  id: string;
  name: string;
  email: string;
  role: string;
  profilePic: string;
}

@Component({
  selector: 'app-admin-users',
  imports: [TableModule, TagModule, RatingModule, ButtonModule, CommonModule, ToolbarModule, ToastModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class AdminUsersComponent {
  usersDialog : boolean = false;

  users: any = {
    id: '',
    name: '',
    email: '',
    role: '',
    profilePic: ''
  };

  selectedUsers: AdminUser | null | undefined; 

  constructor(private api: ApiService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.TableLoad(); 
  }

  TableLoad() {
    this.api.getAllUsers().subscribe((data: any) => {
      this.users = data.users;
    });
  }

  editUser(user: any) {
    this.users = { ...user };
    this.usersDialog = true;
}

  deleteUser(user: any) {
         
      let email = user.email;
          this.api.deleteByEmail(email).subscribe((data: any) => {
            if (data.success) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'User Deleted',
                    life: 3000
                });
                this.TableLoad();
            }
            else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'User not Deleted',
                    life: 3000
                });
            }
    });
  }


}
