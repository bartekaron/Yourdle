import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { io } from "socket.io-client";
import { AuthService } from '../../services/auth.service';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-duel',
  imports: [CommonModule, FormsModule, DialogModule, CardModule, ButtonModule, CheckboxModule, DropdownModule],
  templateUrl: './duel.component.html',
  styleUrl: './duel.component.scss'
})
export class DuelComponent implements OnInit {
  socket: any;
  rooms: any[] = [];
  categories = []; 
  filteredRooms: any[] = [];  // Szűrt szobák
  selectedCategory: string = '';
  user:any = {};
  searchTerm: string = '';  // Keresési kifejezés
  gameTypes = [
    { label: 'Klasszikus', value: 'klasszikus', checked: false },
    { label: 'Idézet', value: 'idezet', checked: false },
    { label: 'Emoji', value: 'emoji', checked: false },
    { label: 'Kép', value: 'kep', checked: false },
    { label: 'Leírás', value: 'leiras', checked: false }
  ];
  displayCreateRoomDialog: boolean = false;

  constructor(private auth:AuthService, private api:ApiService) {
    this.socket = io("http://localhost:3001");
  }

  ngOnInit() {
    this.socket.emit("getRooms");
    this.user = this.auth.loggedUser().data;
    this.api.select("categories", "allPublicCategories").subscribe((res:any)=>{
      if (res) {  
        this.categories = res.map((category:any) => ({
          label: category.categoryName,  
          value: category.categoryName   
        }))
      }
    });


    this.socket.on("roomList", (rooms: string[]) => {
      this.rooms = rooms;
      this.filterRooms();
    });
  }
  // Szűrési logika
  filterRooms() {
    if (this.searchTerm) {
      this.filteredRooms = this.rooms.filter(room =>
        room.category && room.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredRooms = this.rooms;  // Ha nincs keresési kifejezés, minden szoba látható
    }
  }

  createRoom() {
    if (this.selectedCategory) {
      const selectedGameTypes = this.gameTypes
          .filter(gt => gt.checked)
          .map(gt => gt.value);
  
      this.socket.emit("createRoom", {
          roomName: this.user.id,  
          category: this.selectedCategory,
          gameTypes: selectedGameTypes,
          owner: this.user.name
      });
  
      // Csatlakozás a létrehozott szobához
      this.socket.on("roomCreated", (roomName: string) => {
          this.socket.emit("joinRoom", { roomName });
          console.log(`Sikeresen csatlakoztál a ${roomName} szobához!`);
      });
  
      // Alapállapotba visszaállítás
      this.selectedCategory = '';
      this.gameTypes.forEach(gt => gt.checked = false);
      this.displayCreateRoomDialog = false;
    }
  }

  joinRoom(roomName: string) {
    this.socket.emit("joinRoom", { roomName });
  }

  leaveRoom(roomName: string) {
    this.socket.emit("leaveRoom", { roomName });
  }
}
