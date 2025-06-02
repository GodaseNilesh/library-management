import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { CreateStudentComponent } from './create-student/create-student.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { authGuardGuard } from 'src/app/auth-guards/auth-guard.guard';

const routes: Routes = [
  {
    canActivate: [authGuardGuard],
    path: '',
    component: StudentListComponent,
  },
  {
    canActivate: [authGuardGuard],
    path: 'create-student',
    component: CreateStudentComponent,
  },
  {
    canActivate: [authGuardGuard],
    path: 'create-student/:id',
    component: CreateStudentComponent,
  },
  {
    canActivate: [authGuardGuard],
    path: 'student-details/:id',
    component: StudentDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
