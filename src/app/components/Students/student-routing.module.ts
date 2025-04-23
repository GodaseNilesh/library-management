import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { CreateStudentComponent } from './create-student/create-student.component';
import { StudentDetailsComponent } from './student-details/student-details.component';

const routes: Routes = [
  {
    path:'',
    component:StudentListComponent
  },
  {
    path:'create-student',
    component:CreateStudentComponent
  },
  {
    path: 'create-student/:id',
    component: CreateStudentComponent
  },
  {
    path: 'student-details/:id',
    component: StudentDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
