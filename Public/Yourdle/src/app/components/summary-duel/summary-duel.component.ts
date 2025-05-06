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
  savedResult: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private api: ApiService,
    private auth: AuthService,
    private socketService: SocketService
  ) {}
  
  ngOnInit() {
    this.user = this.auth.loggedUser().data;
    this.roomName = this.route.snapshot.paramMap.get('roomName') || '';
    
    if (!this.roomName) {
      this.error = "Missing room name";
      this.isLoading = false;
      return;
    }
    
    // Ensure socket is connected before setting up listeners
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
    
    // First get room info for category name and ID
    this.socketService.emit("getRoomInfo", { roomName: this.roomName });
    
    // Then request summary data after a short delay to ensure everything is loaded
    setTimeout(() => {
      this.socketService.emit("getDuelSummary", { roomName: this.roomName });
    }, 300);
  }
  
  private setupSocketListeners() {
    // Clean up previous listeners
    this.socketService.off("playerList");
    this.socketService.off("duelSummary");
    this.socketService.off("roomInfo");
    
    // Get players list
    this.socketService.on("playerList", (members: any) => {
      this.players = Array.from(new Map(members.map((item: any) => [item.name, item])).values());
    });
    
    // Get room info for category name
    this.socketService.on("roomInfo", (info: any) => {
      if (info && info.category) {
        this.categoryName = info.category;
        
        // Store categoryId for later use
        if (info.categoryId) {
          this.categoryId = info.categoryId;
        }
      }
    });
    
    // Get duel summary data
    this.socketService.on("duelSummary", (data: any) => {
      if (data) {
        this.gameResults = data.results || [];
        this.finalResult = data.finalResult || { isDraw: false, scores: {} };
        
        // Add a delay to make sure room info and players are loaded
        setTimeout(() => {
          // Save match result to database if user is room owner
          if (this.user.name === this.roomName) {
            this.saveMatchResult();
          }
        }, 500);
        
        this.isLoading = false;
      }
    });
  }
  
  saveMatchResult() {
    console.warn('Saving match result...');
    // Only room owner saves the match result to avoid duplicates
    if (!this.finalResult || !this.players || this.players.length < 2) return;
    
    try {
      // We need to fetch actual user IDs since the players array might only have socket IDs
      // Get player info for the room owner
      const player1Name = this.roomName;
      
      // Find any other player for player 2
      const player2Name = this.players.find(p => p.name !== this.roomName)?.name;
      
      if (!player1Name || !player2Name) {
        console.error('Cannot identify both players:', this.players);
        return;
      }
      
      // Fetch all users at once and find player IDs
      this.fetchUserIds([player1Name, player2Name]).then(userMap => {
        const player1Id = userMap.get(player1Name);
        const player2Id = userMap.get(player2Name);
        
        if (!player1Id || !player2Id) {
          console.error('Could not get valid IDs for one or more players');
          return;
        }
        


        // Initialize winnerID as null by default (for draws)
        let winnerId = null;
        
        // Only set a winner ID if it's explicitly NOT a draw and we have a valid winner name
        if (this.finalResult.isDraw === false && this.finalResult.winner) {
          winnerId = this.finalResult.winner === player1Name ? player1Id : 
                    this.finalResult.winner === player2Name ? player2Id : null;
        }
        
        // Prepare data to match games table schema exactly
        const matchData = {
          player1ID: player1Id,
          player2ID: player2Id,
          winnerID: winnerId, // null for draws
          categoryId: this.categoryId
        };

        console.log('Saving match result:', matchData);
        this.savedResult = true;

        // Save to the database
        this.api.saveMatchResult(matchData).subscribe({
          next: (response) => console.log('Match result saved:', response),
          error: (err) => {
            console.error('Error saving match result:', err);
            this.savedResult = false;
          }
        });

        // Update the leaderboard separately (handles draws with null winnerID)
        this.api.uploadLeaderboard(matchData).subscribe({
          next: (response) => console.log('Leaderboard updated:', response),
          error: (err) => console.error('Error updating leaderboard:', err)
        });
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
