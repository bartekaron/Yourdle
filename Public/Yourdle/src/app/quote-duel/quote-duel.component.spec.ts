import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteDuelComponent } from './quote-duel.component';

describe('QuoteDuelComponent', () => {
  let component: QuoteDuelComponent;
  let fixture: ComponentFixture<QuoteDuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteDuelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteDuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
