import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IssuedBookService } from 'src/app/Services/issued-book.service';
import { CommonDialogComponent } from '../../Shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from 'src/app/Services/book.service';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/app/Services/user.service';
import { StudentService } from 'src/app/Services/student.service';
import { TeacherService } from 'src/app/Services/teacher.service';

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
  issueBookRecords: any[] = [];
  issuedBooksDataSource: any[] = [];
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
    let allBooksData: any[] = [];
    forkJoin(
      this.issuedBookService.getAllIssuedBooks(),
    ).subscribe(([issuedBooks]: any) => {
        this.issueBookRecords = issuedBooks.data;
        this.issueBookRecords = this.issueBookRecords.map((x: any) => {
          x.action = 'edit,delete';
          x.issue_date = new Date(x.issue_date)
            .toLocaleDateString('en-GB')
            .replace(/\//g, '-');
          x.due_date = new Date(x.due_date)
            .toLocaleDateString('en-GB')
            .replace(/\//g, '-');
          return x;
        });

        this.issuedBooksDataSource = this.issueBookRecords;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();

    if (value === '') {
      this.issuedBooksDataSource = [...this.issueBookRecords];
    } else {
      const filtered = this.issueBookRecords.filter((book: any) =>
        Object.values(book).some((val: any) =>
          val.toString().toLowerCase().includes(value)
        )
      );
      this.issuedBooksDataSource = [...filtered];
    }
  }
  onEditClicked(event: any) {
    console.log(event);
    this.router.navigate([
      `issue-book-history/create-book-issue/${event.issue_id}`,
    ]);
  }
  onDeleteClicked(event: any) {
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
        this.issuedBookService.deleteIssuedBookById(event.issue_id).subscribe(
          (res: any) => {
            console.log(res);
            this.loadData();
          },
          (err: any) => {
            console.log(err);
          }
        );
        this.isLoading = false;
      }
    });
  }
  onDetailsClicked(event: any) {
    console.log(event);
    // this.router.navigate([`student-list/student-details/${event.studentId}`]);
  }
}
