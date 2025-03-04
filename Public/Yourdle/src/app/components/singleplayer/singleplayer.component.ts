import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-singleplayer',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule],
  templateUrl: './singleplayer.component.html',
  styleUrl: './singleplayer.component.scss'
})
export class SingleplayerComponent implements OnInit {
  search: string = '';
  categories: any[] = [];
  filteredCategories: any[] = [];
  usersMap: Map<string, string> = new Map(); // ID -> Név párosítások

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.api.getPublicCategories().subscribe((data: any[]) => {
      this.categories = data.map(category => ({
        ...category,
        gameModes: [
          category.classic ? 'Klasszikus' : null,
          category.quote ? 'Idézet' : null,
          category.emoji ? 'Emoji' : null,
          category.picture ? 'Kép' : null,
          category.desc ? 'Leírás' : null
        ].filter(Boolean) 
      }));

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
    console.log(`Játék indítása: ${category.categoryName}`);
  }
}
