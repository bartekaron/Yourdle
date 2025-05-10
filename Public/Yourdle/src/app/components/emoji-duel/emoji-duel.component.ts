import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';


@Component({
  selector: 'app-emoji-duel',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './emoji-duel.component.html',
  styleUrl: './emoji-duel.component.scss'
})
export class EmojiDuelComponent implements OnInit, OnDestroy {
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
  revealedEmojis: string[] = [];
  allEmojis: string[] = [];
  
  loading: boolean = true;
  error: string = '';
  private roomInfoInterval: any;
  private connectionRetryCount: number = 0;
  private maxRetries: number = 5;
  private socketReconnecting: boolean = false;
  
  // Game sequence properties
  gameSequence: string[] = [];
  currentGameIndex: number = 0;
  currentGame: string = 'emoji';

  // Add missing properties
  names: string[] = [];

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

  private setupSocketListeners() {
    // Clean up previous listeners
    this.socketService.off("playerList");
    this.socketService.off("roomInfo");
    this.socketService.off("targetCharacter");
    this.socketService.off("newGuess");
    this.socketService.off("playerTurn");
    this.socketService.off("gameOver");
    this.socketService.off("gameSequence");
    
    // Listen for player list updates
    this.socketService.on("playerList", (members: any) => {
      console.log("Received player list:", members);
      const uniqueMembers = Array.from(new Map(members.map((item: any) => [item.name, item])).values());
      this.players = uniqueMembers;

      // Ha csak egy játékos van, ő lesz az aktuális játékos
      if (this.players.length === 1) {
        this.currentPlayer = this.players[0].name;
      } 

      // Ha a szoba tulajdonosa vagyunk és több játékos van, de nincs aktuális játékos
      if (this.user.name === this.roomName && this.players.length > 1 && !this.currentPlayer) {
        setTimeout(() => {
          this.socketService.emit("playerTurn", {
            roomName: this.roomName,
            playerName: this.players[0].name
          });
        }, 1000);
      }
    });

    this.socketService.on("roomInfo", (info: any) => {
      console.log("Received room info:", info);
      
      if (info.error) {
        console.error("Room info error:", info.error);
        return;
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
            
          this.currentGameIndex = this.gameSequence.indexOf('emoji');
        }

        if (info.targetCharacter) {
          console.log("Using target character from room info");
          this.targetCharacter = info.targetCharacter;
          this.setupEmojis();
          this.loading = false;
          this.loadCharacters();
        } else {
          this.loadCharacters();
        }
      }
    });

    this.socketService.on("targetCharacter", (data: any) => {
      if (data && data.target) {
        this.targetCharacter = data.target;
        this.setupEmojis();
        this.loading = false;
      }
    });

    this.socketService.on("newGuess", (data: any) => {
      console.log("Received new guess:", data);
      
      // Ellenőrizzük, hogy ez a tipp még nem szerepel-e
      const isDuplicateGuess = this.previousGuesses.some(g => 
        g.answer === data.guess.answer && g.player === data.guess.player
      );

      if (!isDuplicateGuess) {
        this.previousGuesses.unshift(data.guess);
        
        if (data.guess.isCorrect) {
          this.revealedEmojis = [...this.allEmojis];
          
          // Ha nem a játékos találta ki, akkor is kapjon értesítést
          if (data.guess.player !== this.user.name) {
            console.log(`${data.guess.player} kitalálta a karaktert!`);
            // Várjunk egy kicsit a következő játékra váltás előtt
            setTimeout(() => {
              const nextGameIndex = this.currentGameIndex + 1;
              const nextGame = this.gameSequence[nextGameIndex];
              if (nextGame) {
                this.router.navigate([`/${nextGame}-duel`, this.roomName]);
              } else {
                this.router.navigate(['/summary-duel', this.roomName]);
              }
            }, 2000);
          }
        } else if (this.revealedEmojis.length < this.allEmojis.length) {
          this.revealedEmojis.push(this.allEmojis[this.revealedEmojis.length]);
        }
      }
    });

