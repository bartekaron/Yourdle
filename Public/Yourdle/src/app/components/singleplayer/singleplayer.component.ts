import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-singleplayer',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule, RouterModule],
  templateUrl: './singleplayer.component.html',
  styleUrl: './singleplayer.component.scss'
})
export class SingleplayerComponent implements OnInit {
  search: string = '';
  categories: any[] = [];
  filteredCategories: any[] = [];
  usersMap: Map<string, string> = new Map(); // ID -> Név párosítások

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.api.getPublicCategories().subscribe((data: any[]) => {

      const modeOrder = ['Klasszikus', 'Idézet', 'Emoji', 'Kép', 'Leírás'];

      this.categories = data.map(category => {
        const gameModes = modeOrder.filter(mode => {
          return (mode === 'Klasszikus' && category.classic) ||
                 (mode === 'Idézet' && category.quote) ||
                 (mode === 'Emoji' && category.emoji) ||
                 (mode === 'Kép' && category.picture) ||
                 (mode === 'Leírás' && category.desc);
        });
      
        return { ...category, gameModes };
      });
      

      this.filteredCategories = [...this.categories];

      // Létrehozók neveinek betöltése
      this.loadUserNames();
    });
  }

  loadUserNames() {
    const uniqueUserIDs = new Set(this.categories.map(c => c.userID)); // Egyedi userID-k kinyerése

    uniqueUserIDs.forEach(userID => {
      if (!this.usersMap.has(userID)) { // Ha még nincs eltárolva az adott ID
        this.api.getUserById(userID).subscribe(response => {
          if (response.success && response.user) {
            this.usersMap.set(userID, response.user.username);
          } else {
            this.usersMap.set(userID, 'Ismeretlen');
          }
        }, error => {
          this.usersMap.set(userID, 'Ismeretlen');
        });
      }
    });
  }

  filterCategories() {
    const searchLower = this.search.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.categoryName.toLowerCase().includes(searchLower)
    );
  }

startGame(category: any) {
  if (category.gameModes.length > 0) {
    this.startMode(category, 0);
  } else {
    console.log('Nincs elérhető játékmód ebben a kategóriában.');
  }
}

startMode(category: any, modeIndex: number) {
  const mode = category.gameModes[modeIndex];

  if (!mode) {
    console.log('Nincs több játékmód.');
    return;
  }

  console.log(`Játék indítása: ${mode} (${category.categoryName})`);
  
  if (mode === 'Klasszikus') {
    this.router.navigate(['/classic-game', category.id, modeIndex]);
  } else if (mode === 'Idézet') {
    this.router.navigate(['/quote-game', category.id, modeIndex]);
  } else if (mode === 'Emoji') {
    this.router.navigate(['/emoji-game', category.id, modeIndex]);
  } else if (mode === 'Kép') {
    this.router.navigate(['/picture-game', category.id, modeIndex]);
  } else if (mode === 'Leírás') {
    this.router.navigate(['/description-game', category.id, modeIndex]);
  }
}

}
