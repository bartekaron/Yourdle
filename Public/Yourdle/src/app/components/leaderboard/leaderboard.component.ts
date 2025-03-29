import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-leaderboard',
  imports: [TableModule, CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any[] = [];
  userData: any = null;
  userStats: any = null;
  loading: boolean = true;


  constructor(private api: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
    this.loadCurrentUser();
  }

  loadLeaderboard() {
    this.api.getLeaderboard().subscribe((response: any) => {
      if (response.success) {
        this.leaderboard = response.data.map((entry:any, index:any) => ({
          ...entry,
          points: entry.wins * 1 - entry.losses * 1 + entry.draws * 0, // Pontszám számítása
          rank: index + 1 // Helyezés beállítása
        })).sort((a:any, b:any) => b.points - a.points); // Rendezés pontszám szerint
      }
      this.loading = false;
    });
  }

  loadCurrentUser() {
    const user = this.authService.loggedUser();
    if (user) {
      this.userData = user.data;
      this.api.getLeaderboardOneUser(user.data.id).subscribe((response: any) => {
        if (response.success) {
          this.userStats = {
            ...response.data,
            points: response.data.wins * 1 - response.data.losses * 1 + response.data.draws * 0
          };
        }
      });
    }
  }

}
