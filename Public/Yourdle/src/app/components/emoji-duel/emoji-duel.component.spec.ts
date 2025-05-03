import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiDuelComponent } from './emoji-duel.component';

describe('EmojiDuelComponent', () => {
  let component: EmojiDuelComponent;
  let fixture: ComponentFixture<EmojiDuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmojiDuelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmojiDuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
