import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/Services/student.service';
import { CommonDialogComponent } from '../../Shared/common-dialog/common-dialog.component';
import { Student, StudentTableData, StudentResponse } from 'src/app/models/student.model';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit {
  constructor(
    private router: Router,
    private studentService: StudentService,
    private dialog: MatDialog,
    private userService: UserService
  ) {}
  StudentData: Student[] = [];
  isLoading: boolean = false;
  showExportOptions: boolean = false;
  showImportOptions: boolean = false;

  StudentDataColumns = [
    { columnDef: 'fullName', header: 'Student Name' },
    { columnDef: 'studentId', header: 'Student ID' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'class', header: 'Class' },
    { columnDef: 'department', header: 'Department' },
    { columnDef: 'phone', header: 'Contact Number' },
    { columnDef: 'action', header: 'Action' },
  ];

  studentsDisplayedColumns: string[] = [];
  studentsDataSource: Student[] = [];
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.studentService.getAllStudents().subscribe(
      (response: StudentResponse) => {
        this.StudentData = response.students;
        this.StudentData = this.StudentData.map(
          (x: Student): StudentTableData => {
            return {
              ...x,
              action: 'edit,deactivate,details',
              class: x.className,
            };
          },
        );
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
      const filtered = this.StudentData.filter((student: Student) =>
        Object.values(student).some((val) =>
          val.toString().toLowerCase().includes(value)
        )
      );
      this.studentsDataSource = [...filtered];
    }
  }
  onEditClicked(event: Student) {
    console.log(event);
    this.router.navigate([`student-list/create-student/${event.studentId}`]);
  }

  onDetailsClicked(event: Student) {
    console.log(event);
    this.router.navigate([`student-list/student-details/${event.studentId}`]);
  }

  onDeactivateClicked(event: Student) {
    if(event.studentId === undefined) return;
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      disableClose: true,
      data: {
        status: 'Confirm!',
        message: `Are you sure you want to deactivate this user?\n You can restore this user later from the users list.`,
        action: {
          cancel: true,
          deactivate: true,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'deactivate') {
        this.isLoading = true;
        const payload = {
          userRole: 'user',
          status: 'inactive',
          userId: event.userId ?? 0,
        };
        this.userService.updateUserById(payload).subscribe({
          next: () => {
            this.loadData();
          },
          error: () => {
            this.isLoading = false;
          },
        });
      }
    });
  }

  onImportExportOptionChange(type: string, value: string) {
    if (type === 'import') {
      if (value === 'excel') {
      }
    } else if (type === 'export') {
      if (value === 'excel') {
       this.studentService.exportAllStudentsData().subscribe((res) => {
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         const now = new Date();
         const fileName = `students_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.xlsx`;
         a.download = fileName;
         a.click();
         window.URL.revokeObjectURL(url);
       });
      }
    }
  }
}
