import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-summary-duel',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './summary-duel.component.html',
  styleUrl: './summary-duel.component.scss'
})
export class SummaryDuelComponent implements OnInit {
  roomName: string = '';
  user: any;
  players: any[] = [];
  gameResults: any[] = [];
  categoryName: string = '';
  categoryId: string = '';
  isLoading: boolean = true;
  error: string = '';
  finalResult: {
    winner?: string;
    isDraw: boolean;
    scores: {[player: string]: number};
  } = { 
    isDraw: false, 
    scores: {} 
  };
  
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private api: ApiService,
    private auth: AuthService,
    private socketService: SocketService
  ) {}
  
  private setupSocketListeners() {
    // Clean up previous listeners
    this.socketService.off("playerList");
    this.socketService.off("duelSummary");
    this.socketService.off("roomInfo");
    
    // Get players list
    this.socketService.on("playerList", (members: any) => {
      console.log('Received players:', members);
      this.players = Array.from(new Map(members.map((item: any) => [item.name, item])).values());
    });
    
    // Get room info for category name
    this.socketService.on("roomInfo", (info: any) => {
      console.log('Received room info:', info);
      if (info && info.category) {
        this.categoryName = info.category;
        this.categoryId = info.categoryId || '';
        
        // Request summary data after receiving room info
        this.socketService.emit("getDuelSummary", { roomName: this.roomName });
      }
    });
    
    // Get duel summary data
    this.socketService.on("duelSummary", (data: any) => {
      console.log('Received duel summary:', data);
      if (data) {
        this.gameResults = data.results || [];
        this.finalResult = data.finalResult || { 
          isDraw: false, 
          scores: {},
          winner: undefined
        };
        
        // Save match result only if we have all required data
        if (this.user.name === this.roomName && 
            this.categoryId && 
            this.players.length >= 2) {
          setTimeout(() => {
            this.saveMatchResult();
          }, 500);
        }
        
        this.isLoading = false;
      } else {
        console.error('Received invalid duel summary data');
        this.error = 'Hiba történt az eredmények betöltésekor';
        this.isLoading = false;
      }
    });
  }

  ngOnInit() {
    this.user = this.auth.loggedUser().data;
    this.roomName = this.route.snapshot.paramMap.get('roomName') || '';
    
    if (!this.roomName) {
      this.error = "Missing room name";
      this.isLoading = false;
      return;
    }
    
    // Ensure socket is connected
    if (!this.socketService.isConnected()) {
      this.socketService.connect();
    }
    
    // Set up listeners first
    this.setupSocketListeners();
    
    // Join the room
    this.socketService.emit("joinRoom", {
      roomName: this.roomName,
      name: this.user.name
    });
    
    // Get room info - this will trigger the summary request
    this.socketService.emit("getRoomInfo", { roomName: this.roomName });
  }

  private async saveMatchResult() {
    try {
      if (!this.finalResult || !this.players || this.players.length < 2) {
        console.warn('Not enough data to save match result');
        return;
      }

      const player1Name = this.roomName;
      const player2Name = this.players.find(p => p.name !== this.roomName)?.name;

      if (!player1Name || !player2Name) {
        console.error('Cannot identify players:', this.players);
        return;
      }

      const userMap = await this.fetchUserIds([player1Name, player2Name]);
      const player1Id = userMap.get(player1Name);
      const player2Id = userMap.get(player2Name);

      if (!player1Id || !player2Id) {
        console.error('Could not get valid IDs for players');
        return;
      }

      // Determine winner ID
      let winnerId = null;
      if (!this.finalResult.isDraw && this.finalResult.winner) {
        winnerId = this.finalResult.winner === player1Name ? player1Id : 
                  this.finalResult.winner === player2Name ? player2Id : null;
      }

      const matchData = {
        player1ID: player1Id,
        player2ID: player2Id,
        winnerID: winnerId,
        categoryId: this.categoryId
      };

      console.log('Saving match result:', matchData);

      this.api.saveMatchResult(matchData).subscribe({
        next: (response) => console.log('Match result saved:', response),
        error: (err) => console.error('Error saving match result:', err)
      });

    } catch (error) {
      console.error('Error in saveMatchResult:', error);
    }
  }

  // Helper method to fetch user IDs for multiple usernames at once
  private fetchUserIds(usernames: string[]): Promise<Map<string, string>> {
    return new Promise((resolve, reject) => {
      // Create a map to store username -> id mappings
      const userMap = new Map<string, string>();
      
      // Always ensure current user's ID is available
      if (this.user && this.user.id) {
        userMap.set(this.user.name, this.user.id);
      }
      
      // Use getAllUsers to get all users at once
      this.api.getAllUsers().subscribe({
        next: (response: any) => {
          // Check for the specific structure returned by the API
          if (response && response.success && Array.isArray(response.users)) {
            // Map usernames to their IDs from the users array
            response.users.forEach((user: any) => {
              if (user.name && user.id && usernames.includes(user.name)) {
                userMap.set(user.name, user.id);
              }
            });
            
            // Log the mapped users for debugging
            console.warn('User mapping completed:', Object.fromEntries(userMap.entries()));
            
            // Make sure we have all required users
            const hasMissingUsers = usernames.some(username => !userMap.has(username));
            if (hasMissingUsers) {
              console.warn('Missing some user IDs, username mapping is incomplete', 
                           { expected: usernames, found: Array.from(userMap.keys()) });
            }
            
            resolve(userMap);
          } else {
            console.error('Unexpected response format from getAllUsers:', response);
            resolve(userMap); // Return what we have so far
          }
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          reject(err);
        }
      });
    });
  }
  
  // Get display name for a game type
  getGameDisplayName(gameType: string): string {
    const displayNames: { [key: string]: string } = {
      'classic': 'Klasszikus',
      'description': 'Leírás',
      'emoji': 'Emoji',
      'quote': 'Idézet',
      'picture': 'Kép'
    };
    return displayNames[gameType] || gameType;
  }
  
  // Return to duel lobby
  returnToDuelLobby() {
    // Leave the room first
    this.socketService.emit("leaveRoom", {
      roomName: this.roomName,
      name: this.user.name
    }, () => {
      this.router.navigate(['/parbaj']);
    });
  }
  
  ngOnDestroy() {
    // Clean up listeners
    this.socketService.off("playerList");
    this.socketService.off("duelSummary");
    this.socketService.off("roomInfo");
  }
}
