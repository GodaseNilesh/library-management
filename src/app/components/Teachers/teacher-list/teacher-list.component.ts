import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TeacherService } from 'src/app/Services/teacher.service';
import { CommonDialogComponent } from '../../Shared/common-dialog/common-dialog.component';

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
    { columnDef: 'phone', header: 'Contact Number' },
    { columnDef: 'action', header: 'Action' },
  ];

  teacherDisplayedColumns = this.teacherDataColumns.map((c) => c.columnDef);
  teacherDataSource: any[] = [];
  teachersData: any[] = [];

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.isLoading = true;
    this.teacherService.getAllTeachers().subscribe(
      (res: any) => {
        this.teachersData = res;
        this.teachersData = this.teachersData.map((x: any) => {
          x.teacherName = x.firstName + ' ' + x.lastName;
          x.action = 'edit,delete,details';
          return x;
        });
        this.teacherDisplayedColumns = this.teacherDataColumns.map(
          (c) => c.columnDef
        );
        this.teacherDataSource = this.teachersData;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();

    if (value === '') {
      this.teacherDataSource = [...this.teachersData];
    } else {
      const filtered = this.teachersData.filter((teacher) =>
        Object.values(teacher).some((val: any) =>
          val.toString().toLowerCase().includes(value)
        )
      );
      this.teacherDataSource = [...filtered];
    }
  }
  onEditClicked(event: any) {
    console.log(event);
    this.router.navigate([`teacher-list/create-teacher/${event.teacherId}`]);
  }
  onDetailsClicked(event: any) {
    console.log(event);
    this.router.navigate([`teacher-list/teacher-details/${event.teacherId}`]);
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
      if (result === 'delete') {
        this.isLoading = true;
        this.teacherService.deleteTeacherById(event.teacherId).subscribe(
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
