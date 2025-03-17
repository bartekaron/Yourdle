import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    // Kategória név lekérése
    this.api.getCategoryByID(this.categoryId).subscribe((data: any) => {
      this.categoryName = data[0].categoryName; // Kategória név beállítása
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
  }

  submitCharacter() {
    if (this.selectedCharacter) {
      this.api.getAllDescription(this.categoryId).subscribe((data: any) => {
        if (data.data && Array.isArray(data.data)) {
          this.selectedCharacter = this.filteredCharacters[0];
          const character = data.data.find((char: any) => char.answer === this.selectedCharacter);
  
          if (character && !this.previousGuesses.some(guess => guess.answer === character.answer)) {
            this.previousGuesses.unshift(character); // Új tipp hozzáadása
  
            // Ellenőrzés a célkarakterrel
            if (this.selectedCharacter === this.targetCharacter.answer) {
              alert("Helyes válasz!");
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
}