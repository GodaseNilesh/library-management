import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from '../Shared/shared.module';

@NgModule({
  declarations: [StudentListComponent, StudentDetailsComponent],
  imports: [CommonModule, StudentRoutingModule, MaterialModule,SharedModule],
})
export class StudentModule {}
