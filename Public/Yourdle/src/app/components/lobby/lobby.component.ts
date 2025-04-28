import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lobby',
  imports: [CommonModule, ButtonModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
  standalone: true
})
export class LobbyComponent implements OnInit, OnDestroy {
  roomName: string = '';
  user: any;
  members: any[] = [];
  isOwner: boolean = false;
  room: any = null;
  isLoading: boolean = true;
  error: string = '';
  private reconnectionAttempts: number = 0;
  private readonly MAX_RECONNECTION_ATTEMPTS = 5;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public socketService: SocketService,
    private auth: AuthService
  ) {}
  
  ngOnInit() {
    this.user = this.auth.loggedUser().data;
    this.roomName = this.route.snapshot.paramMap.get('roomName') || '';
    
    if (!this.roomName) {
      this.error = 'Missing room name';
      this.isLoading = false;
      return;
    }
    
    this.setupSocketListeners();
    
    // Check if socket is connected
    if (!this.socketService.isConnected()) {
      this.attemptReconnection();
    } else {
      this.joinRoom();
    }
  }
  
  private setupSocketListeners() {
    // Clean up previous listeners
    this.socketService.off('playerList');
    this.socketService.off('roomInfo');
    this.socketService.off('gameStarted');
    this.socketService.off('connect');
    this.socketService.off('disconnect');
    
    // Set up new listeners
    this.socketService.on('connect', () => {
      console.log('Socket reconnected, rejoining room');
      if (this.roomName) {
        this.joinRoom();
      }
    });
    
    this.socketService.on('disconnect', () => {
      console.log('Socket disconnected from lobby');
      this.attemptReconnection();
    });
    
    this.socketService.on('playerList', (members: any) => {
      console.log('Received player list:', members);
      if (Array.isArray(members)) {
        this.members = members;
        // Check if current user is the owner (room creator)
        this.isOwner = this.roomName === this.user.name;
        console.log(`Is owner: ${this.isOwner}, Room name: ${this.roomName}, User name: ${this.user.name}`);
      } else {
        console.error('Received invalid player list:', members);
        this.members = [];
      }
      this.isLoading = false;
    });
    
    this.socketService.on('roomInfo', (room: any) => {
      console.log('Received room info:', room);
      this.room = room;
      if (room && room.owner) {
        // Double check owner status based on room info
        this.isOwner = room.owner === this.user.name;
      }
      this.isLoading = false;
    });
    
    this.socketService.on('gameStarted', (response: any) => {
      console.log('Game started:', response);
      
      if (!response.success) {
        alert(response.message);
        return;
      }
      
      // Store response in room data for navigation
      this.room.response = response;
      
      this.navigateBasedOnGameType(response.gameTypes);
    });
  }
  
  private attemptReconnection() {
    if (this.reconnectionAttempts >= this.MAX_RECONNECTION_ATTEMPTS) {
      this.error = 'Failed to connect after multiple attempts. Please refresh the page.';
      this.isLoading = false;
      return;
    }
    
    this.reconnectionAttempts++;
    
    try {
      this.socketService.connect();
    } catch (e) {
      console.error('Error during socket connection attempt:', e);
    }
    
    setTimeout(() => {
      if (this.socketService.isConnected()) {
        console.log('Reconnection successful');
        this.joinRoom();
      } else {
        console.log('Still disconnected, retrying...');
        this.attemptReconnection();
      }
    }, 2000);
  }
  
  private joinRoom() {
    console.log(`Joining room ${this.roomName} as ${this.user.name}`);
    this.socketService.emit('joinRoom', {
      roomName: this.roomName,
      name: this.user.name
    }, (response: any) => {
      if (response && response.error) {
        this.error = `Failed to join room: ${response.error}`;
        this.isLoading = false;
      } else {
        console.log('Successfully joined room');
      }
    });
    
    // Get players in the room
    this.socketService.emit('getPlayers', { roomName: this.roomName });
    
    // Request room info
    this.socketService.emit('getRoomInfo', { roomName: this.roomName });
  }
  
  startGame() {
    console.log('Starting game in room:', this.roomName);
    if (!this.isOwner) {
      alert('Csak a szoba létrehozója indíthatja a játékot!');
      return;
    }
    
    if (this.members.length < 2) {
      alert('Legalább két játékosnak kell lennie a játék indításához!');
      return;
    }
    
    this.socketService.emit('startGame', { roomName: this.roomName });
  }
  
  leaveRoom() {
    console.log('Leaving room:', this.roomName);
    this.socketService.emit('leaveRoom', { 
      roomName: this.roomName,
      name: this.user.name
    }, () => {
      this.router.navigate(['/parbaj']);
    });
  }
  
  private navigateBasedOnGameType(gameTypes: string[]) {
    if (!gameTypes || gameTypes.length === 0) {
      alert('No game types specified');
      return;
    }
    
    // Get the response from the gameStarted event
    if (this.room && this.room.response && this.room.response.firstGame) {
      const firstGame = this.room.response.firstGame;
      console.log(`Navigating to ${firstGame}-duel/${this.roomName}`);
      this.router.navigate([`/${firstGame}-duel`, this.roomName]);
      return;
    }
    
    // Fall back to the old behavior if firstGame is not specified
    if (gameTypes.includes('klasszikus')) {
      console.log(`Navigating to classic-duel/${this.roomName}`);
      this.router.navigate(['/classic-duel', this.roomName]);
    }
    else if (gameTypes.includes('leiras')) {
      console.log(`Navigating to description-duel/${this.roomName}`);
      this.router.navigate(['/description-duel', this.roomName]);
    }
    else if (gameTypes.includes('idezet')) {
      console.log(`Navigating to quote-duel/${this.roomName}`);
      this.router.navigate(['/quote-duel', this.roomName]);
    }
    else if (gameTypes.includes('emoji')) {
      console.log(`Navigating to emoji-duel/${this.roomName}`);
      this.router.navigate(['/emoji-duel', this.roomName]);
    }
    else if (gameTypes.includes('kep')) {
      console.log(`Navigating to picture-duel/${this.roomName}`);
      this.router.navigate(['/picture-duel', this.roomName]);
    }
    else {
      // Fall back to default route if no specific game type matches
      console.warn('No matching game type found, using fallback route');
      this.router.navigate(['/classic-game', this.room.categoryId, '0']);
    }
  }
  
  ngOnDestroy() {
    // Clean up socket listeners
    this.socketService.off('playerList');
    this.socketService.off('roomInfo');
    this.socketService.off('gameStarted');
    this.socketService.off('connect');
    this.socketService.off('disconnect');
  }
}
