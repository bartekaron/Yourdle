import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DropdownModule } from 'primeng/dropdown';
import {PanelModule} from 'primeng/panel';

@Component({
  selector: 'app-classic-game',
  imports: [CommonModule, FormsModule, DropdownModule,PanelModule ],
  templateUrl: './classic-game.component.html',
  styleUrl: './classic-game.component.scss'
})
export class ClassicGameComponent {

  constructor(private api: ApiService) {}
  
  names = [
    { label: 'John Doe', value: 'John Doe' },
    { label: 'Jane Smith', value: 'Jane Smith' },
    { label: 'Alice Brown', value: 'Alice Brown' }
  ];
  
  selectedName: string | null = null;
  
  onSelectName() {
    console.log('Kiválasztott név:', this.selectedName);
  }

  properties = [
    { name: 'Nem', value: 'Férfi', hint: '' },
    { name: 'Magasság', value: '180 cm', hint: 'higher' },
    { name: 'Súly', value: '75 kg', hint: 'lower' },
    { name: 'Hajszín', value: 'Barna', hint: '' },
    { name: 'Lakhely', value: 'Budapest', hint: '' },
    { name: 'Születési év', value: '1995', hint: 'higher' }
  ];
  
  
}
