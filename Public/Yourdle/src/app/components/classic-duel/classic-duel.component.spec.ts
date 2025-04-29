import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassicDuelComponent } from './classic-duel.component';

describe('ClassicDuelComponent', () => {
  let component: ClassicDuelComponent;
  let fixture: ComponentFixture<ClassicDuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassicDuelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassicDuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
