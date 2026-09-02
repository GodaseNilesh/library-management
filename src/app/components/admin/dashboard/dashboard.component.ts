import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Book } from 'src/app/models/book.model';
import { IssuedBook, UpdateIssuedBook } from 'src/app/models/IssuedBook.model';
import { Student } from 'src/app/models/student.model';
import { RecentActivity } from 'src/app/models/user.model';
import { BookService } from 'src/app/Services/book.service';
import { IssuedBookService } from 'src/app/Services/issued-book.service';
import { LoginService } from 'src/app/Services/login.service';
import { StudentService } from 'src/app/Services/student.service';
import { TeacherService } from 'src/app/Services/teacher.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  studentCount: number = 0;
  teacherCount: number = 0;
  booksCount: number = 0;
  issuedBooksCount: number = 0;
  overdueIssuedBooksCount: number = 0;
  availableBooksCount: number = 0;
  pendingRequestsCount: number = 0;
  isLoading: boolean = false;

  allBooksData: Book[] = [];

  private _formBuilder = inject(FormBuilder);

  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });

  bookDataSource: Book[] = [];
  booksDisplayedColumns: string[] = [];

  studentDataSource: Student[] = [];
  studentDisplayedColumns: string[] = [];

  issuedBookDataSource: IssuedBook[] = [];
  issuedBooksDisplayedColumns: string[] = [];

  BookDataColumns = [
    { columnDef: 'title', header: 'Title' },
    { columnDef: 'availableQuantity', header: 'Available Qty.' },
  ];

  studentDataColumns = [
    { columnDef: 'firstName', header: 'First Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'phone', header: 'Phone' },
  ];

  issuedBooksDataColumns = [
    { columnDef: 'book_title', header: 'Book Name' },
    { columnDef: 'user_name', header: 'User Name' },
    { columnDef: 'issue_date', header: 'Issued Date' },
    { columnDef: 'due_date', header: 'Due Date' },
    { columnDef: 'status', header: 'Status' },
  ];

  recentActivities: RecentActivity[] = [];

  constructor(
    public loginService: LoginService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private bookService: BookService,
    private issuedBookService: IssuedBookService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin(
      this.studentService.getAllStudents(),
      this.teacherService.getAllTeachers(),
      this.bookService.getAllBooks(),
      this.issuedBookService.getAllIssuedBooks(),
      this.userService.getPendingRegistrationRequests(),
      this.userService.getActivities(),
    ).subscribe(
      ([
        studentRes,
        teacherRes,
        booksRes,
        issuedBookResponse,
        requests,
        activities,
      ]) => {
        this.studentCount = studentRes.pagination.totalRecords ?? 0;
        this.teacherCount = teacherRes.pagination.totalRecords ?? 0;
        this.booksCount = booksRes.data.pagination.totalRecords ?? 0;
        this.issuedBooksCount = issuedBookResponse.pagination.totalRecords;
        this.overdueIssuedBooksCount = issuedBookResponse.data.filter(
          (x: IssuedBook) => {
            return x.return_date == null;
          },
        ).length;
        this.pendingRequestsCount = requests.length;
        this.allBooksData = booksRes.data.books.map(
          (x: Book, index: number) => ({
            ...x,
            id: index + 1,
          }),
        );

        this.recentActivities = activities
          .map((activity: RecentActivity) => ({
            activity_type: activity.activity_type,
            description: activity.description,
            performed_by_name: activity.performed_by_name,
            role: activity.role,
            created_at: activity.created_at,
          }))
          .reverse()
          .slice(0, 5);

        this.booksDisplayedColumns = this.BookDataColumns.map(
          (c) => c.columnDef,
        );
        this.bookDataSource = this.allBooksData.slice(0, 5);

        this.studentDisplayedColumns = this.studentDataColumns.map(
          (c) => c.columnDef,
        );
        this.studentDataSource = studentRes.students.splice(0, 7);

        this.issuedBooksDisplayedColumns = this.issuedBooksDataColumns.map(
          (c) => c.columnDef,
        );

        issuedBookResponse.data.forEach((x: IssuedBook, index: number) => {
          x.id = index + 1;
          x.issue_date = new Date(x.issue_date)
            .toLocaleDateString('en-GB')
            .replace(/\//g, '-');
          x.due_date = new Date(x.due_date)
            .toLocaleDateString('en-GB')
            .replace(/\//g, '-');
        });

        this.issuedBookDataSource = issuedBookResponse.data.slice(0, 5);
        this.isLoading = false;
      },
    );
  }
}
