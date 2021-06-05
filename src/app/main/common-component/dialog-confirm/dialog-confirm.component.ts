import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Component, OnInit, Inject, ViewEncapsulation} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DialogConfirmComponent {


  public confirmMessage: string;
  public type : string;
  public title :string;
  public btnYes : string;
  public btnNo : string;
  public titleDialog : string;
  public classSuccess : boolean;

  is_have_class_success : boolean;
  /**
   * Constructor
   *
   * @param {MatDialogRef<DialogConfirmComponent>} dialogRef
   */
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {
    if (data)
    {
      this.confirmMessage = data.message || this.confirmMessage;
      this.type = data.type || this.type;
      this.title = data.title;
      this.btnNo = data.btnNo;
      this.btnYes = data.btnYes;
      this.titleDialog = !CheckNullOrUndefinedOrEmpty(data.titleDialog) ? data.titleDialog : "CONFIRM"
      this.is_have_class_success = !CheckNullOrUndefinedOrEmpty(data.classSuccess) ? true : false;
    }
  }

}
