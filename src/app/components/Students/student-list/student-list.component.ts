import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/Services/student.service';
import { CommonDialogComponent } from '../../Shared/common-dialog/common-dialog.component';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit {
  constructor(
    private router: Router,
    private studentService: StudentService,
    private dialog: MatDialog
  ) {}
  StudentData: any = [];
  isLoading: boolean = false;

  StudentDataColumns = [
    { columnDef: 'studentId', header: 'Student ID' },
    { columnDef: 'studentName', header: 'Student Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'class', header: 'Class' },
    { columnDef: 'department', header: 'Department' },
    { columnDef: 'phone', header: 'Contact Number' },
    { columnDef: 'action', header: 'Action' },
  ];

  studentsDisplayedColumns: string[] = [];
  studentsDataSource: any[] = [];
  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.isLoading = true;
    this.studentService.getAllStudents().subscribe(
      (value: any) => {
        console.log(value);
        this.StudentData = value;
        this.StudentData = this.StudentData.map((x: any) => {
          x.studentName = x.firstName + ' ' + x.lastName;
          x.action = 'edit,delete,details';
          x.class = x.className;
          x.phone = x.phoneNumber;
          return x;
        });
        console.log(this.StudentData);
        this.studentsDisplayedColumns = this.StudentDataColumns.map(
          (c) => c.columnDef
        );
        this.studentsDataSource = this.StudentData;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();

    if (value === '') {
      this.studentsDataSource = [...this.StudentData];
    } else {
      const filtered = this.StudentData.filter((student: any) =>
        Object.values(student).some((val: any) =>
          val.toString().toLowerCase().includes(value)
        )
      );
      this.studentsDataSource = [...filtered];
    }
  }
  onEditClicked(event: any) {
    console.log(event);
    this.router.navigate([`student-list/create-student/${event.studentId}`]);
  }
  onDetailsClicked(event: any) {
    console.log(event);
    this.router.navigate([`student-list/student-details/${event.studentId}`]);
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
      if (result === 'confirm') {
        this.isLoading = true;
        this.studentService.deleteStudentById(event.studentId).subscribe(
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
}
