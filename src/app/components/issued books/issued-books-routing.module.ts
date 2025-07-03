import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookIssueHistoryComponent } from './book-issue-history/book-issue-history.component';
import { CreateBookIssueComponent } from './create-book-issue/create-book-issue.component';
import { authGuardGuard } from 'src/app/auth-guards/auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: BookIssueHistoryComponent,
    canActivate: [authGuardGuard],
  },
  {
    path: 'create-book-issue',
    component: CreateBookIssueComponent,
    canActivate: [authGuardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssuedBooksRoutingModule {}
