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
    console.log('Szoba neve:', this.roomName);  // Ellenőrizd, hogy mi jön vissza itt!

    if (this.roomName) {
        this.socket.emit("joinRoom", { roomName: this.roomName, user: this.auth.loggedUser().data });
    }

    this.socket.on("playerList", (members: any) => {
        this.players = members;
    });
}

  startGame() {
    this.socket.emit("startGame", { roomName: this.roomName });
    this.router.navigate([`/lobby/${this.roomName}`])
  }
}
