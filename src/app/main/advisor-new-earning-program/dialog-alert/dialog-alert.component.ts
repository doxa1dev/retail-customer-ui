import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-alert',
  templateUrl: './dialog-alert.component.html',
  styleUrls: ['./dialog-alert.component.scss']
})
export class DialogAlertComponent implements OnInit {

  public confirmMessage: string;
  public type : string;
  public title : string;

  constructor(public dialogRef: MatDialogRef<DialogAlertComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data)
    {
      this.confirmMessage = data.message || this.confirmMessage;
      this.type = data.type || this.type;
      this.title = data.title || this.title;
    }
  }

  ngOnInit(): void {
  }

}
