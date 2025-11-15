import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuardGuard } from './auth-guards/auth-guard.guard';

const routes: Routes = [
  {
    path:'',
    component:LoginComponent
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
    loadChildren:()=>import('src/app/components/users/user.module').then(m=>m.UserModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
