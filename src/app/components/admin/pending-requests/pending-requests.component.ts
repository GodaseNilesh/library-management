import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/Services/user.service';
import { CommonDialogComponent } from '../../Shared/common-dialog/common-dialog.component';
import { AdminService } from 'src/app/Services/admin.service';
import { PendingRequest } from 'src/app/models/user.model';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.css'],
})
export class PendingRequestsComponent {
  requestData: PendingRequest[] = [];
  requestsDataColumns = [
    { columnDef: 'fullName', header: 'Full Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'userRole', header: 'User Role' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'formattedCreatedAt', header: 'Requested At' },
    { columnDef: 'action', header: 'Action' },
  ];

  requestsDisplayedColumns = this.requestsDataColumns.map((c) => c.columnDef);
  requestsDataSource = this.requestData;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.userService.getPendingRegistrationRequests().subscribe((res: PendingRequest[]) => {
      this.requestData = res;
      this.requestData = this.requestData.map((x: PendingRequest) => {
        return {
          ...x,
          action: 'approve,reject',
          formattedCreatedAt: this.formatDate(x.createdAt),
        }
      });
      this.requestsDisplayedColumns = this.requestsDataColumns.map(
        (c) => c.columnDef,
      );
      this.requestsDataSource = this.requestData;
      this.isLoading = false;
    });
  }

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();

    if (value === '') {
      this.requestsDataSource = [...this.requestData];
    } else {
      const filtered = this.requestData.filter((request) =>
        Object.values(request).some((val) =>
          val.toString().toLowerCase().includes(value),
        ),
      );
      this.requestsDataSource = [...filtered];
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  onRejectClicked(row: PendingRequest) {
    this.isLoading = true;
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      disableClose: true,
      data: {
        status: 'Confirm!',
        message: 'Are you sure you want to approve this user request?',
        action: {
          cancel: true,
          reject: true,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'reject') {
        const payload = { status: 'rejected' };
        this.adminService
          .updatePendingRequestStatus(row.userId, payload)
          .subscribe((res) => {
            this.loadData();
          });
      } else {
        this.isLoading = false;
      }
    });
  }

  onApproveClicked(row: PendingRequest) {
    this.isLoading = true;
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      disableClose: true,
      data: {
        status: 'Confirm!',
        message: 'Are you sure you want to approve this user request?',
        action: {
          cancel: true,
          approve: true,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'approve') {
        const payload = { status: 'approved' };
        this.adminService
          .updatePendingRequestStatus(row.userId, payload)
          .subscribe((res) => {
            this.loadData();
          });
      } else {
        this.isLoading = false;
      }
    });
  }
}
