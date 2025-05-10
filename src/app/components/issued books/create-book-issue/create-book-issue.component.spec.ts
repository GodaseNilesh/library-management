import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookIssueComponent } from './create-book-issue.component';

describe('CreateBookIssueComponent', () => {
  let component: CreateBookIssueComponent;
  let fixture: ComponentFixture<CreateBookIssueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBookIssueComponent]
    });
    fixture = TestBed.createComponent(CreateBookIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
