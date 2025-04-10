import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-description-game',
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './description-game.component.html',
  styleUrl: './description-game.component.scss'
})
export class DescriptionGameComponent implements OnInit{
  categoryId: string = '';
  categoryName: string = '';  // Kategória neve
  names: string[] = [];
  filteredCharacters: string[] = [];
  selectedCharacter: string = '';
  targetCharacter: any = null;
  previousGuesses: any[] = [];
  categoryData: any = null; // Store category data to check available game types
  currentGame: string = 'description-game'; // Set the current game type

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    // Kategória név lekérése és elérhető játéktípusok meghatározása
    this.api.getCategoryByID(this.categoryId).subscribe((data: any) => {
      this.categoryName = data[0].categoryName; // Kategória név beállítása
      this.categoryData = data[0]; // Elérhető játéktípusok beállítása
    });

    // Karakterek betöltése
    this.api.getAllDescription(this.categoryId).subscribe((data: any) => {
      if (data.data && Array.isArray(data.data)) {
        this.names = data.data.map((char: any) => char.answer);
      }
    });

    // Véletlenszerű célkarakter betöltése
    this.api.getSolutionDescription(this.categoryId).subscribe((data: any) => {
      this.targetCharacter = data.data;
    });
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
      this.api.getAllDescription(this.categoryId).subscribe((data: any) => {
        if (data.data && Array.isArray(data.data)) {
          const character = data.data.find((char: any) => char.answer === characterToSubmit);
          if (character) {
            this.previousGuesses.unshift(character);  // Új tipp hozzáadása a lista elejére
            this.names = this.names.filter(name => name !== character.answer);
            this.filteredCharacters = [...this.names];
            this.selectedCharacter = '';  // Mező törlése
          }
        }
      });
    }
  }
  
  

  isPropertyCorrect(key: string, character: any): boolean {
    return character[key] === this.targetCharacter[key];
  }

  // Tulajdonság nyilakkal való jelzése
  showPropertyHint(key: string, character: any): boolean {
    return !this.isPropertyCorrect(key, character) && typeof character[key] === 'number';
  }

  // Nyilak visszaadása
  getPropertyHint(key: string, character: any): string {
    if (character[key] > this.targetCharacter[key]) {
      return '▼';
    } else if (character[key] < this.targetCharacter[key]) {
      return '▲';
    }
    return '';
  }

  navigateToGame(gameType: string) {
    this.router.navigate([`/${gameType}/${this.categoryId}/0`]);
  }

  onCharacterSelect(event: any) {
    this.selectedCharacter = event.value;
  }
}