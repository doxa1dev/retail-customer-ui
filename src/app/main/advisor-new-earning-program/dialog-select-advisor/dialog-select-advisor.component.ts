import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Naep } from 'app/core/models/naep.model';

@Component({
  selector: 'app-dialog-select-advisor',
  templateUrl: './dialog-select-advisor.component.html',
  styleUrls: ['./dialog-select-advisor.component.scss']
})
export class DialogSelectAdvisorComponent implements OnInit {

  public confirmMessage: string;
  public title: string;
  public dataAdvisor: Naep;
  advisorID: string;

  constructor(
    private router : Router,
    public dialogRef: MatDialogRef<DialogSelectAdvisorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(data){
        this.confirmMessage = data.message || this.confirmMessage;
        this.title = data.title || this.title;
        this.dataAdvisor = data.dataAdvisor || this.dataAdvisor;
      }
    }

  ngOnInit(): void {
    this.advisorID = this.dataAdvisor[0].recruiterCustomer.advisor_id_number;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedAdvisor(event) {
    this.advisorID = event.value.recruiterCustomer.advisor_id_number;
  }

  confirmAdvisor() {
    if(this.dataAdvisor[0].status === "SUBMIT")
    {
      this.router.navigate(["/advisor-earning-program/apply-new-advior-earning-program"], {queryParams: {advisorID: this.advisorID}})
    }else if(this.dataAdvisor[0].status === "APPLY")
    {
      this.router.navigate(['/advisor-earning-program/buy-packet-naep'])
    }

    this.dialogRef.close();
  }

}
