import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Router } from '@angular/router';

@Component({
  selector: 'app-picture-game',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './picture-game.component.html',
  styleUrl: './picture-game.component.scss'
})
export class PictureGameComponent {
  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  categoryId: string = '';
  names: string[] = []; 
  filteredCharacters: string[] = []; 
  selectedCharacter: string = '';  
  targetCharacter: any = null;  // A gép által kiválasztott célkarakter
  previousGuesses: any[] = [];  // Korábbi tippek listája
  revealedPicture: string | null = null; // Megjelenített kép
  blurLevel: number = 20; // Initial blur level
  categoryData: any = null; // Store category data to check available game types
  currentGame: string = 'picture-game'; // Set the current game type

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    // Kategória név lekérése és elérhető játéktípusok meghatározása
    this.api.getCategoryByID(this.categoryId).subscribe((data: any) => {
      this.categoryData = data[0]; // Elérhető játéktípusok beállítása
    });

    // Karakterek betöltése
    this.api.getAllPicture(this.categoryId).subscribe((data: any) => {
      if (data.data && Array.isArray(data.data)) {
        this.names = data.data.map((char: any) => char.answer); 
      }
    });

    // Véletlenszerű célkarakter betöltése
    this.api.getSolutionPicture(this.categoryId).subscribe((data: any) => {
      if (data.success && data.data) {
        this.targetCharacter = data.data;
        this.revealedPicture = data.data.picture; // Ensure this is correctly set
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
      const character = this.names.find(name => name === this.selectedCharacter);
      if (character && !this.previousGuesses.includes(character)) {
        this.previousGuesses.unshift(character);
        
        if (this.selectedCharacter === this.targetCharacter.answer) {
          this.blurLevel = 0; // Remove blur effect
        } else {
          // Decrease blur level with each incorrect guess
          this.blurLevel = Math.max(0, this.blurLevel - 5);
        }

        // Tippelt karakter eltávolítása az autocomplete listából
        this.names = this.names.filter(name => name !== character);
        this.filteredCharacters = [...this.names];

        this.selectedCharacter = '';
      }
    }
  }

  navigateToGame(gameType: string) {
    this.router.navigate([`/${gameType}/${this.categoryId}/0`]);
  }
}
