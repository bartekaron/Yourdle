import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-users',
  imports: [TableModule, TagModule, RatingModule, ButtonModule, CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent {
  users: any = [];

  constructor(private api: ApiService) {
    this.api.getAllUsers().subscribe((data: any) => {
      this.users = data.users;  
      console.log(data);
    });
  }


}
