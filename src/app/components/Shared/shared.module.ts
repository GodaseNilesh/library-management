import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import { MaterialModule } from 'src/app/material/material.module';
import { TableComponent } from './table/table.component';

const components = [SidenavbarComponent,TableComponent];
@NgModule({
  declarations: [components],
  imports: [CommonModule, SharedRoutingModule, MaterialModule],
  exports: [components],
})
export class SharedModule {}
