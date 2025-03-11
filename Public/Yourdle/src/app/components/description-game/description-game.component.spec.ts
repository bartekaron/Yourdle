import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionGameComponent } from './description-game.component';

describe('DescriptionGameComponent', () => {
  let component: DescriptionGameComponent;
  let fixture: ComponentFixture<DescriptionGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
