import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { AddBooksComponent } from './add-books/add-books.component';
import { authGuardGuard } from 'src/app/auth-guards/auth-guard.guard';
import { BookDetailsComponent } from './book-details/book-details.component';

const routes: Routes = [
  {
    canActivate: [authGuardGuard],
    path:'',
    component:BookListComponent
  },
  {
    canActivate: [authGuardGuard],
    path:'add-book',
    component:AddBooksComponent
  },
  {
    canActivate: [authGuardGuard],
    path:'add-book/:id',
    component:AddBooksComponent
  },
  {
    canActivate: [authGuardGuard],
    path:'book-details/:id',
    component:BookDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