    this.socketService.on("playerTurn", (playerName: string) => {
      console.log("Turn changed to:", playerName);
      this.currentPlayer = playerName;
      
      // Ha ez a játékos következik, jelezzük
      if (playerName === this.user.name) {
        console.log("It's your turn!");
      }
    });
  }

  private setupEmojis() {
    if (this.targetCharacter) {
      console.log('Setting up emojis for target:', this.targetCharacter);
      
      const emojis = [
        this.targetCharacter.firstEmoji,
        this.targetCharacter.secondEmoji,
        this.targetCharacter.thirdEmoji
      ].filter(emoji => emoji && emoji.trim() !== '');
      
      if (emojis.length > 0) {
        this.allEmojis = emojis;
        this.revealedEmojis = [emojis[0]];
        console.log('Emojis setup complete:', {
          all: this.allEmojis,
          revealed: this.revealedEmojis
        });
      }
    }
  }

  private loadCharacters() {
    if (!this.characters || this.characters.length === 0) {
      console.log("Fetching characters for category:", this.categoryId);
      this.api.getAllEmoji(this.categoryId).subscribe({
        next: (response: any) => {
          console.log("Fetched characters:", response);
          if (response?.data && Array.isArray(response.data)) {
            this.characters = response.data;
            
            if (this.targetCharacter) {
              this.loading = false;
            } 
            else if (this.user?.name === this.roomName) {
              this.selectAndShareTargetCharacter();
            }
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

  private joinRoom() {
    this.socketService.emit("joinRoom", {
      roomName: this.roomName,
      name: this.user.name
    });
    
    this.socketService.emit("getPlayers", { roomName: this.roomName });
    this.socketService.emit("getRoomInfo", { roomName: this.roomName });
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
        this.attemptReconnection();
      }
    }, 2000);
  }

  private selectAndShareTargetCharacter() {
    if (this.characters.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.characters.length);
      const selectedTarget = this.characters[randomIndex];
      
      this.socketService.emit("setTargetCharacter", {
        roomName: this.roomName,
        target: selectedTarget
      });
    }
  }

  filterCharacters(event: any) {
    let query = event.query.toLowerCase();
    this.filteredCharacters = this.characters.filter(
      (character) => character.answer.toLowerCase().indexOf(query) >= 0
    );
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
    if (this.currentPlayer !== this.user.name) {
      console.log("Not your turn!");
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
    const characterToSubmit = this.characters.find(
      char => char.answer.toLowerCase() === selectedValue
    );
    
    if (!characterToSubmit) {
      console.warn('No matching character found for:', this.selectedCharacter);
      return;
    }
    
    const isCorrect = characterToSubmit.answer === this.targetCharacter.answer;
    
    const guess = {
      answer: characterToSubmit.answer,
      isCorrect: isCorrect,
      player: this.user.name
    };
    
    // Remove guessed character from available options
    this.characters = this.characters.filter(char => 
      char.answer.toLowerCase() !== characterToSubmit.answer.toLowerCase()
    );
    
    // Find next player's turn
    const currentPlayerIndex = this.players.findIndex(p => p.name === this.currentPlayer);
    const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
    const nextPlayer = this.players[nextPlayerIndex].name;

    // Emit the guess to all players
    this.socketService.emit("submitGuess", {
      roomName: this.roomName,
      guess: guess,
      player: this.user.name
    });

    // Change turn to next player
    this.socketService.emit("playerTurn", {
      roomName: this.roomName,
      playerName: nextPlayer
    });

    if (isCorrect) {
      const nextGameIndex = this.currentGameIndex + 1;
      const nextGame = nextGameIndex < this.gameSequence.length ? this.gameSequence[nextGameIndex] : null;
      
      this.socketService.emit("gameCompleted", {
        roomName: this.roomName,
        winner: this.user.name,
        targetCharacter: this.targetCharacter,
        currentGame: 'emoji',
        nextGame: nextGame
      });

      // Wait a bit before navigating to the next game
      setTimeout(() => {
        if (nextGame) {
          this.router.navigate([`/${nextGame}-duel`, this.roomName]);
        } else {
          this.router.navigate(['/summary-duel', this.roomName]);
        }
      }, 2000);
    }

    this.selectedCharacter = '';
  }

  ngOnDestroy() {
    this.socketService.off("playerList");
    this.socketService.off("roomInfo");
    this.socketService.off("targetCharacter");
    this.socketService.off("newGuess");
    this.socketService.off("playerTurn");
  }

  // Add this method
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
