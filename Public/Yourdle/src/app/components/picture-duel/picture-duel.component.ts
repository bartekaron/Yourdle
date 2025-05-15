import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
  templateUrl: './picture-duel.component.html',  // IMPORTANT: Fixed the path
  styleUrl: './picture-duel.component.scss'      // IMPORTANT: Fixed the path
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
  
  // Add a property to store the shared image URL
  sharedImageUrl: string | null = null;

  // Add property to control visibility of players box
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
    // Set initial players visibility based on screen size
    this.playersVisible = window.innerWidth > 768;
    
    this.user = this.auth.loggedUser().data;
    this.roomName = this.route.snapshot.paramMap.get('roomName') || '';
    
    // Don't set current player to self initially - wait for server confirmation
    this.currentPlayer = ''; 

    if (!this.roomName) {
      this.error = "Missing room name";
      this.loading = false;
      return;
    }

    // Ensure we're starting fresh with no cached target character or image
    this.targetCharacter = null;
    this.revealedPicture = null;
    this.sharedImageUrl = null;
    
    // Reset game variables to ensure fresh state
    this.blurLevel = 20;
    this.previousGuesses = [];
    this.characters = [];
    this.filteredCharacters = [];
    
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
    this.socketService.off("updateRoomInfo");

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
          
          // Check if we have a shared image URL from the room owner
          if (info.sharedImageUrl) {
            this.sharedImageUrl = info.sharedImageUrl;
            this.revealedPicture = this.sharedImageUrl;
            this.loading = false;
          } else {
            // Fall back to loading the decrypted image
            this.loadDecryptedImage();
          }
          
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
      if (data && data.target) {
        this.targetCharacter = data.target;
        
        // Check if we have a shared image URL
        if (data.sharedImageUrl) {
          this.sharedImageUrl = data.sharedImageUrl;
          this.revealedPicture = this.sharedImageUrl;
          this.loading = false;
        } else {
          // Fall back to loading the decrypted image
          this.loadDecryptedImage();
        }
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
    
    // Add a timestamp parameter to force a new random selection
    const timestamp = Date.now();
    console.log(`Requesting random image for category ${this.categoryId} with timestamp ${timestamp}`);
    
    this.api.getSolutionPicture(this.categoryId).subscribe({
      next: (data: any) => {
        if (data && data.success && data.data) {
          console.log("Received random character from API:", data.data.answer);
          this.targetCharacter = data.data;
          
          // Set the revealed picture directly from the API response
          this.revealedPicture = data.data.picture;
          this.sharedImageUrl = data.data.picture;
          this.loading = false;
          
          // Share with other players
          this.shareImageUrlWithOtherPlayers();
        } else {
          console.error("Failed to get random character from API, falling back to local selection");
          this.performLocalRandomSelection();
        }
      },
      error: (err) => {
        console.error("Error getting random character:", err);
        this.performLocalRandomSelection();
      }
    });
  }
  
  private performLocalRandomSelection() {
    // Select a random character as the target from the pre-fetched list
    const randomIndex = Math.floor(Math.random() * this.characters.length);
    this.targetCharacter = this.characters[randomIndex];
    console.log("Selected local random target character:", this.targetCharacter.answer);
    
    // For the fallback, use the picture property directly
    if (this.targetCharacter.picture) {
      this.revealedPicture = this.targetCharacter.picture;
      this.sharedImageUrl = this.targetCharacter.picture;
      this.loading = false;
      
      // Share with other players
      this.shareImageUrlWithOtherPlayers();
    } else {
      // If no picture available, force direct image URL
      this.forceDirectImageUrl();
      this.loading = false;
      
      // Share with other players anyway
      this.shareImageUrlWithOtherPlayers();
    }
  }

  private loadDecryptedImage() {
    if (this.targetCharacter && this.categoryId) {
      // If we already have a shared image URL, use it instead of fetching again
      if (this.sharedImageUrl) {
        console.log("Using shared image URL:", this.sharedImageUrl);
        this.revealedPicture = this.sharedImageUrl;
        this.loading = false; // Make sure we're not in loading state
        return;
      }
      
      // Add a timestamp to force a new random selection
      const timestamp = Date.now();
      
      // Use the standard solution picture endpoint
      this.api.getSolutionPicture(this.categoryId).subscribe({
        next: (data: any) => this.handleImageResponse(data),
        error: (err) => {
          console.error("Error fetching decrypted image:", err);
          this.forceDirectImageUrl();
          this.loading = false;
        }
      });
    } else {
      console.warn("Cannot load decrypted image, missing target character or category ID");
      this.forceDirectImageUrl();
      this.loading = false;
    }
  }
  
  private loadDecryptedImageForCharacter(characterId: string) {
    if (!this.categoryId) {
      console.error("Cannot load image: missing category ID");
      this.forceDirectImageUrl();
      this.loading = false;
      return;
    }
    
    console.log("Attempting to load image for character with ID:", characterId);
    
    // Use the standard solution picture endpoint - it's randomized on the server side
    this.api.getSolutionPicture(this.categoryId).subscribe({
      next: (data: any) => this.handleImageResponse(data),
      error: (err) => {
        console.error("Error fetching image:", err);
        this.forceDirectImageUrl();
        this.loading = false;
      }
    });
  }
  
  private handleImageResponse(data: any) {
    console.log("Received image data:", data);
    
    if (data.success && data.data && data.data.picture) {
      const pictureUrl = data.data.picture;
      console.log("Setting picture URL from API:", pictureUrl);
      
      // Ensure the target character matches the received data
      if (data.data.answer && this.targetCharacter && 
          data.data.answer !== this.targetCharacter.answer) {
        console.warn("Image answer doesn't match target character!", {
          imageAnswer: data.data.answer,
          targetCharacter: this.targetCharacter.answer
        });
        // Update the target character to match the image
        this.targetCharacter = data.data;
      }
      
      this.revealedPicture = pictureUrl;
      this.sharedImageUrl = pictureUrl;
      this.loading = false;
      
      // IMPORTANT: Only the room owner should share the image with others
      if (this.user?.name === this.roomName) {
        // Share the image URL immediately to ensure players see the same image
        this.shareImageUrlWithOtherPlayers();
      }
    } else {
      console.error("Failed to get decrypted image:", data);
      this.forceDirectImageUrl();
      this.loading = false;
    }
  }
  
  private shareImageUrlWithOtherPlayers() {
    if (!this.sharedImageUrl) {
      console.error("Cannot share null image URL");
      return;
    }
    
    console.log("Emitting setTargetCharacter with shared image URL:", this.sharedImageUrl);
    console.log("Target character being shared:", this.targetCharacter);
    
    // Store the image URL in the room state first
    this.socketService.emit("updateRoomInfo", {
      roomName: this.roomName,
      sharedImageUrl: this.sharedImageUrl,
      targetCharacter: this.targetCharacter // Make sure we share the updated target character
    });
    
    // Then send the target character with shared image URL for current players
    this.socketService.emit("setTargetCharacter", {
      roomName: this.roomName,
      target: this.targetCharacter,
      sharedImageUrl: this.sharedImageUrl
    });
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
    // Filter characters by answer containing the query
    this.filteredCharacters = this.characters.filter(
      (character) => character.answer.toLowerCase().indexOf(query) >= 0
    );
    
    // Auto-select if only one match, just like in classic-duel
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
    if (typeof event === 'object' && event !== null) {
      // If it's an object with an answer field, use that directly
      this.selectedCharacter = this.extractAnswerFromItem(event);
    } else {
      // Otherwise just use the raw value
      this.selectedCharacter = event;
    }
    
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

  // Get display name for a game type
  getGameDisplayName(gameType: string): string {
    const displayNames: { [key: string]: string } = {
      'classic': 'Klasszikus',
      'description': 'Leírás',
      'emoji': 'Emoji',
      'quote': 'Idézet',
      'picture': 'Kép',
    };
    return displayNames[gameType] || gameType;
  }
  
  private decreaseBlurLevel(isCorrect: boolean): void {
    if (isCorrect) {
      // If correct, remove all blur
      this.blurLevel = 0;
    } else {
      // If incorrect, gradually decrease blur
      // Decrease blur a bit more to ensure progress is visible
      this.blurLevel = Math.max(0, this.blurLevel - 3);
    }
  }

  // Add method to toggle the players box
  togglePlayersBox() {
    this.playersVisible = !this.playersVisible;
  }
}
