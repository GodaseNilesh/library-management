import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TeacherService } from 'src/app/Services/teacher.service';
import { CommonDialogComponent } from '../../Shared/common-dialog/common-dialog.component';
import { Teacher, TeacherResponse } from 'src/app/models/teacher.model';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css'],
})
export class TeacherListComponent {
  isLoading: boolean = false;
  constructor(
    private router: Router,
    private teacherService: TeacherService,
    private dialog: MatDialog
  ) {}

  teacherDataColumns = [
    { columnDef: 'teacherId', header: 'Teacher ID' },
    { columnDef: 'teacherName', header: 'Teacher Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'department', header: 'Department' },
    { columnDef: 'phoneNo', header: 'Contact Number' },
    { columnDef: 'action', header: 'Action' },
  ];

  teacherDisplayedColumns = this.teacherDataColumns.map((c) => c.columnDef);
  teacherDataSource: Teacher[] = [];
  teachersData: Teacher[] = [];
  showExportOptions: boolean = false;

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.isLoading = true;
    this.teacherService.getAllTeachers().subscribe(
      (response: TeacherResponse) => {
        this.teachersData = response.teachers;
        this.teachersData = this.teachersData.map((x: Teacher) => {
          return {
            ...x,
            teacherName: `${x.firstName} ${x.lastName}`,
            action: 'edit,delete,details',
          };
        });
        this.teacherDisplayedColumns = this.teacherDataColumns.map(
          (c) => c.columnDef,
        );
        this.teacherDataSource = this.teachersData;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      },
    );
  }

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();

    if (value === '') {
      this.teacherDataSource = [...this.teachersData];
    } else {
      const filtered = this.teachersData.filter((teacher: Teacher) =>
        Object.values(teacher).some((val) =>
          val.toString().toLowerCase().includes(value)
        )
      );
      this.teacherDataSource = [...filtered];
    }
  }

  onEditClicked(event: Teacher) {
    console.log(event);
    this.router.navigate([`teacher-list/create-teacher/${event.teacherId}`]);
  }

  onDetailsClicked(event: Teacher) {
    console.log(event);
    this.router.navigate([`teacher-list/teacher-details/${event.teacherId}`]);
  }

  onDeleteClicked(event: Teacher) {
    if(event.teacherId === undefined) return;
    const teacherId = Number(event.teacherId);
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
        this.teacherService.deleteTeacherById(teacherId).subscribe(
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

  onImportExportOptionChange(type: string, value: string) {
    if (type === 'import') {
      if (value === 'excel') {
      }
    } else if (type === 'export') {
      if (value === 'excel') {
       this.teacherService.exportAllTeachersData().subscribe((res) => {
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         const now = new Date();
         const fileName = `teachers_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.xlsx`;
         a.download = fileName;
         a.click();
         window.URL.revokeObjectURL(url);
       });
      }
    }
  }
}
