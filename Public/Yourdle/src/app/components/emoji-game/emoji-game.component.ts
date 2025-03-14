import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-emoji-game',
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './emoji-game.component.html',
  styleUrl: './emoji-game.component.scss'
})
export class EmojiGameComponent {
  constructor(private api: ApiService, private route: ActivatedRoute) {}

  categoryId: string = '';
  names: string[] = []; 
  filteredCharacters: string[] = []; 
  selectedCharacter: string = '';  
  targetCharacter: any = null;  // A gép által kiválasztott célkarakter
  previousGuesses: any[] = [];  // Korábbi tippek listája
  revealedEmojis: string[] = []; // Megjelenített emojik
  allEmojis: string[] = []; // Összes emoji a célkarakterhez


  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    // Karakterek betöltése
    this.api.getAllEmoji(this.categoryId).subscribe((data: any) => {
      if (data.data && Array.isArray(data.data)) {
        this.names = data.data.map((char: any) => char.answer); 
      }
    });

    // Véletlenszerű célkarakter betöltése
    this.api.getSolutionEmoji(this.categoryId).subscribe((data: any) => {
      if (data.success && data.data) {
        this.targetCharacter = data.data;

        // Az emojikat listába tesszük
        this.allEmojis = [
          data.data.firstEmoji,
          data.data.secondEmoji,
          data.data.thirdEmoji
        ].filter(emoji => emoji); // Üres értékeket kiszűrjük
        
        if (this.allEmojis.length > 0) {
          this.revealedEmojis.push(this.allEmojis[0]); // Csak az első emoji jelenjen meg először
        }
      }
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
      this.api.getAllEmoji(this.categoryId).subscribe((data: any) => {
        if (data.data && Array.isArray(data.data)) {
          this.selectedCharacter = this.filteredCharacters[0];
          const character = data.data.find((char: any) => char.answer === this.selectedCharacter);
          if (character) {
            if (this.selectedCharacter === this.targetCharacter.answer) {
              alert("Helyes válasz!");
            } else {
              if (this.revealedEmojis.length < this.allEmojis.length) {
                this.revealedEmojis.push(this.allEmojis[this.revealedEmojis.length]);
              }
            }
        
            this.previousGuesses.unshift(character.answer);
            this.selectedCharacter = '';
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
