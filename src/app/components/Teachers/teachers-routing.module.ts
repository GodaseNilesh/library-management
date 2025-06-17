import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { CreateTeacherComponent } from './create-teacher/create-teacher.component';
import { TeacherDetailsComponent } from './teacher-details/teacher-details.component';
import { authGuardGuard } from 'src/app/auth-guards/auth-guard.guard';

const routes: Routes = [
  {
    canActivate: [authGuardGuard],
    path:'',
    component:TeacherListComponent
  },
  {
    canActivate: [authGuardGuard],
    path:'create-teacher',
    component:CreateTeacherComponent
  },
  {
    canActivate: [authGuardGuard],
    path:'create-teacher/:id',
    component:CreateTeacherComponent
  },
  {
    canActivate: [authGuardGuard],
    path:'teacher-details/:id',
    component:TeacherDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersRoutingModule { }
