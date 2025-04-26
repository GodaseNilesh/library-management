import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeachersRoutingModule } from './teachers-routing.module';
import { CreateTeacherComponent } from './create-teacher/create-teacher.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { TeacherDetailsComponent } from './teacher-details/teacher-details.component';
import { SharedModule } from '../Shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CreateTeacherComponent,
    TeacherListComponent,
    TeacherDetailsComponent
  ],
  imports: [
    CommonModule,
    TeachersRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TeachersModule { }
