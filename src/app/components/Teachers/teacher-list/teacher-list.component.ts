import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css'],
})
export class TeacherListComponent {
  constructor(private router: Router) {}
  // For students list
  teacherData = [
    {
      teacherId: 101,
      teacherName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      department: 'Comp',
      contactNumber: '9876543210',
      action: 'edit,delete,details',
    },
    {
      teacherId: 102,
      teacherName: 'Priya Gupta',
      email: 'priya.gupta@example.com',
      department: 'Math',
      contactNumber: '9876543211',
      action: 'edit,delete,details',
    },
    {
      teacherId: 103,
      teacherName: 'Vikram Yadav',
      email: 'vikram.yadav@example.com',
      department: 'Physics',
      contactNumber: '9876543212',
      action: 'edit,delete,details',
    },
    {
      teacherId: 104,
      teacherName: 'Neha Singh',
      email: 'neha.singh@example.com',
      department: 'Chemistry',
      contactNumber: '9876543213',
      action: 'edit,delete,details',
    },
    {
      teacherId: 105,
      teacherName: 'Manoj Kumar',
      email: 'manoj.kumar@example.com',
      department: 'Biology',
      contactNumber: '9876543214',
      action: 'edit,delete,details',
    },
    {
      teacherId: 106,
      teacherName: 'Sangeeta Rani',
      email: 'sangeeta.rani@example.com',
      department: 'English',
      contactNumber: '9876543215',
      action: 'edit,delete,details',
    },
    {
      teacherId: 107,
      teacherName: 'Ravi Mehta',
      email: 'ravi.mehta@example.com',
      department: 'History',
      contactNumber: '9876543216',
      action: 'edit,delete,details',
    },
    {
      teacherId: 108,
      teacherName: 'Shweta Verma',
      email: 'shweta.verma@example.com',
      department: 'Economics',
      contactNumber: '9876543217',
      action: 'edit,delete,details',
    },
    {
      teacherId: 109,
      teacherName: 'Siddharth Rao',
      email: 'siddharth.rao@example.com',
      department: 'Computer Science',
      contactNumber: '9876543218',
      action: 'edit,delete,details',
    },
    {
      teacherId: 110,
      teacherName: 'Anjali Sharma',
      email: 'anjali.sharma@example.com',
      department: 'Philosophy',
      contactNumber: '9876543219',
      action: 'edit,delete,details',
    },
  ];

  teacherDataColumns = [
    { columnDef: 'teacherId', header: 'Teacher ID' },
    { columnDef: 'teacherName', header: 'Teacher Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'department', header: 'Department' },
    { columnDef: 'contactNumber', header: 'Contact Number' },
    { columnDef: 'action', header: 'Action' },
  ];

  teacherDisplayedColumns = this.teacherDataColumns.map((c) => c.columnDef);
  teacherDataSource = this.teacherData;

  ngOnInit(): void {}

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();

    if (value === '') {
      this.teacherDataSource = [...this.teacherData];
    } else {
      const filtered = this.teacherData.filter((teacher) =>
        Object.values(teacher).some((val) =>
          val.toString().toLowerCase().includes(value)
        )
      );
      this.teacherDataSource = [...filtered];
    }
  }
  onEditClicked(event: any) {
    debugger;
    console.log(event);
    this.router.navigate([`teacher-list/create-teacher/${event.teacherId}`]);
  }
  onDetailsClicked(event: any) {
    debugger;
    console.log(event);
    this.router.navigate([`teacher-list/teacher-details/${event.teacherId}`]);
  }
}
