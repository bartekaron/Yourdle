import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-classic-duel',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './classic-duel.component.html',
  styleUrl: './classic-duel.component.scss'
})
export class ClassicDuelComponent implements OnInit, OnDestroy {
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

  // Properties for character comparison
  characterProperties: { key: string, label: string }[] = [
    { key: 'answer', label: 'Név' },
    { key: 'gender', label: 'Nem' },
    { key: 'height', label: 'Magasság' },
    { key: 'weight', label: 'Súly' },
    { key: 'hairColor', label: 'Hajszín' },
    { key: 'address', label: 'Származás' },
    { key: 'age', label: 'Életkor' }
  ];

  // Game sequence properties
  gameSequence: string[] = [];
  currentGameIndex: number = 0;
  currentGame: string = 'classic';

  private roomInfoInterval: any;
  private connectionRetryCount: number = 0;
  private maxRetries: number = 5;
  private socketReconnecting: boolean = false;

  // Add this property if it's not already there
  playersVisible = true;
  
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private api: ApiService,
    private auth: AuthService,
    private socketService: SocketService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    // Set visibility based on screen size
    this.playersVisible = window.innerWidth > 768;
  }

  ngOnInit() {
    // ... similar to description-duel init ...
    this.user = this.auth.loggedUser().data;
    this.roomName = this.route.snapshot.paramMap.get('roomName') || '';
    this.currentPlayer = '';

    if (!this.roomName) {
      this.error = "Missing room name";
      this.loading = false;
      return;
    }

    this.setupSocketListeners();
    
    if (!this.socketService.isConnected()) {
      this.attemptReconnection();
    } else {
      this.joinRoom();
    }

    // Set initial players visibility based on screen size
    this.playersVisible = window.innerWidth > 768;
  }

  private setupSocketListeners() {
    // ... similar to description-duel socket setup ...
    // Clean up previous listeners
    this.socketService.off("playerList");
    this.socketService.off("roomInfo");
    this.socketService.off("targetCharacter");
    this.socketService.off("newGuess");
    this.socketService.off("playerTurn");
    this.socketService.off("gameOver");
    this.socketService.off("disconnect");
    this.socketService.off("connect");

    // Set up listeners
    this.setupConnectionListeners();
    this.setupGameListeners();
    this.setupPlayerListeners();
  }

  private setupConnectionListeners() {
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
  }

  private setupGameListeners() {
    this.socketService.on("roomInfo", (info: any) => {
      if (info && info.category && info.categoryId) {
        this.categoryName = info.category;
        this.categoryId = info.categoryId;
        this.categoryData = info;

        if (info.gameTypes && Array.isArray(info.gameTypes)) {
          // Map game types to their internal names
          const gameTypeMapping: { [key: string]: string } = {
            'klasszikus': 'classic',
            'leiras': 'description', 
            'emoji': 'emoji',
            'idezet': 'quote',
            'kep': 'picture'
          };
          
          // Sort game types in correct order
          const orderedTypes = ['klasszikus', 'leiras', 'emoji', 'idezet', 'kep'];
          this.gameSequence = orderedTypes
            .filter(type => info.gameTypes.includes(type))
            .map(type => gameTypeMapping[type]);
            
          this.currentGameIndex = this.gameSequence.indexOf('classic');
        }

        if (info.targetCharacter) {
          this.targetCharacter = info.targetCharacter;
          this.loading = false;
          this.loadCharactersIfNeeded();
        } else {
          this.loadCharactersIfNeeded();
        }
      }
    });

    // Handle game over events
    this.socketService.on("gameOver", (data: any) => {
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
  }

  private setupPlayerListeners() {
    // Handle player list updates
    this.socketService.on("playerList", (members: any) => {
      this.players = Array.from(new Map(members.map((item: any) => [item.name, item])).values());
      
      // Ha még nincs beállítva currentPlayer és van legalább egy játékos
      if ((!this.currentPlayer || this.currentPlayer === '') && this.players.length > 0) {
        // Az első játékos (szoba tulajdonos) kezd
        const firstPlayer = this.players.find(player => player.name === this.roomName);
        if (firstPlayer) {
          this.currentPlayer = firstPlayer.name;
          // Emit the turn to all players
          this.socketService.emit("playerTurn", {
            roomName: this.roomName,
            playerName: this.currentPlayer
          });
        }
      }
    });

    // Handle turn changes
    this.socketService.on("playerTurn", (playerName: string) => {
      this.currentPlayer = playerName;
    });

    // Handle new guesses
    this.socketService.on("newGuess", (data: any) => {
      if (!this.previousGuesses.some(g => 
          g.answer === data.guess.answer && g.player === data.player)) {
        this.previousGuesses.unshift(data.guess);
        this.characters = this.characters.filter(char => 
          char.answer.toLowerCase() !== data.guess.answer.toLowerCase()
        );
      }
    });
  }

  // Property comparison methods from classic-game
  isPropertyCorrect(key: string, character: any): boolean {
    return character[key] === this.targetCharacter[key];
  }

  showPropertyHint(key: string, character: any): boolean {
    return !this.isPropertyCorrect(key, character) && typeof character[key] === 'number';
  }

  getPropertyHint(key: string, character: any): string {
    if (character[key] > this.targetCharacter[key]) {
      return '▼';
    } else if (character[key] < this.targetCharacter[key]) {
      return '▲';
    }
    return '';
  }

  // A loadCharactersIfNeeded metódus javítása:
  private loadCharactersIfNeeded() {
    if (!this.characters || this.characters.length === 0) {
      this.api.getAllClassic(this.categoryId).subscribe({
        next: (response: any) => {
          let chars = Array.isArray(response) ? response : response.data;
          if (Array.isArray(chars)) {
            this.characters = chars;
            
            if (this.targetCharacter) {
              this.loading = false;
            } 
            else if (this.user?.name === this.roomName) {
              this.selectAndShareTargetCharacter();
            }
          } else {
            this.error = "Invalid character data received";
            this.loading = false;
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

  private attemptReconnection() {
    if (this.connectionRetryCount >= this.maxRetries) {
      this.error = "Failed to connect after multiple attempts. Please refresh the page.";
      this.loading = false;
      return;
    }

    this.socketReconnecting = true;
    this.connectionRetryCount++;
    
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
    }, 2000);
  }

  private joinRoom() {
    this.socketService.emit("joinRoom", {
      roomName: this.roomName,
      name: this.user.name
    }, (response: any) => {
      if (response && response.error) {
        this.error = `Failed to join room: ${response.error}`;
        this.loading = false;
      }
    });
    
    this.socketService.emit("getPlayers", { roomName: this.roomName });
    this.socketService.emit("getRoomInfo", { roomName: this.roomName });
    this.setRoomInfoTimeout();
  }

  private selectAndShareTargetCharacter() {
    if (!this.characters || this.characters.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * this.characters.length);
    this.targetCharacter = this.characters[randomIndex];
    
    this.socketService.emit("setTargetCharacter", {
      roomName: this.roomName,
      target: this.targetCharacter
    });
    
    this.loading = false;
  }

  filterCharacters(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCharacters = this.characters.filter(
      (character) => character.answer.toLowerCase().indexOf(query) >= 0
    );
    
    if (this.filteredCharacters.length === 1) {
      this.selectedCharacter = this.filteredCharacters[0];
    }
  }

  // Add helper method to extract the answer field from any item type
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

  // A submitCharacter metódus javítása:
  submitCharacter() {
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
      ...selectedCharacterObj,
      isCorrect: isCorrect,
      player: this.user.name
    };
    
    // Add to local guesses
    this.previousGuesses.unshift(guess);
    
    // Remove from available characters
    this.characters = this.characters.filter(char => 
      char.answer.toLowerCase() !== selectedCharacterObj.answer.toLowerCase()
    );
    
    // Emit guess to other players
    this.socketService.emit("submitGuess", {
      roomName: this.roomName,
      guess: guess,
      player: this.user.name
    });
    
    // Handle correct guess
    if (isCorrect) {
      const nextGameIndex = this.currentGameIndex + 1;
      const nextGame = nextGameIndex < this.gameSequence.length ? 
        this.gameSequence[nextGameIndex] : null;
      
      this.socketService.emit("gameCompleted", {
        roomName: this.roomName,
        winner: this.user.name,
        targetCharacter: this.targetCharacter, 
        currentGame: 'classic',
        nextGame: nextGame
      });
    }
    
    this.selectedCharacter = null;
  }

  reloadGame() {
    this.loading = true;
    this.error = '';
    
    if (!this.socketService.isConnected()) {
      this.attemptReconnection();
      return;
    }
    
    this.joinRoom();
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

  // Add this method to toggle the players box
  togglePlayersBox() {
    this.playersVisible = !this.playersVisible;
  }

  ngOnDestroy() {
    if (this.socketService.isConnected()) {
      this.socketService.emit("leaveRoom", {
        roomName: this.roomName,
        name: this.user.name
      });
    }
    
    if (this.roomInfoInterval) {
      clearInterval(this.roomInfoInterval);
      this.roomInfoInterval = null;
    }
    
    this.socketService.off("playerList");
    this.socketService.off("roomInfo");
    this.socketService.off("targetCharacter");
    this.socketService.off("newGuess");
    this.socketService.off("playerTurn");
    this.socketService.off("gameOver");
    this.socketService.off("disconnect");
    this.socketService.off("connect");
  }
}
