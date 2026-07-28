import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { authGuardGuard } from './auth-guards/auth-guard.guard';
import { loginGuard } from './auth-guards/login.guard';
import { PendingRequestsComponent } from './components/admin/pending-requests/pending-requests.component';
import { ReportsComponent } from './components/admin/reports/reports.component';

const routes: Routes = [
  {
    path:'',
    component:LoginComponent,
    canActivate:[loginGuard]
  },
  // {
  //   path:'',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full'
  // },
  {
    canActivate: [authGuardGuard],
    path:'dashboard',
    component:DashboardComponent
  },
   {
    canActivate: [authGuardGuard],
    path:'pending-requests',
    component:PendingRequestsComponent
  },
  {
    canActivate: [authGuardGuard],
    path:'reports',
    component:ReportsComponent
  },
  {
    path:'student-list',
    loadChildren:()=>import('src/app/components/Students/student.module').then(m=>m.StudentModule)
  },
  {
    path:'teacher-list',
    loadChildren:()=>import('src/app/components/Teachers/teachers.module').then(m=>m.TeachersModule)
  },
  {
    path:'book-list',
    loadChildren:()=>import('src/app/components/books/book.module').then(m=>m.BookModule)
  },
  {
    path:'issue-book-history',
    loadChildren:()=>import('src/app/components/issued books/issued-books.module').then(m=>m.IssuedBooksModule)
  },
  {
    path:'users-list',
    loadChildren:()=>import('src/app/components/admin/users/user.module').then(m=>m.UserModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
