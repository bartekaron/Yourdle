import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../services/api.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule, ConfirmPopup } from 'primeng/confirmpopup';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    TableModule, TagModule, ButtonModule, CommonModule, ToolbarModule, 
    ToastModule, FormsModule, FloatLabelModule, ConfirmPopupModule, DialogModule
  ],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class AdminCategoriesComponent {
  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  categories: any[] = [];
  selectedCategoryId: string = '';
  selectedCategoryData: any[] = [];
  displayCategoryDialog: boolean = false;
  groupedCategoryData: Map<string, any[]> = new Map();

  constructor(
    private api: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.api.getAllCategory().subscribe((res: any) => {
      this.categories = res.data;
    });
  }

  confirmDelete(event: Event, categoryId: string) {
    this.selectedCategoryId = categoryId;
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Biztosan törlöd ezt a kategóriát?',
      acceptLabel: 'Törlés',
      rejectLabel: 'Mégse',
      accept: () => {
        this.deleteCategory();
      }
    });
  }

  deleteCategory() {
    this.api.deleteCategory(this.selectedCategoryId).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Siker', detail: 'A kategória törölve.' });
      this.getCategories();
    });
  }



openCategoryDetails(categoryId: string) {
  this.api.getCategoryData(categoryId).subscribe((res: any) => {
    this.selectedCategoryData = res.data;

    // Adatok csoportosítása típus szerint
    this.groupedCategoryData = new Map();

    this.selectedCategoryData.forEach((data: any) => {
      let key = this.getCategoryType(data);

      if (!this.groupedCategoryData.has(key)) {
        this.groupedCategoryData.set(key, []);
      }
      this.groupedCategoryData.get(key)!.push(data);
    });

    this.displayCategoryDialog = true;
  });
}

// Segédfüggvény a kategória típus meghatározásához
getCategoryType(data: any): string {
  if (data.gender) return 'Klasszikus';
  if (data.quote) return 'Idézet';
  if (data.desc) return 'Leírás';
  if (data.picture) return 'Kép';
  if (data.firstEmoji) return 'Emoji';
  return 'Egyéb';
}

}
