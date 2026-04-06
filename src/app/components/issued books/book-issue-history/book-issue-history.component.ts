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
    { columnDef: 'issueId', header: 'ID' },
    { columnDef: 'bookId', header: 'Book Id' },
    { columnDef: 'bookName', header: 'Book Name' },
    { columnDef: 'userName', header: 'User Name' },
    { columnDef: 'userType', header: 'user Type' },
    { columnDef: 'issueDate', header: 'Issue Date' },
    { columnDef: 'dueDate', header: 'Due Date' },
    { columnDef: 'quantity', header: 'Quantity' },
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
      this.bookService.getAllBooks(),
      this.issuedBookService.getAllIssuedBooks(),
      this.studentService.getAllStudents(),
      this.teacherService.getAllTeachers()
    ).subscribe(([books, issuedBooks, students, teachers]: any) => {
        allBooksData = books;
        this.issueBookRecords = issuedBooks;
        this.issueBookRecords = this.issueBookRecords.map((x: any) => {
          x.action = 'edit,delete';
          return x;
        });

        this.issueBookRecords.forEach((x: any) => {
          const book = allBooksData.find((y: any) => y.bookId === x.bookId);
          x.bookName = book?.title || '';
        });

        this.issueBookRecords.forEach((x: any) => {
          if (x.userType === 'Student') {
            const user = students.find((y: any) => y.studentId === x.userId);
            x.userName = user?.firstName + user?.lastName || '';
          } else {
            const user = teachers.find((y: any) => y.teacherId === x.userId);
            x.userName = user?.firstName + user?.lastName || '';
          }
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
      `issue-book-history/create-book-issue/${event.issueId}`,
    ]);
  }
  onDeleteClicked(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      disableClose: true,
      data: {
        status: 'Confirm!',
        message: 'Do you want delete this record?',
        action: {
          cancel: true,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.isLoading = true;
        this.issuedBookService.deleteIssuedBookById(event.issueId).subscribe(
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
