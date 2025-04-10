import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-quote-game',
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './quote-game.component.html',
  styleUrl: './quote-game.component.scss'
})
export class QuoteGameComponent implements OnInit {
  categoryId: string = '';
  categoryName: string = '';  // Kategória neve
  names: string[] = [];
  filteredCharacters: string[] = [];
  selectedCharacter: string = '';
  targetCharacter: any = null;
  previousGuesses: any[] = [];
  categoryData: any = null; // Store category data to check available game types
  currentGame: string = 'quote-game'; // Set the current game type

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    // Kategória név lekérése és elérhető játéktípusok meghatározása
    this.api.getCategoryByID(this.categoryId).subscribe((data: any) => {
      this.categoryName = data[0].categoryName; // Kategória név beállítása
      this.categoryData = data[0]; // Elérhető játéktípusok beállítása
    });

    // Karakterek betöltése
    this.api.getAllQuote(this.categoryId).subscribe((data: any) => {
      if (data.data && Array.isArray(data.data)) {
        this.names = data.data.map((char: any) => char.answer);
      }
    });

    // Véletlenszerű célkarakter betöltése
    this.api.getSolutionQuote(this.categoryId).subscribe(
      (data: any) => {
        this.targetCharacter = data.data;
      },
      (error) => {
        console.error('Error fetching solution quote:', error);
      }
    );
  }

  // Autocomplete szűrés
  filterCharacters(event: any) {
    let query = event.query.toLowerCase();
    this.filteredCharacters = this.names.filter(name =>
      name.toLowerCase().includes(query)
    );

    // Ha csak egy találat van, automatikusan választjuk
    if (this.filteredCharacters.length === 1) {
      this.selectedCharacter = this.filteredCharacters[0];  // Automatikusan kiválasztja az egyetlen találatot
    }
  }

  submitCharacter() {
    if (this.selectedCharacter || this.filteredCharacters.length === 1) {
      // Ha van kiválasztott karakter, vagy csak egy találat van
      const characterToSubmit = this.selectedCharacter || this.filteredCharacters[0];
      this.api.getAllQuote(this.categoryId).subscribe((data: any) => {
        if (data.data && Array.isArray(data.data)) {
          this.selectedCharacter = this.filteredCharacters[0];
          const character = data.data.find((char: any) => char.answer === characterToSubmit);

          if (character && !this.previousGuesses.some(guess => guess.answer === character.answer)) {
            this.previousGuesses.unshift(character); // Új tipp hozzáadása

            // Ellenőrzés a célkarakterrel
            if (this.selectedCharacter === this.targetCharacter.answer) {
            }

            // Tippelt karakter eltávolítása az autocomplete listából
            this.names = this.names.filter(name => name !== character.answer);
            this.filteredCharacters = [...this.names];

            this.selectedCharacter = ''; // Visszaállítjuk a kiválasztott karakter mezőt
          }
        }
      });
    }
  }

  navigateToGame(gameType: string) {
    this.router.navigate([`/${gameType}/${this.categoryId}/0`]);
  }

  onCharacterSelect(event: any) {
    this.selectedCharacter = event.value;
  }
}
