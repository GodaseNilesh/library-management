import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookIssueHistoryComponent } from './book-issue-history.component';

describe('BookIssueHistoryComponent', () => {
  let component: BookIssueHistoryComponent;
  let fixture: ComponentFixture<BookIssueHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookIssueHistoryComponent]
    });
    fixture = TestBed.createComponent(BookIssueHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
