import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import * as uuid from 'uuid';


@Component({
  selector: 'app-category-creator',
  imports: [DropdownModule, CheckboxModule, ButtonModule, FileUpload, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category-creator.component.html',
  styleUrl: './category-creator.component.scss'
})
export class CategoryCreatorComponent {
  gameTypes: any = [
    "Klasszikus",
    "Kép",
    "Leírás",
    "Idézet",
    "Emoji"
  ];
  classic: number = 0;
  quote: number = 0;
  emoji: number = 0;
  picture: number = 0;
  desc: number = 0;
  public:  number = 0;
  selectedCategories: string[] = [];
  categoryName: string = '';
  isPublic: boolean = false;
  formCounts: { [key: string]: number } = {};
  forms: { [key: string]: any[] } = {};


  constructor(private api: ApiService, private message: MessageService, private auth: AuthService){}

  onGameTypeChange(event: any) {
    const selectedType = event.value;
    if (!this.selectedCategories.includes(selectedType)) {
      this.selectedCategories.push(selectedType);
      this.formCounts[selectedType] = 1;
      this.generateForms(selectedType);
    } else {
      this.selectedCategories = this.selectedCategories.filter(category => category !== selectedType);
      delete this.formCounts[selectedType];
      delete this.forms[selectedType];
    }
  }

  /*setCategoryVariable(category: string, value: number) {
    switch (category) {
      case 'Klasszikus':
        this.classic = value;
        break;
      case 'Kép':
        this.picture = value;
        break;
      case 'Leírás':
        this.desc = value;
        break;
      case 'Idézet':
        this.quote = value;
        break;
      case 'Emoji':
        this.emoji = value;
        break;
    }
  }*/

  generateForms(category: string) {
    const count = this.formCounts[category];
    this.forms[category] = Array.from({ length: count }, () => ({
      answer: '',
      gender: '',
      height: '',
      weight: '',
      hairColor: '',
      address: '',
      birthDate: ''
    }));
  }

  createCategory() {
    this.public = this.isPublic ? 1 : 0;

    const categoryData = {
      id: uuid.v4(),
      categoryName: this.categoryName,
      userID: this.auth.loggedUser().data.id,
      classic: this.classic,
      quote: this.quote,
      emoji: this.emoji,
      picture: this.picture,
      desc: this.desc,
      public: this.public
    };

    
    this.api.createCategory(categoryData).subscribe(
      response => {
        this.message.add({severity: 'success', summary: 'Siker', detail: 'Kategória sikeresen létrehozva!'});
      },
      error => {
        this.message.add({severity: 'error', summary: 'Hiba', detail: 'Hiba történt a kategória létrehozása során.'});
      }
    );
  }

  

} 
