import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-picture-duel',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './picture-duel.component.html',
  styleUrl: './picture-duel.component.scss'
})
export class PictureDuelComponent implements OnInit, OnDestroy {
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
  revealedPicture: string | null = null;
  blurLevel: number = 20; // Initial high blur level
  private roomInfoInterval: any;
  private connectionRetryCount: number = 0;
  private maxRetries: number = 5;
  private socketReconnecting: boolean = false;
  private server = environment.serverUrl; // Add server URL from environment
  
  // Game sequence properties
  gameSequence: string[] = [];
  currentGameIndex: number = 0;
  currentGame: string = 'picture';
  
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
      if (this.socketService.isConnected()) {
        this.socketReconnecting = false;
        this.joinRoom();
      } else {
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
      if (this.roomName) {
        this.joinRoom();
      }
    });
    
    this.socketService.on("disconnect", () => {
      this.attemptReconnection();
    });

    this.socketService.on("playerList", (members: any) => {
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
      this.currentPlayer = playerName;
      
      // If it's this player's turn, show a notification
      if (playerName === this.user.name) {
        // Optional: Add a visual or sound notification
      }
    });

    // Listen for room info response
    this.socketService.on("roomInfo", (info: any) => {
      
      if (info.error) {
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
          this.currentGameIndex = this.gameSequence.indexOf('picture');
          console.log("Game sequence:", this.gameSequence, "Current index:", this.currentGameIndex);
        }

        // Try to get target character from room data
        if (info.targetCharacter) {
          this.targetCharacter = info.targetCharacter;
          
          // Instead of directly using the picture property, load the decrypted image
          this.loadDecryptedImage();
          
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

    // Listen for target character updates - update this part
    this.socketService.on("targetCharacter", (data: any) => {
      if (data && data.target) {
        this.targetCharacter = data.target;
        
        // Instead of directly using the picture property, load the decrypted image
        this.loadDecryptedImage();
        
        this.loading = false;
      }
    });

    // Listen for guesses from other players
    this.socketService.on("newGuess", (data: any) => {
      
      // Add the guess to our list if it's not already there
      if (!this.previousGuesses.some(g => 
          g.answer === data.guess.answer && g.player === data.player)) {
        this.previousGuesses.unshift(data.guess);
        
        // Remove guessed character from available options
        this.characters = this.characters.filter(char => 
          char.answer.toLowerCase() !== data.guess.answer.toLowerCase()
        );

        // Decrease blur level with each guess
        this.decreaseBlurLevel(data.guess.isCorrect);
      }
    });

    // Listen for game over events
    this.socketService.on("gameOver", (data: any) => {
      if (data.winner !== this.user.name) {
        this.blurLevel = 0; // Show image clearly
      }
      
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
      this.api.getAllPicture(this.categoryId).subscribe({
        next: (response: any) => {
          // EXACTLY match picture-game component character handling
          if (response && response.data && Array.isArray(response.data)) {
            this.characters = response.data;
            // Extract just the answer names as in picture-game
            const names = response.data.map((char: any) => char.answer);
          } else {
            this.characters = Array.isArray(response) ? response : [];
          }
          
          if (!this.characters || this.characters.length === 0) {
            this.error = "No characters available for this category";
            this.loading = false;
            return;
          }
          
          // If we already have a target character, we're good to go
          if (this.targetCharacter) {
            this.loading = false;
            // Instead of directly using the picture property, load the decrypted image
            this.loadDecryptedImage();
          } 
          // If we're the room owner and need to select a target character
          else if (this.user?.name === this.roomName) {
            this.selectAndShareTargetCharacter();
          }
        },
        error: (err) => {
          this.error = "Failed to load characters";
          this.loading = false;
        }
      });
    }
  }

  private selectAndShareTargetCharacter() {
    if (!this.characters || this.characters.length === 0) {
      return;
    }
    
    // Select a random character as the target
    const randomIndex = Math.floor(Math.random() * this.characters.length);
    this.targetCharacter = this.characters[randomIndex];
    
    // Instead of directly using the picture property, load the decrypted image
    this.loadDecryptedImage();
    
    // Share with others
    this.socketService.emit("setTargetCharacter", {
      roomName: this.roomName,
      target: this.targetCharacter
    });
    
    this.loading = false;
  }

  private forceDirectImageUrl() {
    // Try multiple approaches to fix the image problem
    if (this.targetCharacter && this.targetCharacter.picture) {
      // Approach 1: Direct assignment
      this.revealedPicture = this.targetCharacter.picture;
      
      // Approach 2: Try with server URL prefix
      if (this.revealedPicture && !this.revealedPicture.startsWith('http')) {
        const withServer = `${this.server}/${this.targetCharacter.picture.replace(/^\//, '')}`;
        this.revealedPicture = withServer;
      }
      
      // Approach 3: Try hardcoded server + path
      if (this.targetCharacter.picture.includes('/uploads/')) {
        const parts = this.targetCharacter.picture.split('/uploads/');
        if (parts.length > 1) {
          this.revealedPicture = `${this.server}/uploads/${parts[1]}`;
        }
      }
    }
  }

  // Helper method to ensure we have an absolute URL
  private ensureAbsoluteUrl(url: string): string {
    if (!url) return '';
    
    // If URL starts with http:// or https:// it's already absolute
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If URL starts with /, append to server base URL
    if (url.startsWith('/')) {
      return `${this.server}${url}`;
    }
    
    // Otherwise prepend server URL
    return `${this.server}/${url}`;
  }

  private setRoomInfoTimeout() {
    const roomInfoTimeout = setTimeout(() => {
      if (this.loading) {
        if (this.roomInfoInterval) {
          clearInterval(this.roomInfoInterval);
        }
        this.roomInfoInterval = setInterval(() => {
          if (!this.loading) {
            clearInterval(this.roomInfoInterval);
            this.roomInfoInterval = null;
            return;
          }
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

  onCharacterSelect(event: any) {
    this.selectedCharacter = event;
  }

  private decreaseBlurLevel(correct: boolean) {
    if (correct) {
      // Correct guess, remove all blur
      this.blurLevel = 0;
    } else {
      // Incorrect guess, decrease blur gradually
      this.blurLevel = Math.max(0, this.blurLevel - 4);
    }
  }

  submitCharacter() {
    // Only allow the current player to submit guesses
    if (this.currentPlayer !== this.user.name) {
      return;
    }
    
    if (!this.selectedCharacter && this.filteredCharacters.length === 1) {
      this.selectedCharacter = this.filteredCharacters[0];
    }
    
    if (!this.selectedCharacter) return;
    
    // Find the matching character object from our list
    const selectedCharacterObj = this.characters.find(
      char => char.answer.toLowerCase() === 
      (typeof this.selectedCharacter === 'string' ? 
       this.selectedCharacter.toLowerCase() : 
       this.selectedCharacter.answer.toLowerCase())
    );
    
    if (!selectedCharacterObj) {
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
    
    // Decrease blur level based on the guess result
    this.decreaseBlurLevel(isCorrect);
    
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
        currentGame: 'picture',
        nextGame: nextGame
      });
    }
    
    this.selectedCharacter = null;
  }

  reloadGame() {
    this.loading = true;
    this.error = '';
    this.selectedCharacter = null;
    this.blurLevel = 20; // Reset blur level
    
    if (!this.socketService.isConnected()) {
      this.attemptReconnection();
      return;
    }
    
    this.joinRoom();
  }

  // Instead of using the target character's picture directly, fetch the decrypted image
  private loadDecryptedImage() {
    if (this.targetCharacter && this.categoryId) {
      // Use the getSolutionPicture endpoint to get the decrypted image
      this.api.getSolutionPicture(this.categoryId).subscribe({
        next: (data: any) => {
          if (data.success && data.data && data.data.picture) {
            this.revealedPicture = data.data.picture;
          } else {
            console.error("Failed to get decrypted image:", data);
          }
        },
        error: (err) => {
          console.error("Error fetching decrypted image:", err);
        }
      });
    } else {
      console.warn("Cannot load decrypted image, missing target character or category ID");
    }
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
