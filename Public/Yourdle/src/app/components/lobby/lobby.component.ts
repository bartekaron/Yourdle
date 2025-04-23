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
  isHost: boolean = false;
  category: string = '';
  categoryId: string = '';
  gameTypes: string[] = [];

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

    this.socketService.on("roomInfo", (room: any) => {
      console.log("Received room info:", room);
      this.isHost = room.owner === this.user.name;
      this.category = room.category;
      this.categoryId = room.categoryId;
      this.gameTypes = Array.isArray(room.gameTypes) ? room.gameTypes : [];
      console.log("Game types set to:", this.gameTypes, "Category ID:", this.categoryId);
    });

    this.socketService.on("gameStarted", (response: any) => {
      console.log("Game started response:", response);
      if (response.success) {
        const gameTypeMap: { [key: string]: string } = {
          'klasszikus': 'classic',
          'idezet': 'quote',
          'emoji': 'emoji',
          'kep': 'picture',
          'leiras': 'description'
        };

        if (!this.gameTypes || this.gameTypes.length === 0) {
          console.error('No game types available');
          return;
        }

        const firstGameType = this.gameTypes[0].toLowerCase();
        const routeGameType = gameTypeMap[firstGameType];

        if (routeGameType && this.categoryId) {
          console.log(`Navigating to: ${routeGameType}-game/${this.categoryId}/0`);
          this.router.navigate([`/${routeGameType}-game/${this.categoryId}/0`]);
        } else {
          console.error('Invalid game type or missing category ID:', 
                       { gameType: firstGameType, categoryId: this.categoryId });
        }
      }
    });

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && !event.url.includes(`/lobby/${this.roomName}`)) {
        this.leaveRoom(() => {
          this.socketService.emit("getRooms");
        });
      }
    });

    window.addEventListener('beforeunload', this.handleUnload);
  }

  ngOnDestroy() {
    this.leaveRoom(() => {
      this.socketService.emit("getRooms");
    });
    this.routerSub.unsubscribe();
    window.removeEventListener('beforeunload', this.handleUnload);
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
      }, () => {
        if (callback) callback();
      });
    }
  }

  handleLeave() {
    this.leaveRoom();
    this.router.navigate(['/parbaj']);
  }

  startGame() {
    if (!this.gameTypes || this.gameTypes.length === 0) {
      console.error('No game types available to start game');
      return;
    }
    
    this.socketService.emit("startGame", { 
      roomName: this.roomName
    });
  }
}
