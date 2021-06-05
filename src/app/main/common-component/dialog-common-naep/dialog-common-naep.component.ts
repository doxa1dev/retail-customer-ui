import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-common-naep',
  templateUrl: './dialog-common-naep.component.html',
  styleUrls: ['./dialog-common-naep.component.scss']
})
export class DialogCommonNaepComponent implements OnInit {

  public title: string;
  public message: string;
  public message2: string;
  public buttonText: string;
  public buttonColor: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogCommonNaepComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      if (data) {
        this.title = data.title || this.title;
        this.message = data.message || this.message;
        this.message2 = data.message2 || this.message2;
        this.buttonText = data.buttonText || this.buttonText;
        this.buttonColor = data.buttonColor || this.buttonColor;
      }
    }

  ngOnInit(): void {
  }

}
