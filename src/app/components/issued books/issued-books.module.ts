import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssuedBooksRoutingModule } from './issued-books-routing.module';
import { BookIssueHistoryComponent } from './book-issue-history/book-issue-history.component';
import { CreateBookIssueComponent } from './create-book-issue/create-book-issue.component';
import { SharedModule } from '../Shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BookIssueHistoryComponent, CreateBookIssueComponent],
  imports: [
    CommonModule,
    IssuedBooksRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class IssuedBooksModule {}
