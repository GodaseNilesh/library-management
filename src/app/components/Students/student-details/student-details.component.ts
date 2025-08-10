import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { IssuedBookService } from 'src/app/Services/issued-book.service';
import { StudentService } from 'src/app/Services/student.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css'],
})
export class StudentDetailsComponent implements OnInit {
  studentDetailsForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private issuedBookService: IssuedBookService
  ) {
    this.studentDetailsForm = this.fb.group({
      studentId: new FormControl(''),
      fullName: new FormControl(''),
      className: new FormControl(''),
      department: new FormControl(''),
      mobileNo: new FormControl(''),
      email: new FormControl(''),
    });
  }

  StudentData = [];

  StudentDataColumns = [
    { columnDef: 'issueId', header: 'Issue Id' },
    { columnDef: 'userName', header: 'User Name' },
    { columnDef: 'bookId', header: 'Book Id' },
    { columnDef: 'issueDate', header: 'Issue Date' },
    { columnDef: 'dueDate', header: 'Due Date' },
    { columnDef: 'status', header: 'Status' },
    // { columnDef: 'action', header: 'Action' },
  ];

  studentsDisplayedColumns = this.StudentDataColumns.map((c) => c.columnDef);
  studentsDataSource:any = this.StudentData;

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        forkJoin(
          this.studentService
            .getStudentById(id)
            .pipe(map((student) => [student])),
          this.issuedBookService.getAllIssuedBooks('',id)
        ).subscribe((res) => {
          //patch student information
          let studentInfo: any = res[0][0];
          this.studentDetailsForm.patchValue({
            studentId: studentInfo.studentId,
            email: studentInfo.email,
            className: studentInfo.class,
            department: studentInfo.department,
            mobileNo: studentInfo.phone,
            fullName: studentInfo.firstName + ' ' + studentInfo.lastName,
          });

          this.studentsDataSource = res[1];

          this.isLoading = false;
        });
      }
    });
  }
}
