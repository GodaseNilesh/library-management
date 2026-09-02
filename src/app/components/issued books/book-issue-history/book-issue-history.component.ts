import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IssuedBookService } from 'src/app/Services/issued-book.service';
import { CommonDialogComponent } from '../../Shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from 'src/app/Services/book.service';
import { StudentService } from 'src/app/Services/student.service';
import { TeacherService } from 'src/app/Services/teacher.service';
import { IssuedBook, IssuedBookResponse, IssuedBookTable } from 'src/app/models/IssuedBook.model';

@Component({
  selector: 'app-book-issue-history',
  templateUrl: './book-issue-history.component.html',
  styleUrls: ['./book-issue-history.component.css'],
})
export class BookIssueHistoryComponent implements OnInit {
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private issuedBookService: IssuedBookService,
    private bookService: BookService,
    private dialog: MatDialog,
    private studentService: StudentService,
    private teacherService: TeacherService
  ) {}
  // For issued book list
  issueBookRecords: IssuedBookTable[] = [];
  issuedBooksDataSource: IssuedBook[] = [];
  issuedBookDataColumns = [
    { columnDef: 'issue_id', header: 'ID' },
    { columnDef: 'book_title', header: 'Book Name' },
    { columnDef: 'user_name', header: 'User Name' },
    { columnDef: 'role', header: 'user Type' },
    { columnDef: 'issue_date', header: 'Issue Date' },
    { columnDef: 'due_date', header: 'Due Date' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'action', header: 'Action' },
  ];

  issuedBooksDisplayedColumns = this.issuedBookDataColumns.map(
    (c) => c.columnDef
  );

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.issuedBookService.getAllIssuedBooks().subscribe({
      next: (issuedBooks: IssuedBookResponse) => {
        this.issueBookRecords = issuedBooks.data.map(
          (x): IssuedBookTable => ({
            ...x,
            action: 'edit,delete',
            issue_date: new Date(x.issue_date)
              .toLocaleDateString('en-GB')
              .replace(/\//g, '-'),
            due_date: new Date(x.due_date)
              .toLocaleDateString('en-GB')
              .replace(/\//g, '-'),
          }),
        );
        this.issuedBooksDataSource = this.issueBookRecords;
      },
      error: (err: Error) => {
        console.error(err);
      },
      complete:()=>{
        this.isLoading = false;
      }
    });
  }

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();

    if (value === '') {
      this.issuedBooksDataSource = [...this.issueBookRecords];
    } else {
      const filtered = this.issueBookRecords.filter((book: IssuedBookTable) =>
        Object.values(book).some((val) =>
          val.toString().toLowerCase().includes(value)
        )
      );
      this.issuedBooksDataSource = [...filtered];
    }
  }
  onEditClicked(event: IssuedBook) {
    console.log(event);
    this.router.navigate([
      `issue-book-history/create-book-issue/${event.issue_id}`,
    ]);
  }

  onDeleteClicked(event: IssuedBook) {
    console.log(event);
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      disableClose: true,
      data: {
        status: 'Confirm!',
        message: 'This action cannot be undone. The record will be permanently removed.',
        action: {
          cancel: true,
          delete: true
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.isLoading = true;
        this.issuedBookService.deleteIssuedBookById(String(event.issue_id)).subscribe(
          (res) => {
            console.log(res);
            this.loadData();
          },
          (err) => {
            console.log(err);
          }
        );
        this.isLoading = false;
      }
    });
  }

  onDetailsClicked(event: IssuedBook) {
    console.log(event);
    // this.router.navigate([`student-list/student-details/${event.studentId}`]);
  }
}
