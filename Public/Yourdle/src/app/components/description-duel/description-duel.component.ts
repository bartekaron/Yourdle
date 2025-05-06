import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-description-duel',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './description-duel.component.html',
  styleUrl: './description-duel.component.scss'
})
export class DescriptionDuelComponent implements OnInit, OnDestroy {
  roomName: string = '';
  categoryName: string = '';
  categoryData: any;
  categoryId: string = '';
  user: any;
  players: any[] = [];
  currentPlayer: string = '';
  
  characters: any[] = [];
  filteredCharacters: any[] = [];
  selectedCharacter: any = null;
  targetCharacter: any = null;
  previousGuesses: any[] = [];
  loading: boolean = true;
  error: string = '';
  private roomInfoInterval: any;
  private connectionRetryCount: number = 0;
  private maxRetries: number = 5;
  private socketReconnecting: boolean = false;
  
  // Game sequence properties
  gameSequence: string[] = [];
  currentGameIndex: number = 0;
  currentGame: string = 'description';
  
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
    
    // Don't set current player to self initially - wait for server confirmation
    this.currentPlayer = ''; 

    if (!this.roomName) {
      this.error = "Missing room name";
      this.loading = false;
      return;
    }

    this.setupSocketListeners();
    
    // Check if socket is connected
    if (!this.socketService.isConnected()) {
      this.attemptReconnection();
    } else {
      // Only join room if socket is connected
      this.joinRoom();
    }
  }

  private attemptReconnection() {
    if (this.connectionRetryCount >= this.maxRetries) {
      this.error = "Failed to connect after multiple attempts. Please refresh the page.";
      this.loading = false;
      return;
    }

    this.socketReconnecting = true;
    this.connectionRetryCount++;
    
    // Create a new socket connection
    try {
      this.socketService.connect();
    } catch (e) {
      console.error("Error during socket connection attempt:", e);
    }
    
    setTimeout(() => {
      console.log(`Checking connection status (${this.connectionRetryCount}/${this.maxRetries})...`);
      
      if (this.socketService.isConnected()) {
        console.log("Reconnection successful");
        this.socketReconnecting = false;
        this.joinRoom();
      } else {
        console.log("Still disconnected, retrying...");
        this.attemptReconnection();
      }
    }, 2000); // Wait 2 seconds before retrying
  }

  private joinRoom() {
    // Join the room if not already in
    this.socketService.emit("joinRoom", {
      roomName: this.roomName,
      name: this.user.name
    }, (response: any) => {
      if (response && response.error) {
        console.error("Error joining room:", response.error);
        this.error = `Failed to join room: ${response.error}`;
        this.loading = false;
      }
    });
    
    // Get players in the room
    this.socketService.emit("getPlayers", { roomName: this.roomName });
    
    // Request room info
    this.socketService.emit("getRoomInfo", { roomName: this.roomName });

    // Set a timeout for room info in case it doesn't arrive
    this.setRoomInfoTimeout();
  }

  private setupSocketListeners() {
    // Clean up previous listeners to avoid duplicates
    this.socketService.off("playerList");
    this.socketService.off("roomInfo");
    this.socketService.off("targetCharacter");
    this.socketService.off("newGuess");
    this.socketService.off("playerTurn");
    this.socketService.off("gameOver");
    this.socketService.off("gameSequence");
    this.socketService.off("disconnect");
    this.socketService.off("connect");

    // Handle reconnection events
    this.socketService.on("connect", () => {
      console.log("Socket reconnected, rejoining room");
      if (this.roomName) {
        this.joinRoom();
      }
    });
    
    this.socketService.on("disconnect", () => {
      console.log("Socket disconnected");
      this.attemptReconnection();
    });

    this.socketService.on("playerList", (members: any) => {
      console.log("Received player list:", members);
      const uniqueMembers = Array.from(new Map(members.map((item: any) => [item.name, item])).values());
      this.players = uniqueMembers;

      // If this is the first player and we're just starting, set them as current player
      if (this.players.length === 1) {
        this.currentPlayer = this.players[0].name;
      }

      // If we're the room owner and we have more than one player, set the first player to start
      if (this.user.name === this.roomName && this.players.length > 1 && !this.currentPlayer) {
        setTimeout(() => {
          this.socketService.emit("playerTurn", {
            roomName: this.roomName,
            playerName: this.players[0].name
          });
        }, 1000); // Small delay to ensure all clients are ready
      }
    });

    // Listen for turn changes
    this.socketService.on("playerTurn", (playerName: string) => {
      console.log("Turn changed to:", playerName);
      this.currentPlayer = playerName;
      
      // If it's this player's turn, show a notification
      if (playerName === this.user.name) {
        // Optional: Add a visual or sound notification
        console.log("It's your turn!");
      }
    });

    // Listen for room info response
    this.socketService.on("roomInfo", (info: any) => {
      console.log("Received room info:", info);
      
      if (info.error) {
        console.error("Room info error:", info.error);
        return;
      }

      if (this.roomInfoInterval) {
        clearInterval(this.roomInfoInterval);
        this.roomInfoInterval = null;
      }

      if (info && info.category && info.categoryId) {
        this.categoryName = info.category;
        this.categoryId = info.categoryId;
        this.categoryData = info;

        // Process game sequence information
        if (info.gameTypes && Array.isArray(info.gameTypes)) {
          // Map game types to their internal names
          const gameTypeMapping: { [key: string]: string } = {
            'klasszikus': 'classic',
            'leiras': 'description',
            'emoji': 'emoji',
            'idezet': 'quote',
            'kep': 'picture'
          };
          
          // Sort game types in the correct order
          const orderedTypes = ['klasszikus', 'leiras', 'emoji', 'idezet', 'kep'];
          
          // Filter and sort game types based on what's available in this room
          this.gameSequence = orderedTypes
            .filter(type => info.gameTypes.includes(type))
            .map(type => gameTypeMapping[type]);
            
          // Find our current position in the sequence
          this.currentGameIndex = this.gameSequence.indexOf('description');
          console.log("Game sequence:", this.gameSequence, "Current index:", this.currentGameIndex);
        }

        // Try to get target character from room data
        if (info.targetCharacter) {
          console.log("Using target character from room info");
          this.targetCharacter = info.targetCharacter;
          this.loading = false;
          this.loadCharactersIfNeeded();
        } else {
          this.loadCharactersIfNeeded();
        }
      } else {
        this.error = "Invalid room information received";
        this.loading = false;
      }
    });

    // Listen for target character updates
    this.socketService.on("targetCharacter", (data: any) => {
      console.log("Received target character update:", data);
      if (data && data.target) {
        this.targetCharacter = data.target;
        this.loading = false;
      }
    });

    // Listen for guesses from other players
    this.socketService.on("newGuess", (data: any) => {
      console.log("Received guess from other player:", data);
      
      // Add the guess to our list if it's not already there
      if (!this.previousGuesses.some(g => 
          g.answer === data.guess.answer && g.player === data.player)) {
        
        this.previousGuesses.unshift(data.guess);
        
        // Remove guessed character from available options
        this.characters = this.characters.filter(char => 
          char.answer.toLowerCase() !== data.guess.answer.toLowerCase()
        );
      }
    });

    // Listen for game over events
    this.socketService.on("gameOver", (data: any) => {
      // If there's a next game in the sequence, navigate to it after a short delay
      setTimeout(() => {
        if (data.isLastGame) {
          this.router.navigate(['/summary-duel', this.roomName]);
        } else if (data.nextGame) {
          this.router.navigate([`/${data.nextGame}-duel`, this.roomName]);
        } else {
          this.router.navigate(['/parbaj']);
        }
      }, 2000);
    });
    
    // Listen for game sequence updates
    this.socketService.on("gameSequence", (data: any) => {
      if (data && data.sequence) {
        this.gameSequence = data.sequence;
        this.currentGameIndex = data.currentIndex || 0;
        console.log("Updated game sequence:", this.gameSequence, "Current index:", this.currentGameIndex);
      }
    });
  }

  private loadCharactersIfNeeded() {
    // If we don't have characters yet, fetch them
    if (!this.characters || this.characters.length === 0) {
      console.log("Fetching characters for category:", this.categoryId);
      this.api.getAllDescription(this.categoryId).subscribe({
        next: (response: any) => {
          console.log("Fetched characters:", response);
          const chars = Array.isArray(response) ? response : response.data;
          if (!chars || !chars.length) {
            this.error = "No characters available for this category";
            this.loading = false;
            return;
          }
          this.characters = chars;
          
          // If we already have a target character, we're good to go
          if (this.targetCharacter) {
            this.loading = false;
          } 
          // If we're the room owner and need to select a target character
          else if (this.user?.name === this.roomName) {
            this.selectAndShareTargetCharacter();
          }
        },
        error: (err) => {
          console.error("Error loading characters:", err);
          this.error = "Failed to load characters";
          this.loading = false;
        }
      });
    }
  }

  private selectAndShareTargetCharacter() {
    if (!this.characters || this.characters.length === 0) {
      console.error("Cannot select target character, no characters available");
      return;
    }
    
    // Select a random character as the target
    const randomIndex = Math.floor(Math.random() * this.characters.length);
    this.targetCharacter = this.characters[randomIndex];
    
    console.log("Setting target character:", this.targetCharacter);
    
    // Save the target character to the room so all players see the same question
    this.socketService.emit("setTargetCharacter", {
      roomName: this.roomName,
      target: this.targetCharacter
    });
    
    this.loading = false;
  }

  private setRoomInfoTimeout() {
    const roomInfoTimeout = setTimeout(() => {
      if (this.loading) {
        console.error("Room info timed out - retrying");
        if (this.roomInfoInterval) {
          clearInterval(this.roomInfoInterval);
        }
        this.roomInfoInterval = setInterval(() => {
          if (!this.loading) {
            clearInterval(this.roomInfoInterval);
            this.roomInfoInterval = null;
            return;
          }
          console.log("Retrying room info for:", this.roomName);
          this.socketService.emit("getRoomInfo", { roomName: this.roomName });
        }, 5000);
      }
    }, 10000);
  }

  ngOnDestroy() {
    // Leave the room when component is destroyed
    if (this.socketService.isConnected()) {
      this.socketService.emit("leaveRoom", {
        roomName: this.roomName,
        name: this.user.name
      });
    }
    
    // Clear roomInfo polling
    if (this.roomInfoInterval) {
      clearInterval(this.roomInfoInterval);
      this.roomInfoInterval = null;
    }
    
    // Clean up socket listeners
    this.socketService.off("playerList");
    this.socketService.off("roomInfo");
    this.socketService.off("targetCharacter");
    this.socketService.off("newGuess");
    this.socketService.off("playerTurn");
    this.socketService.off("gameOver");
    this.socketService.off("disconnect");
    this.socketService.off("connect");
  }

  filterCharacters(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCharacters = this.characters.filter(
      (character) => character.answer.toLowerCase().indexOf(query) >= 0
    );
    
    // Auto-select if only one match
    if (this.filteredCharacters.length === 1) {
      this.selectedCharacter = this.filteredCharacters[0];
    }
  }

  // Add this helper method to extract the answer field from any item type
  extractAnswerFromItem(item: any): string {
    if (!item) return '';
    
    // If it's already a string, return it directly
    if (typeof item === 'string') return item;
    
    // If it's an object with an answer property, return that
    if (typeof item === 'object') {
      // Direct answer property
      if (item.answer) return item.answer;
      
      // For objects like the one in your example with nested value
      if (item.value && item.value.answer) return item.value.answer;
      
      // For JSON strings, try to parse
      try {
        const parsed = JSON.parse(JSON.stringify(item));
        if (parsed && parsed.answer) return parsed.answer;
        if (parsed && parsed.value && parsed.value.answer) return parsed.value.answer;
      } catch (e) {
        // Not a JSON string, ignore
      }
    }
    
    // Fallback to string representation
    return String(item);
  }
  
  onCharacterSelect(event: any) {
    console.log('Original selected event:', event);
    
    // Extract answer from the event object, no matter how deeply nested
    this.selectedCharacter = this.extractAnswerFromItem(event);
    
    console.log('Processed selected character:', this.selectedCharacter);
  }

  submitCharacter() {
    // Only allow the current player to submit guesses
    if (this.currentPlayer !== this.user.name) {
      return;
    }
    
    if (!this.selectedCharacter && this.filteredCharacters.length === 1) {
      // Use just the answer property if auto-selecting
      this.selectedCharacter = this.filteredCharacters[0].answer;
    }
    
    if (!this.selectedCharacter) return;
    
    // Extract answer if it's still an object
    const selectedValue = this.extractAnswerFromItem(this.selectedCharacter).toLowerCase();
    
    // Find the matching character object from our list
    const selectedCharacterObj = this.characters.find(
      char => char.answer.toLowerCase() === selectedValue
    );
    
    if (!selectedCharacterObj) {
      console.warn('No matching character found for:', this.selectedCharacter);
      return;
    }
    
    const isCorrect = selectedCharacterObj.answer === this.targetCharacter.answer;
    
    const guess = {
      answer: selectedCharacterObj.answer,
      isCorrect: isCorrect,
      player: this.user.name
    };
    
    this.previousGuesses.unshift(guess);
    
    // Remove guessed character from the list to prevent reguessing
    this.characters = this.characters.filter(char => 
      char.answer.toLowerCase() !== selectedCharacterObj.answer.toLowerCase()
    );
    
    // Broadcast guess to other player
    this.socketService.emit("submitGuess", {
      roomName: this.roomName,
      guess: guess,
      player: this.user.name
    });
    
    // Check if the game is won
    if (isCorrect) {
      // Find the next game in sequence, if any
      const nextGameIndex = this.currentGameIndex + 1;
      const nextGame = nextGameIndex < this.gameSequence.length ? this.gameSequence[nextGameIndex] : null;
      
      this.socketService.emit("gameCompleted", {
        roomName: this.roomName,
        winner: this.user.name,
        targetCharacter: this.targetCharacter,
        currentGame: 'description',
        nextGame: nextGame
      });
    }
    
    this.selectedCharacter = null;
  }

  reloadGame() {
    console.log("Manual reload triggered");
    this.loading = true;
    this.error = '';
    
    if (!this.socketService.isConnected()) {
      this.attemptReconnection();
      return;
    }
    
    this.joinRoom();
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
}

