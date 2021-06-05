import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-copy-link',
  templateUrl: './dialog-copy-link.component.html',
  styleUrls: ['./dialog-copy-link.component.scss']
})
export class DialogCopyLinkComponent {

  public confirmMessage: string;

  /**
  * Constructor
  *
  * @param {MatDialogRef<DialogCopyLinkComponent>} dialogRef
  */

  constructor(public dialogRef: MatDialogRef<DialogCopyLinkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data) {
        this.confirmMessage = data.message || this.confirmMessage;
      }
    }
}
