import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureDuelComponent } from './picture-duel.component';

describe('PictureDuelComponent', () => {
  let component: PictureDuelComponent;
  let fixture: ComponentFixture<PictureDuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PictureDuelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PictureDuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
