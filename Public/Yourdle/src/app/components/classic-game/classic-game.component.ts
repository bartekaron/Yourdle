import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-classic-game',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './classic-game.component.html',
  styleUrl: './classic-game.component.scss'
})
export class ClassicGameComponent implements OnInit {

  currentGame: string = 'classic-game'; // Set the current game type

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  categoryId: string = '';
  names: string[] = []; 
  filteredCharacters: string[] = []; 
  selectedCharacter: string = '';  
  targetCharacter: any = null;  // A gép által kiválasztott célkarakter
  previousGuesses: any[] = [];  // Korábbi tippek listája
  characterProperties: { key: string, label: string }[] = [
    { key: 'answer', label: 'Név' },
    { key: 'gender', label: 'Nem' },
    { key: 'height', label: 'Magasság' },
    { key: 'weight', label: 'Súly' },
    { key: 'hairColor', label: 'Hajszín' },
    { key: 'address', label: 'Származás' },
    { key: 'age', label: 'Életkor' }
  ];
  categoryData: any = null; // Store category data to check available game types

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    // Kategória név lekérése és elérhető játéktípusok meghatározása
    this.api.getCategoryByID(this.categoryId).subscribe((data: any) => {
      this.categoryData = data[0]; // Elérhető játéktípusok beállítása
    });

    // Karakterek betöltése
    this.api.getAllClassic(this.categoryId).subscribe((data: any) => {
      if (data.data && Array.isArray(data.data)) {
        this.names = data.data.map((char: any) => char.answer); 
      }
    });

    // Véletlenszerű célkarakter betöltése
    this.api.getSolutionClassic(this.categoryId).subscribe((data: any) => {
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
  

  // Karakter beküldése
  submitCharacter() {
    if (this.selectedCharacter || this.filteredCharacters.length === 1) {
      // Ha van kiválasztott karakter, vagy csak egy találat van
      const characterToSubmit = this.selectedCharacter || this.filteredCharacters[0]; // Az első találat automatikusan beküldésre kerül
      this.api.getAllClassic(this.categoryId).subscribe((data: any) => {
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
  

  // Tulajdonság helyességének ellenőrzése
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

