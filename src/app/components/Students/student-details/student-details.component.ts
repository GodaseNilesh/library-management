import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
    private studentService: StudentService
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

  StudentData = [
    {
      srNo: 1,
      issueId: 4,
      userId: 2,
      bookId: 3,
      issueDate: '2024-03-01',
      status: 'Submitted',
      action: 'Return Book',
    },
  ];

  StudentDataColumns = [
    { columnDef: 'srNo', header: 'Sr No.' },
    { columnDef: 'issueId', header: 'Issue Id' },
    { columnDef: 'userId', header: 'User Id' },
    { columnDef: 'bookId', header: 'Book Id' },
    { columnDef: 'issueDate', header: 'Issue Date' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'action', header: 'Action' },
  ];

  studentsDisplayedColumns = this.StudentDataColumns.map((c) => c.columnDef);
  studentsDataSource = this.StudentData;

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.studentService.getStudentById(id).subscribe(
          (res: any) => {
            this.studentDetailsForm.patchValue({
              studentId: res.studentId,
              email: res.email,
              className: res.class,
              department: res.department,
              mobileNo: res.phone,
              fullName: res.firstName + ' ' + res.lastName,
            });
            console.log(this.studentDetailsForm.value);
          },
          (error) => {
            console.log(error);
          }
        );
        this.isLoading = false;
      }
    });
  }
}
