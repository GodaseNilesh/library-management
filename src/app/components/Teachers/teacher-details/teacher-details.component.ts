import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TeacherService } from 'src/app/Services/teacher.service';

@Component({
  selector: 'app-teacher-details',
  templateUrl: './teacher-details.component.html',
  styleUrls: ['./teacher-details.component.css'],
})
export class TeacherDetailsComponent implements OnInit {
  teacherDetailsForm!: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private fb: FormBuilder
  ) {
    this.teacherDetailsForm = this.fb.group({
      teacherId: new FormControl(''),
      fullName: new FormControl(''),
      department: new FormControl(''),
      mobileNo: new FormControl(''),
      email: new FormControl(''),
    });
  }
  TeacherData = [
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

  teacherDataColumns = [
    { columnDef: 'srNo', header: 'Sr No.' },
    { columnDef: 'issueId', header: 'Issue Id' },
    { columnDef: 'userId', header: 'User Id' },
    { columnDef: 'bookId', header: 'Book Id' },
    { columnDef: 'issueDate', header: 'Issue Date' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'action', header: 'Action' },
  ];

  teacherDisplayedColumns = this.teacherDataColumns.map((c) => c.columnDef);
  teacherDataSource = this.TeacherData;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      id &&
        this.teacherService.getTeacherById(id).subscribe(
          (res: any) => {
            console.log(res);
            this.teacherDetailsForm.patchValue({
              teacherId: res.teacherId,
              fullName: res.firstName + ' ' + res.lastName,
              department: res.department,
              mobileNo: res.phone,
              email: res.email,
            });
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }
}
