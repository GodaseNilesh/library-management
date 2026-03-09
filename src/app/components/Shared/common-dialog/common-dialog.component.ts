import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.css']
})
export class CommonDialogComponent {

  readonly dialogRef = inject(MatDialogRef<CommonDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  onCancelClick(): void {
    this.dialogRef.close('cancel');
  }
  onConfirmClick(status: string) {
    this.dialogRef.close(status);
  }
}
