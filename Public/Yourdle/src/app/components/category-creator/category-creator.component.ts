import { Component, model } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import * as uuid from 'uuid';
import { EmojiPickerComponent, EmojiSelectedEvent } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';
import { TextBoxComponent } from '@chit-chat/ngx-emoji-picker/lib/components/text-box';
import {  ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-category-creator',
  standalone: true,
  imports: [DropdownModule, CheckboxModule, ButtonModule, CommonModule, FormsModule, ReactiveFormsModule, EmojiPickerComponent, TextBoxComponent, ToastModule],
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
  description: number = 0;
  public: number = 0;
  selectedCategories: string[] = [];
  categoryName: string = '';
  isPublic: boolean = false;
  formCounts: { [key: string]: number } = {};
  forms: { [key: string]: any[] } = {};

  constructor(private api: ApiService, private message: MessageService, private auth: AuthService) { }

  onGameTypeChange(event: any) {
    const selectedType = event.value;
    if (!this.selectedCategories.includes(selectedType)) {
      this.selectedCategories.push(selectedType);
      this.formCounts[selectedType] = 1;
      this.setCategoryVariable(selectedType, 1);
      this.generateForms(selectedType);
    } else {
      this.selectedCategories = this.selectedCategories.filter(category => category !== selectedType);
      delete this.formCounts[selectedType];
      delete this.forms[selectedType];
      this.setCategoryVariable(selectedType, 0);
    }
  }

  setCategoryVariable(category: string, value: number) {
    switch (category) {
      case 'Klasszikus':
        this.classic = value;
        break;
      case 'Kép':
        this.picture = value;
        break;
      case 'Leírás':
        this.description = value;
        break;
      case 'Idézet':
        this.quote = value;
        break;
      case 'Emoji':
        this.emoji = value;
        break;
    }
  }

  generateForms(category: string) {
    const count = this.formCounts[category];
    this.forms[category] = Array.from({ length: count }, () => ({
      answer: '',
      gender: '',
      height: '',
      weight: '',
      hairColor: '',
      address: '',
      age: '',
      picture: '',
      quote: '',
      firstEmoji: '',
      firstEmojiSelected: false,
      secondEmoji: '',
      secondEmojiSelected: false,
      thirdEmoji: '',
      thirdEmojiSelected: false,
      description: ''
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
      description: this.description,
      public: this.public
    };

    console.log(categoryData);
    this.api.createCategory(categoryData).subscribe(
      response => {
        this.message.add({ severity: 'success', summary: 'Siker', detail: 'Kategória sikeresen létrehozva!' });
        this.uploadForms(categoryData.id);
      },
      error => {
        this.message.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a kategória létrehozása során.' });
      }
    );
  }

  onImageSelected(event: any, form: any) {
    const file = event.target.files[0];
    form.pictureFile = file; // Store the file object
    const reader = new FileReader();
    reader.onload = (e: any) => {
      form.picture = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadForms(categoryID: string) {
    for (const category of this.selectedCategories) {
      const forms = this.forms[category];
      for (const form of forms) {
        const formData = { ...form, categoryID };
        switch (category) {
          case 'Klasszikus':
            if (formData.answer && formData.gender && formData.height && formData.weight && formData.hairColor && formData.address && formData.age) {
              this.api.createClassic(formData).subscribe(
                response => {
                  console.log('Klasszikus form successfully uploaded', response);
                },
                error => {
                  console.error('Error uploading Klasszikus form', error);
                }
              );
            } else {
              console.error('Hiányzó adatok a Klasszikus formában');
            }
            break;
          case 'Kép':
            if (formData.answer && formData.pictureFile) {
              console.log('Kép form data', formData);
              this.api.uploadCategoryPicture(formData.pictureFile, formData.answer, categoryID).subscribe(
                response => {
                  formData.picture = response.imageUrl; // Store the picture URL
                  this.api.createPicture(formData).subscribe(
                    res => {
                      console.log('Kép form successfully uploaded', res);
                    },
                    err => {
                      console.error('Error uploading Kép form', err);
                    }
                  );
                },
                error => {
                  console.error('Error uploading Kép form', error);
                }
              );
            } else {
              console.error('Hiányzó adatok a Kép formában');
            }
            break;
          case 'Leírás':
            if (formData.answer && formData.description) {
              this.api.createDescription(formData).subscribe(
                response => {
                  console.log('Leírás form successfully uploaded', response);
                },
                error => {
                  console.error('Error uploading Leírás form', error);
                }
              );
            } else {
              console.error('Hiányzó adatok a Leírás formában');
            }
            break;
          case 'Idézet':
            if (formData.answer && formData.quote) {
              this.api.createQuote(formData).subscribe(
                response => {
                  console.log('Idézet form successfully uploaded', response);
                },
                error => {
                  console.error('Error uploading Idézet form', error);
                }
              );
            } else {
              console.error('Hiányzó adatok az Idézet formában');
            }
            break;
          case 'Emoji':
            if (formData.answer && formData.firstEmoji && formData.secondEmoji && formData.thirdEmoji) {
              console.log('Emoji form data', formData);
              this.api.createEmoji(formData).subscribe(
                response => {
                  console.log('Emoji form successfully uploaded', response);
                },
                error => {
                  console.error('Error uploading Emoji form', error);
                }
              );
            } else {
              console.error('Hiányzó adatok az Emoji formában');
            }
            break;
        }
      }
    }
  }

  inputValue = model<string>('');

  handleEmojiSelected(evt: EmojiSelectedEvent, field: string, form: any) {
    form[field] = evt.emoji.value;
    form[`${field}Selected`] = true;
  }
}
