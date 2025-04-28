import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-quote-duel',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './quote-duel.component.html',
  styleUrl: './quote-duel.component.scss'
})
export class QuoteDuelComponent implements OnInit, OnDestroy {
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
  currentGame: string = 'quote';

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
        console.log("Reconnection successful");
        this.socketReconnecting = false;
        this.joinRoom();
      } else {
        console.log("Still disconnected, retrying...");
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
        console.error("Error joining room:", response.error);
        this.error = `Failed to join room: ${response.error}`;
        this.loading = false;
      }
    });
    
    this.socketService.emit("getPlayers", { roomName: this.roomName });
    this.socketService.emit("getRoomInfo", { roomName: this.roomName });
    this.setRoomInfoTimeout();
  }

  private setupSocketListeners() {
    // Clean up previous listeners
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

      if (this.players.length === 1) {
        this.currentPlayer = this.players[0].name;
      }

      if (this.user.name === this.roomName && this.players.length > 1 && !this.currentPlayer) {
        setTimeout(() => {
          this.socketService.emit("playerTurn", {
            roomName: this.roomName,
            playerName: this.players[0].name
          });
        }, 1000);
      }
    });

    this.socketService.on("playerTurn", (playerName: string) => {
      console.log("Turn changed to:", playerName);
      this.currentPlayer = playerName;
    });

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

        if (info.gameTypes && Array.isArray(info.gameTypes)) {
          const gameTypeMapping: { [key: string]: string } = {
            'klasszikus': 'classic',
            'leiras': 'description',
            'emoji': 'emoji',
            'idezet': 'quote',
            'kep': 'picture'
          };
          
          const orderedTypes = ['klasszikus', 'leiras', 'emoji', 'idezet', 'kep'];
          
          this.gameSequence = orderedTypes
            .filter(type => info.gameTypes.includes(type))
            .map(type => gameTypeMapping[type]);
            
          this.currentGameIndex = this.gameSequence.indexOf('quote');
        }

        if (info.targetCharacter) {
          console.log("Using target character from room info");
          this.targetCharacter = info.targetCharacter;
          this.loading = false;
          this.loadCharactersIfNeeded();
        } else {
          this.loadCharactersIfNeeded();
        }
      }
    });

    this.socketService.on("targetCharacter", (data: any) => {
      console.log("Received target character update:", data);
      if (data && data.target) {
        this.targetCharacter = data.target;
        this.loading = false;
      }
    });

    this.socketService.on("newGuess", (data: any) => {
      console.log("Received guess from other player:", data);
      
      if (!this.previousGuesses.some(g => 
          g.answer === data.guess.answer && g.player === data.player)) {
        
        this.previousGuesses.unshift(data.guess);
        
        this.characters = this.characters.filter(char => 
          char.answer.toLowerCase() !== data.guess.answer.toLowerCase()
        );
      }
    });

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
    
    this.socketService.on("gameSequence", (data: any) => {
      if (data && data.sequence) {
        this.gameSequence = data.sequence;
        this.currentGameIndex = data.currentIndex || 0;
      }
    });
  }

  private loadCharactersIfNeeded() {
    if (!this.characters || this.characters.length === 0) {
      console.log("Fetching characters for category:", this.categoryId);
      this.api.getAllQuote(this.categoryId).subscribe({
        next: (response: any) => {
          console.log("Fetched characters:", response);
          const chars = Array.isArray(response) ? response : response.data;
          if (!chars || !chars.length) {
            this.error = "No characters available for this category";
            this.loading = false;
            return;
          }
          this.characters = chars;
          
          if (this.targetCharacter) {
            this.loading = false;
          } 
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
    
    const randomIndex = Math.floor(Math.random() * this.characters.length);
    this.targetCharacter = this.characters[randomIndex];
    
    console.log("Setting target character:", this.targetCharacter);
    
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

  filterCharacters(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCharacters = this.characters.filter(
      (character) => character.answer.toLowerCase().indexOf(query) >= 0
    );
    
    if (this.filteredCharacters.length === 1) {
      this.selectedCharacter = this.filteredCharacters[0];
    }
  }

  submitCharacter() {
    if (this.currentPlayer !== this.user.name) {
      return;
    }
    
    if (!this.selectedCharacter && this.filteredCharacters.length === 1) {
      this.selectedCharacter = this.filteredCharacters[0];
    }
    
    if (!this.selectedCharacter) return;
    
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
    
    this.characters = this.characters.filter(char => 
      char.answer.toLowerCase() !== selectedCharacterObj.answer.toLowerCase()
    );
    
    this.socketService.emit("submitGuess", {
      roomName: this.roomName,
      guess: guess,
      player: this.user.name
    });
    
    if (isCorrect) {
      const nextGameIndex = this.currentGameIndex + 1;
      const nextGame = nextGameIndex < this.gameSequence.length ? this.gameSequence[nextGameIndex] : null;
      
      this.socketService.emit("gameCompleted", {
        roomName: this.roomName,
        winner: this.user.name,
        targetCharacter: this.targetCharacter,
        currentGame: 'quote',
        nextGame: nextGame
      });
    }
    
    this.selectedCharacter = null;
  }

  onCharacterSelect(event: any) {
    this.selectedCharacter = event;
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