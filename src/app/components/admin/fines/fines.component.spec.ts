import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesComponent } from './fines.component';

describe('FinesComponent', () => {
  let component: FinesComponent;
  let fixture: ComponentFixture<FinesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinesComponent]
    });
    fixture = TestBed.createComponent(FinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
