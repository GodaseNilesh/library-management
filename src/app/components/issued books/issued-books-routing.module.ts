import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookIssueHistoryComponent } from './book-issue-history/book-issue-history.component';
import { CreateBookIssueComponent } from './create-book-issue/create-book-issue.component';

const routes: Routes = [
  {
    path:'',
    component:BookIssueHistoryComponent
  },
  {
    path:'create-book-issue',
    component:CreateBookIssueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssuedBooksRoutingModule { }
