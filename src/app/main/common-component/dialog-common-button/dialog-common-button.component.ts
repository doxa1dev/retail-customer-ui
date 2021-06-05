import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dialog-common-button',
  templateUrl: './dialog-common-button.component.html',
  styleUrls: ['./dialog-common-button.component.scss']
})
export class DialogCommonButtonComponent {

  public title: string;
  public message: string;
  public message2: string;
  public buttonText: string;
  public buttonColor: boolean = false;
  public messageTermsConditions: boolean = false;
  companyName = environment.companyInfo.id;

  constructor(public dialogRef: MatDialogRef<DialogCommonButtonComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      if (data) {
        this.title = data.title || this.title;
        this.message = data.message || this.message;
        this.message2 = data.message2 || this.message2;
        this.buttonText = data.buttonText || this.buttonText;
        this.buttonColor = data.buttonColor || this.buttonColor;
        this.messageTermsConditions = data.messageTermsConditions || this.messageTermsConditions;
      }
    }

  viewTermsConditions() {
    if (this.companyName === 'SG') {
      let url = this.router.serializeUrl(this.router.createUrlTree(['naep-terms-conditions-sg']));
      window.open(url, '_blank');
    } else if (this.companyName === 'MY') {
      let url = this.router.serializeUrl(this.router.createUrlTree(['naep-terms-conditions-my']))
      window.open(url, '_blank')
    }
  }
}
