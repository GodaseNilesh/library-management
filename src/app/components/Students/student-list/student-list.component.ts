import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit {
  constructor(private router: Router) {}
  // For students list
  StudentData = [
    {
      studentId: 101,
      studentName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      className: 'BCA I',
      department: 'Comp',
      contactNumber: '9876543210',
      action:"edit,delete,details"
    },
    {
      studentId: 102,
      studentName: 'Sneha Patel',
      email: 'sneha.patel@example.com',
      className: 'BCS II',
      department: 'Comp',
      contactNumber: '9123456780',
      action:"edit,delete,details"
    },
    {
      studentId: 103,
      studentName: 'Rohan Desai',
      email: 'rohan.desai@example.com',
      className: 'BTech III',
      department: 'Mech',
      contactNumber: '9988776655',
      action:"edit,delete,details"
    },
    {
      studentId: 104,
      studentName: 'Priya Nair',
      email: 'priya.nair@example.com',
      className: 'MSc I',
      department: 'Physics',
      contactNumber: '9898989898',
      action:"edit,delete,details"
    },
    {
      studentId: 105,
      studentName: 'Vikram Joshi',
      email: 'vikram.joshi@example.com',
      className: 'BCom II',
      department: 'Comp',
      contactNumber: '9112233445',
      action:"edit,delete,details"
    },
    {
      studentId: 106,
      studentName: 'Isha Mehta',
      email: 'isha.mehta@example.com',
      className: 'BCS III',
      department: 'Physics',
      contactNumber: '9001122334',
      action:"edit,delete,details"
    },
    {
      studentId: 107,
      studentName: 'Karan Verma',
      email: 'karan.verma@example.com',
      className: 'BTech I',
      department: 'Mech',
      contactNumber: '9023456789',
      action:"edit,delete,details"
    },
    {
      studentId: 108,
      studentName: 'Divya Singh',
      email: 'divya.singh@example.com',
      className: 'MSc II',
      department: 'Physics',
      contactNumber: '9345678901',
      action:"edit,delete,details"
    },
    {
      studentId: 109,
      studentName: 'Ankit Gupta',
      email: 'ankit.gupta@example.com',
      className: 'BCA II',
      department: 'Comp',
      contactNumber: '9870012345',
      action:"edit,delete,details"
    },
    {
      studentId: 110,
      studentName: 'Neha Kulkarni',
      email: 'neha.kulkarni@example.com',
      className: 'BCom III',
      department: 'Mech',
      contactNumber: '9765432109',
      action:"edit,delete,details"
    },
  ];

  StudentDataColumns = [
    { columnDef: 'studentId', header: 'Student ID' },
    { columnDef: 'studentName', header: 'Student Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'className', header: 'Class' },
    { columnDef: 'department', header: 'Department' },
    { columnDef: 'contactNumber', header: 'Contact Number' },
    { columnDef: 'action', header: 'Action' },
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
  onEditClicked(event: any) {
    debugger
    console.log(event);
    this.router.navigate([`student-list/create-student/${event.studentId}`])
  }
  onDetailsClicked(event:any){
    debugger
    console.log(event);
    this.router.navigate([`student-list/student-details/${event.studentId}`])
  }
}
