import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchHistoryComponent } from './match-history.component';

describe('MatchHistoryComponent', () => {
  let component: MatchHistoryComponent;
  let fixture: ComponentFixture<MatchHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
