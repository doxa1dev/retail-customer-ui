import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DialogLoginComponent  implements OnInit {
  public confirmMessage: string;
  public buttonLeftText: string;
  public buttonRightText: string;
  /**
  * Constructor
  *
  * @param {MatDialogRef<DialogLoginComponent>} dialogRef
  */


   constructor(public dialogRef: MatDialogRef<DialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      if (data) {
        // this.title = data.title || this.title;
        this.confirmMessage = data.confirmMessage || this.confirmMessage;
        this.buttonLeftText = data.buttonLeftText || this.buttonLeftText;
        this.buttonRightText = data.buttonRightText || this.buttonRightText;
      }
    }


  ngOnInit(): void {
    
  }

}
