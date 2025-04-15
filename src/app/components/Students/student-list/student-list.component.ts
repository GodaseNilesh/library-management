import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit {
  // For students list
  StudentData = [
    {
      studentId: 101,
      studentName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      className: 'BCA I',
      department: 'Comp',
      contactNumber: '9876543210',
    },
    {
      studentId: 102,
      studentName: 'Sneha Patel',
      email: 'sneha.patel@example.com',
      className: 'BCS II',
      department: 'Comp',
      contactNumber: '9123456780',
    },
    {
      studentId: 103,
      studentName: 'Rohan Desai',
      email: 'rohan.desai@example.com',
      className: 'BTech III',
      department: 'Mech',
      contactNumber: '9988776655',
    },
    {
      studentId: 104,
      studentName: 'Priya Nair',
      email: 'priya.nair@example.com',
      className: 'MSc I',
      department: 'Physics',
      contactNumber: '9898989898',
    },
    {
      studentId: 105,
      studentName: 'Vikram Joshi',
      email: 'vikram.joshi@example.com',
      className: 'BCom II',
      department: 'Comp',
      contactNumber: '9112233445',
    },
    {
      studentId: 106,
      studentName: 'Isha Mehta',
      email: 'isha.mehta@example.com',
      className: 'BCS III',
      department: 'Physics',
      contactNumber: '9001122334',
    },
    {
      studentId: 107,
      studentName: 'Karan Verma',
      email: 'karan.verma@example.com',
      className: 'BTech I',
      department: 'Mech',
      contactNumber: '9023456789',
    },
    {
      studentId: 108,
      studentName: 'Divya Singh',
      email: 'divya.singh@example.com',
      className: 'MSc II',
      department: 'Physics',
      contactNumber: '9345678901',
    },
    {
      studentId: 109,
      studentName: 'Ankit Gupta',
      email: 'ankit.gupta@example.com',
      className: 'BCA II',
      department: 'Comp',
      contactNumber: '9870012345',
    },
    {
      studentId: 110,
      studentName: 'Neha Kulkarni',
      email: 'neha.kulkarni@example.com',
      className: 'BCom III',
      department: 'Mech',
      contactNumber: '9765432109',
    },
  ];

  StudentDataColumns = [
    { columnDef: 'studentId', header: 'Student ID' },
    { columnDef: 'studentName', header: 'Student Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'className', header: 'Class' },
    { columnDef: 'department', header: 'Department' },
    { columnDef: 'contactNumber', header: 'Contact Number' },
  ];

  studentsDisplayedColumns = this.StudentDataColumns.map((c) => c.columnDef);
  studentsDataSource = this.StudentData;

  ngOnInit(): void {}

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();

    if (value === '') {
      this.studentsDataSource = [...this.StudentData];
    } else {
      const filtered = this.StudentData.filter((student) =>
        Object.values(student).some((val) =>
          val.toString().toLowerCase().includes(value)
        )
      );
      this.studentsDataSource = [...filtered];
    }
  }
}
