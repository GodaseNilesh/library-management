import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookListComponent } from './book-list/book-list.component';
import { AddBooksComponent } from './add-books/add-books.component';
import { SharedModule } from '../Shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BookListComponent,
    AddBooksComponent
  ],
  imports: [
    CommonModule,
    BookRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BookModule { }
