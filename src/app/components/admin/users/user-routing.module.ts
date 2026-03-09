import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { authGuardGuard } from 'src/app/auth-guards/auth-guard.guard';

const routes: Routes = [
  {
    path:'',
    component:UserComponent,
    canActivate: [authGuardGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
