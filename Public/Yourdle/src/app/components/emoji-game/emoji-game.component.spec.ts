import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiGameComponent } from './emoji-game.component';

describe('EmojiGameComponent', () => {
  let component: EmojiGameComponent;
  let fixture: ComponentFixture<EmojiGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmojiGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmojiGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
