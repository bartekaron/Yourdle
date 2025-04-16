import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { EmojiPickerComponent } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emoji-game',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './emoji-game.component.html',
  styleUrl: './emoji-game.component.scss'
})
export class EmojiGameComponent {
  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  categoryId: string = '';
  names: string[] = []; 
  filteredCharacters: string[] = []; 
  selectedCharacter: string = '';  
  targetCharacter: any = null;  // A gép által kiválasztott célkarakter
  previousGuesses: any[] = [];  // Korábbi tippek listája
  revealedEmojis: string[] = []; // Megjelenített emojik
  allEmojis: string[] = []; // Összes emoji a célkarakterhez
  categoryData: any = null; // Store category data to check available game types
  currentGame: string = 'emoji-game'; // Set the current game type

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    // Kategória név lekérése és elérhető játéktípusok meghatározása
    this.api.getCategoryByID(this.categoryId).subscribe((data: any) => {
      this.categoryData = data[0]; // Elérhető játéktípusok beállítása
    });

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

    // Ha csak egy találat van, automatikusan választjuk
    if (this.filteredCharacters.length === 1) {
      this.selectedCharacter = this.filteredCharacters[0];  // Automatikusan kiválasztja az egyetlen találatot
    }
  }

  // Karakter beküldése
    submitCharacter() {
      if (this.selectedCharacter || this.filteredCharacters.length === 1) {
        // Ha van kiválasztott karakter, vagy csak egy találat van
        const characterToSubmit = this.selectedCharacter || this.filteredCharacters[0];
        this.api.getAllEmoji(this.categoryId).subscribe((data: any) => {
          if (data.data && Array.isArray(data.data)) {
            this.selectedCharacter = this.filteredCharacters[0];
            const character = data.data.find((char: any) => char.answer === characterToSubmit);
            if (character && !this.previousGuesses.includes(character.answer)) {
              this.previousGuesses.unshift(character.answer);
              
              if (this.selectedCharacter === this.targetCharacter.answer) {
               
                this.revealedEmojis = [...this.allEmojis];
              } else if (this.revealedEmojis.length < this.allEmojis.length) {
                this.revealedEmojis.push(this.allEmojis[this.revealedEmojis.length]);
              }
    
              // Tippelt karakter eltávolítása az autocomplete listából
              this.names = this.names.filter(name => name !== character.answer);
              this.filteredCharacters = [...this.names];
    
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

  onEmojiSelect(event: any) {
    console.log('Selected emoji:', event.emoji);
  }

  navigateToGame(gameType: string) {
    this.router.navigate([`/${gameType}/${this.categoryId}/0`]);
  }

  onCharacterSelect(event: any) {
    this.selectedCharacter = event.value;
  }
}
