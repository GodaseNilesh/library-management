import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { CreateTeacherComponent } from './create-teacher/create-teacher.component';
import { TeacherDetailsComponent } from './teacher-details/teacher-details.component';

const routes: Routes = [
  {
    path:'',
    component:TeacherListComponent
  },
  {
    path:'create-teacher',
    component:CreateTeacherComponent
  },
  {
    path:'create-teacher/:id',
    component:CreateTeacherComponent
  },
  {
    path:'teacher-details/:id',
    component:TeacherDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersRoutingModule { }
