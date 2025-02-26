import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswrodComponent } from './change-passwrod.component';

describe('ChangePasswrodComponent', () => {
  let component: ChangePasswrodComponent;
  let fixture: ComponentFixture<ChangePasswrodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswrodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswrodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
