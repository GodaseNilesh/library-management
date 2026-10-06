import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/student.model';
import { IssuedBook, IssuedBookResponse } from 'src/app/models/IssuedBook.model';
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
  payFineBtnVisiable: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private issuedBookService: IssuedBookService,
    private router: Router
  ) {
    this.studentDetailsForm = this.fb.group({
      studentId: new FormControl(''),
      fullName: new FormControl(''),
      className: new FormControl(''),
      department: new FormControl(''),
      mobileNo: new FormControl(''),
      email: new FormControl(''),
      rollNo: new FormControl(''),
    });
  }

  StudentDataColumns = [
    { columnDef: 'book_title', header: 'Book Name' },
    { columnDef: 'issue_date', header: 'Issue Date' },
    { columnDef: 'due_date', header: 'Due Date' },
    { columnDef: 'return_date', header: 'Return Date' },
    { columnDef: 'overdue_days', header: 'Overdue Days' },
    { columnDef: 'fine_amount', header: 'Fine Amount(₹)' },
    { columnDef: 'fine_paid', header: 'Fine Paid' },
    { columnDef: 'status', header: 'Status' },
  ];

  studentsDisplayedColumns = this.StudentDataColumns.map((c) => c.columnDef);
  issuedBookDatasource: IssuedBook[] = [];
  studentId = 0;

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.studentId = Number(id);
        this.studentService.getStudentById(id).subscribe((student: Student) => {
          const studentInfo = student;
          this.studentDetailsForm.patchValue({
            studentId: studentInfo.studentId,
            email: studentInfo.email,
            className: studentInfo.className,
            department: studentInfo.department,
            mobileNo: studentInfo.phone,
            rollNo: studentInfo.rollNo,
            fullName: `${studentInfo.firstName} ${studentInfo.lastName}`,
          });

          this.issuedBookService
            .getAllIssuedBooks('', student.userId)
            .subscribe((issuedRecords: IssuedBookResponse) => {
              issuedRecords.data.forEach((x: IssuedBook, index: number) => {
                x.id = index + 1;
                x.issue_date = new Date(x.issue_date)
                  .toLocaleDateString('en-GB')
                  .replace(/\//g, '-');
                x.due_date = new Date(x.due_date)
                  .toLocaleDateString('en-GB')
                  .replace(/\//g, '-');
                if (x.return_date) {
                  x.return_date = new Date(x.return_date)
                    .toLocaleDateString('en-GB')
                    .replace(/\//g, '-');
                } else x.return_date = '-';

                x.fine_paid =
                  x.fine_amount > 0 ? (x.fine_paid ? 'Paid' : 'Unpaid') : 'N/A';

                if (!this.payFineBtnVisiable) this.payFineBtnVisiable = x.fine_paid === 'Unpaid';
              });

              this.issuedBookDatasource = issuedRecords.data;
              this.isLoading = false;
            });
        });
      }
    });
  }

  goToEditPage(){
    this.router.navigate(['/student-list/create-student', this.studentId]);
  }
}
