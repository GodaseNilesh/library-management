import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
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
  availableBooksCount: number = 0;
  pendingRequestsCount: number = 0;
  isLoading: boolean = false;

  allBooksData: any = [];
  allAuthorsData: any[] = [];
  allIssuedBooksData: any[] = [];

  private _formBuilder = inject(FormBuilder);

  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });

  bookDataSource: any[] = [];
  booksDisplayedColumns: any[] = [];

  studentDataSource: any[] = [];
  studentDisplayedColumns: any[] = [];

  issuedBookDataSource: any[] = [];
  issuedBooksDisplayedColumns: any[] = [];

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

  recentActivities:any[] = [];

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
      this.userService.getActivities()
    ).subscribe(
      ([
        studentRes,
        teacherRes,
        booksRes,
        issuedBookResponse,
        requests,
        activities
      ]: any) => {
        this.studentCount = studentRes.data.totalRecords;
        this.teacherCount = teacherRes.data.totalRecords;
        this.booksCount = booksRes.data.totalRecords;
        this.issuedBooksCount = issuedBookResponse.pagination.totalRecords;
        this.pendingRequestsCount = requests.data.length;
        this.allBooksData = booksRes.data.books.map((x: any, index: number) => ({
          ...x,
          id: index + 1,
        }));

        this.recentActivities = activities.map((activity: any) => ({
          action: activity.activity_type,
          description: activity.description,
          performed_by: activity.created_by_name,
          role: activity.role,
          created_at: activity.created_at
        })).reverse().slice(0,5);

        this.booksDisplayedColumns = this.BookDataColumns.map(
          (c) => c.columnDef,
        );
        this.bookDataSource = this.allBooksData.splice(0, 4);

        this.studentDisplayedColumns = this.studentDataColumns.map(
          (c) => c.columnDef,
        );
        this.studentDataSource = studentRes.data.students.splice(0,5);

        this.issuedBooksDisplayedColumns = this.issuedBooksDataColumns.map(
          (c) => c.columnDef,
        );
        issuedBookResponse = issuedBookResponse.data.map(
          (x: any, index: number) => ({
            ...x,
            id: index + 1,
          }),
        );

        issuedBookResponse.forEach((x: any, index: number) => {
          x.id = index + 1;
          x.issue_date = new Date(x.issue_date)
            .toLocaleDateString('en-GB')
            .replace(/\//g, '-');
          x.due_date = new Date(x.due_date)
            .toLocaleDateString('en-GB')
            .replace(/\//g, '-');
        });

        this.issuedBookDataSource = issuedBookResponse;
        this.isLoading = false;
      },
    );
  }
}
