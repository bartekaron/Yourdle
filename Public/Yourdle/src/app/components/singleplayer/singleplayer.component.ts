import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-singleplayer',
  imports: [CommonModule,FormsModule,CardModule,ButtonModule,InputTextModule],
  templateUrl: './singleplayer.component.html',
  styleUrl: './singleplayer.component.scss'
})
export class SingleplayerComponent {
search: any;

}
