import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login-new.component.html',
  styleUrls: ['./dialog-login-new.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DialogLoginNewComponent {

  /**
  * Constructor
  *
  * @param {MatDialogRef<DialogLoginNewComponent>} dialogRef
  */

  constructor(public dialogRef: MatDialogRef<DialogLoginNewComponent>) { }

}
