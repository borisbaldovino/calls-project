import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-message',
    templateUrl: 'dialog-message.component.html',
  })
  export class DialogMessageComponent {
    constructor(
      public dialogRef: MatDialogRef<DialogMessageComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }