import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteGameComponent } from './quote-game.component';

describe('QuoteGameComponent', () => {
  let component: QuoteGameComponent;
  let fixture: ComponentFixture<QuoteGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
