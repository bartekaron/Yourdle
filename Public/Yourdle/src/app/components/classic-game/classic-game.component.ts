import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-classic-game',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './classic-game.component.html',
  styleUrl: './classic-game.component.scss'
})
export class ClassicGameComponent implements OnInit {


  constructor(private api: ApiService, private route: ActivatedRoute) {}

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
    { key: 'address', label: 'Lakhely' },
    { key: 'birthDate', label: 'Születési dátum' }
  ];

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

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
  }

  // Karakter beküldése
  submitCharacter() {
    if (this.selectedCharacter) {
      this.api.getAllClassic(this.categoryId).subscribe((data: any) => {
        if (data.data && Array.isArray(data.data)) {
          const character = data.data.find((char: any) => char.answer === this.selectedCharacter);
          if (character) {
            this.previousGuesses.unshift(character);  // Új tipp hozzáadása a lista elejére
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
}