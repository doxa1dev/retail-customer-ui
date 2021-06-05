import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dialog-confirm-naep',
  templateUrl: './dialog-confirm-naep.component.html',
  styleUrls: ['./dialog-confirm-naep.component.scss']
})
export class DialogConfirmNaepComponent implements OnInit {

  public title: string;
  public confirmMessage: string;
  public buttonLeftText: string;
  public buttonRightText: string;
  public messageTermsConditions: boolean = false;
  companyName = environment.companyInfo.id;

  constructor(public dialogRef: MatDialogRef<DialogConfirmNaepComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      if (data) {
        this.title = data.title || this.title;
        this.confirmMessage = data.confirmMessage || this.confirmMessage;
        this.buttonLeftText = data.buttonLeftText || this.buttonLeftText;
        this.buttonRightText = data.buttonRightText || this.buttonRightText;
        this.messageTermsConditions = data.messageTermsConditions || this.messageTermsConditions;
      }
    }

  ngOnInit(): void {
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
