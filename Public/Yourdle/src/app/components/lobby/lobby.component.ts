import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lobby',
  imports: [CommonModule, ButtonModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent implements OnInit, OnDestroy {
  user: any;
  roomName: string = '';
  players: any[] = [];
  routerSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.roomName = this.route.snapshot.paramMap.get('roomName') || '';
    this.user = this.auth.loggedUser().data;

    if (this.roomName) {
      this.socketService.emit("joinRoom", {
        roomName: this.roomName,
        name: this.user.name
      });
    }

    this.socketService.on("playerList", (members: any) => {
      const uniqueMembers = Array.from(new Map(members.map((item: any) => [item.name, item])).values());
      this.players = uniqueMembers;
    });

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && !event.url.includes(`/lobby/${this.roomName}`)) {
        this.leaveRoom();
      }
    });

    window.addEventListener('beforeunload', this.handleUnload);
  }

  ngOnDestroy() {
    this.leaveRoom(() => {
      this.socketService.emit("getRooms");
    });
    window.removeEventListener('beforeunload', this.handleUnload);
    this.routerSub.unsubscribe();
    this.socketService.disconnect();
  }

  handleUnload = () => {
    this.leaveRoom();
    this.socketService.disconnect();
  };

  leaveRoom(callback?: () => void) {
    if (this.roomName && this.user?.name && this.socketService.connected) {
      this.socketService.emit("leaveRoom", {
        roomName: this.roomName,
        name: this.user.name
      }, 
      () => {
        
        if (callback) callback();
      });
    }
  }

  handleLeave() {
    this.leaveRoom();
    this.router.navigate(['/parbaj']);
  }

  startGame() {
    this.socketService.emit("startGame", { roomName: this.roomName });
    this.router.navigate([`/lobby/${this.roomName}`]);
  }
}
