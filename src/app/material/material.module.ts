import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


const components: any = [
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatSelectModule,
  MatListModule,
  MatExpansionModule,
  MatTableModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressSpinnerModule
];
@NgModule({
  declarations: [],
  imports: [CommonModule, components],
  exports: [components],
})
export class MaterialModule {}
