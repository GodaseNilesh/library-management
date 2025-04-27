import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { AddBooksComponent } from './add-books/add-books.component';

const routes: Routes = [
  {
    path:'',
    component:BookListComponent
  },
  {
    path:'add-book',
    component:AddBooksComponent
  },
  {
    path:'add-book/:id',
    component:AddBooksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
