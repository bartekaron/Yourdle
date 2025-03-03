import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuelComponent } from './duel.component';

describe('DuelComponent', () => {
  let component: DuelComponent;
  let fixture: ComponentFixture<DuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
