import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { SharedModule } from './components/Shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { PendingRequestsComponent } from './components/admin/pending-requests/pending-requests.component';
import { ReportsComponent } from './components/admin/reports/reports.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { FinesComponent } from './components/admin/fines/fines.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent, PendingRequestsComponent, ReportsComponent, FinesComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    NgOtpInputModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    NgApexchartsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
