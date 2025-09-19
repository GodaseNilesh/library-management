import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from '../Shared/shared.module';
import { CreateStudentComponent } from './create-student/create-student.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    StudentListComponent,
    StudentDetailsComponent,
    CreateStudentComponent,
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
  ],
})
export class StudentModule {}
