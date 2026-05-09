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
    { columnDef: 'firstName', header: 'Student Name' },
    { columnDef: 'email', header: 'Student Email' },
    { columnDef: 'phone', header: 'Student Phone' },
  ];

  issuedBooksDataColumns = [
    { columnDef: 'bookId', header: 'Book Id' },
    { columnDef: 'userName', header: 'User Name' },
    { columnDef: 'issueDate', header: 'Issued Date' },
    { columnDef: 'dueDate', header: 'Return Date' },
    { columnDef: 'status', header: 'Status' },
  ];

  recentActivities:any[] = [
    {
      action: 'Book Issued',
      description: 'Issued "Java Basics" to John Doe',
      performed_by: 'Admin',
      role: 'admin',
      created_at: '2026-05-09 10:15 AM',
    },
    {
      action: 'Book Returned',
      description: 'Returned "Python Basics" by Nilesh',
      performed_by: 'Librarian',
      role: 'teacher',
      created_at: '2026-05-09 09:40 AM',
    },
    {
      action: 'New Book Added',
      description: 'Added new book "Machine Learning"',
      performed_by: 'Admin',
      role: 'admin',
      created_at: '2026-05-08 06:20 PM',
    },
    {
      action: 'Register New Student',
      description: 'Registered new student "Test User"',
      performed_by: 'Admin',
      role: 'admin',
      created_at: '2026-05-08 03:10 PM',
    },
    {
      action: 'Update Stock',
      description: 'Updated stock for "Javascript Advanced"',
      performed_by: 'Teacher',
      role: 'teacher',
      created_at: '2026-05-08 11:30 AM',
    },
  ];

  constructor(
    public loginService: LoginService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private bookService: BookService,
    private issuedBookService: IssuedBookService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    forkJoin(
      this.studentService.getAllStudents(),
      this.teacherService.getAllTeachers(),
      this.bookService.getAllBooks(),
      this.issuedBookService.getAllIssuedBooks(),
      this.userService.getPendingRegistrationRequests(),
    ).subscribe(
      ([
        studentRes,
        teacherRes,
        booksRes,
        issuedBookResponse,
        requests,
      ]: any) => {
        this.studentCount = studentRes.length;
        this.teacherCount = teacherRes.length;
        this.booksCount = booksRes.length;
        this.issuedBooksCount = issuedBookResponse.length;
        this.pendingRequestsCount = requests.length;
        this.allBooksData = booksRes.map((x: any, index: number) => ({
          ...x,
          id: index + 1,
        }));

        this.booksDisplayedColumns = this.BookDataColumns.map(
          (c) => c.columnDef,
        );
        this.bookDataSource = this.allBooksData.splice(0, 4);

        this.studentDisplayedColumns = this.studentDataColumns.map(
          (c) => c.columnDef,
        );
        this.studentDataSource = studentRes.map((student: any) => {
          student.phone = student.phoneNumber;
          return student;
        }).splice(0,5);

        this.issuedBooksDisplayedColumns = this.issuedBooksDataColumns.map(
          (c) => c.columnDef,
        );
        issuedBookResponse = issuedBookResponse.map(
          (x: any, index: number) => ({
            ...x,
            id: index + 1,
          }),
        );

        issuedBookResponse.forEach((x: any, index: number) => {
          if (x.userType === 'Student') {
            const user = studentRes.find((y: any) => y.studentId === x.userId);
            x.userName = user?.firstName + ' ' + user?.lastName || '';
          } else {
            const user = teacherRes.find((y: any) => y.teacherId === x.userId);
            x.userName = user?.firstName + ' ' + user?.lastName || '';
          }
          x.id = index + 1;
        });

        this.issuedBookDataSource = issuedBookResponse;
      },
    );
  }
}
