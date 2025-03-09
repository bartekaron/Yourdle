import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { io } from 'socket.io-client';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-lobby',
  imports: [CommonModule, ButtonModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent implements OnInit {

  socket: any;
  roomName: string = '';
  players: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private auth:AuthService) {
    this.socket = io("http://localhost:3000");
  }

  ngOnInit() {
    this.roomName = this.route.snapshot.paramMap.get('roomName') || '';

    if (this.roomName) {
        this.socket.emit("joinRoom", { roomName: this.roomName, name: this.auth.loggedUser().data.name });
    }

    this.socket.on("playerList", (members: any) => {
      const uniqueMembers = Array.from(new Map(members.map((item:any) => [item.name, item])).values());
      this.players = uniqueMembers;
    });

}

  startGame() {
    this.socket.emit("startGame", { roomName: this.roomName });
    this.router.navigate([`/lobby/${this.roomName}`])
  }
}
