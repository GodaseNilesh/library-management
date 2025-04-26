import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  // {
  //   path:'',
  //   component:LoginComponent
  // },
  {
    path:'',
    redirectTo: 'dashboard',
    pathMatch: 'full' 
  },
  {
    path:'dashboard',
    component:DashboardComponent
  },
  {
    path:'student-list',
    loadChildren:()=>import('src/app/components/Students/student.module').then(m=>m.StudentModule)
  },
  {
    path:'teacher-list',
    loadChildren:()=>import('src/app/components/Teachers/teachers.module').then(m=>m.TeachersModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
