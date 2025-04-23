import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../services/auth.service';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-duel',
  imports: [
    CommonModule, FormsModule, DialogModule, CardModule,
    ButtonModule, CheckboxModule, DropdownModule, ToastModule
  ],
  templateUrl: './duel.component.html',
  styleUrl: './duel.component.scss',
  providers: [MessageService]
})
export class DuelComponent implements OnInit {
  rooms: any[] = [];
  filteredRooms: any[] = [];
  categories = [];
  selectedCategory: string = '';
  availableGameTypes: any[] = [];
  user: any = {};
  searchTerm: string = '';
  displayCreateRoomDialog: boolean = false;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private router: Router,
    private messageService: MessageService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.user = this.auth.loggedUser().data;

    this.socketService.emit("getRooms");

    this.api.select("categories", "allPublicCategories").subscribe((res: any) => {
      if (res) {
        this.categories = res.map((category: any) => ({
          id: category.id,
          label: category.categoryName,
          value: category.categoryName,
          classic: category.classic,
          quote: category.quote,
          emoji: category.emoji,
          picture: category.picture,
          description: category.description
        }));
      }
    });

    this.socketService.on("roomList", (rooms: string[]) => {
      this.rooms = rooms;
      this.filterRooms();
    });
  }

  updateAvailableGameTypes() {
    const selected = this.categories.find((cat: any) => cat.value === this.selectedCategory);
    if (selected) {
      this.availableGameTypes = [
        { label: 'Klasszikus', value: 'klasszikus', checked: false, key: 'classic' },
        { label: 'Idézet', value: 'idezet', checked: false, key: 'quote' },
        { label: 'Emoji', value: 'emoji', checked: false, key: 'emoji' },
        { label: 'Kép', value: 'kep', checked: false, key: 'picture' },
        { label: 'Leírás', value: 'leiras', checked: false, key: 'description' }
      ].filter(gt => selected[gt.key] === 1);
    } else {
      this.availableGameTypes = [];
    }
  }

  filterRooms() {
    if (this.searchTerm) {
      this.filteredRooms = this.rooms.filter(room =>
        room.category?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredRooms = this.rooms;
    }
  }

  createRoom() {
    console.log("Categories:", this.categories);
    if (this.selectedCategory && this.availableGameTypes.some(gt => gt.checked)) {
      const selectedCategory:any = this.categories.find((cat: any) => cat.value === this.selectedCategory);
      
      if (!selectedCategory) {
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba',
          detail: 'A kiválasztott kategória nem található!',
          life: 2000
        });
        return;
      }

      const selectedGameTypes = this.availableGameTypes
        .filter(gt => gt.checked)
        .map(gt => gt.value);

      this.socketService.emit("createRoom", {
        roomName: this.user.name,
        category: this.selectedCategory,
        categoryId: selectedCategory.id,
        gameTypes: selectedGameTypes,
        owner: this.user.name
      });

      this.socketService.on("roomCreated", (data: any) => {
        if (data.redirect) {
          this.router.navigate([`/lobby/${data.roomName}`]);
        }
      });

      this.selectedCategory = '';
      this.availableGameTypes.forEach(gt => gt.checked = false);
      this.displayCreateRoomDialog = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Hiba',
        detail: 'Kérlek válassz kategóriát és legalább egy játék típust!',
        life: 2000
      });
    }
  }

  joinRoom(roomName: string) {
    this.socketService.emit("joinRoom", {
      roomName,
      name: this.user.name
    });
    this.router.navigate([`/lobby/${roomName}`]);
  }
}
