import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dialog-image',
  templateUrl: './dialog-image.component.html',
  styleUrls: ['./dialog-image.component.scss']
})
export class DialogImageComponent implements OnInit {

  public image: string;
  public title: string;
  public message1: string;
  public message2: string;

  constructor(public dialogRef: MatDialogRef<DialogImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      if (data)
      {
        this.image = data.image || this.image;
        this.title = data.title || this.title;
        this.message1 = data.message1 || this.message1;
        this.message2 = data.message2 || this.message2;
      }
    }

  ngOnInit(): void {
  }

}
