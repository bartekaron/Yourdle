import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionDuelComponent } from './description-duel.component';

describe('DescriptionDuelComponent', () => {
  let component: DescriptionDuelComponent;
  let fixture: ComponentFixture<DescriptionDuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionDuelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionDuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
