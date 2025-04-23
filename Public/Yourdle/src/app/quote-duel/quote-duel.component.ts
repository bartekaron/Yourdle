import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SocketService } from '../services/socket.service';
import { AuthService } from '../services/auth.service';
import { console } from 'inspector';

@Component({
  selector: 'app-quote-duel',
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './quote-duel.component.html',
  styleUrls: ['./quote-duel.component.scss']
})
export class QuoteDuelComponent implements OnInit {
  categoryId: string = '';
  categoryName: string = '';
  names: string[] = [];
  filteredCharacters: string[] = [];
  selectedCharacter: string = '';
  targetCharacter: any = null;
  previousGuesses: any[] = [];
  categoryData: any = null;
  players: any[] = [];
  currentPlayer: string = '';

  constructor(
    private api: ApiService, 
    private route: ActivatedRoute, 
    private router: Router,
    private socketService: SocketService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // Get the category ID from the URL
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';
    
    if (!this.categoryId) {
      console.error('No category ID provided');
      return;
    }

    // First get the category data to get the name
    this.api.getCategoryByID(this.categoryId).subscribe({
      next: (data: any) => {
        if (data && data.categoryName) {
          this.categoryName = data.categoryName;
          this.categoryData = data;
          this.loadGameData();
        } else {
          console.error('Invalid category data:', data);
        }
      },
      error: (error) => {
        console.error('Error loading category:', error);
      }
    });

    // Get current user
    const user = this.auth.loggedUser().data;
    this.currentPlayer = user.name;

    // Listen for player list updates
    this.socketService.on("playerList", (members: any) => {
      this.players = Array.from(new Map(members.map((item: any) => [item.name, item])).values());
    });

    console.log("Current player:", this.currentPlayer); 

    // Listen for turn changes
    this.socketService.on("playerTurn", (playerName: string) => {
      this.currentPlayer = playerName;
    });
  }

  loadGameData() {
    // Load characters
    this.api.getAllQuote(this.categoryId).subscribe({
      next: (data: any) => {
        if (data && data.characters) {
          this.names = data.characters;
        } else {
          console.error('Invalid data format:', data);
        }
      },
      error: (error) => {
        console.error('Error loading characters:', error);
      }
    });

    // Load solution quote
    this.api.getSolutionQuote(this.categoryId).subscribe({
      next: (data: any) => {
        if (data) {
          this.targetCharacter = data;
        } else {
          console.error('Invalid solution data:', data);
        }
      },
      error: (error) => {
        console.error('Error fetching solution quote:', error);
      }
    });
  }

  submitCharacter() {
    if (this.selectedCharacter || this.filteredCharacters.length === 1) {
      const characterToSubmit = this.selectedCharacter || this.filteredCharacters[0];
      this.api.getAllQuote(this.categoryId).subscribe({
        next: (data: any) => {
          if (data && data.characters) {
            const character = { answer: characterToSubmit };

            if (!this.previousGuesses.some(guess => guess.answer === character.answer)) {
              this.previousGuesses.unshift(character);

              // Remove the guessed character from suggestions
              this.names = this.names.filter(name => name !== character.answer);
              this.filteredCharacters = [...this.names];
              this.selectedCharacter = '';
            }
          }
        },
        error: (error) => {
          console.error('Error submitting character:', error);
        }
      });
    }
  }

  navigateToGame(gameType: string) {
    this.router.navigate([`/${gameType}/${this.categoryId}/0`]);
  }

  filterCharacters(event: any) {
    let query = event.query.toLowerCase();
    this.filteredCharacters = this.names.filter(name =>
      name.toLowerCase().includes(query)
    );
  }

  onCharacterSelect(event: any) {
    this.selectedCharacter = event.value;
  }
}