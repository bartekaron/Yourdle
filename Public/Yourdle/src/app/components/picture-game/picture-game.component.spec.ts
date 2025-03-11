import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureGameComponent } from './picture-game.component';

describe('PictureGameComponent', () => {
  let component: PictureGameComponent;
  let fixture: ComponentFixture<PictureGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PictureGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PictureGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
