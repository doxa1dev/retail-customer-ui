import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from 'app/core/enum/title';
import { Naep } from 'app/core/models/naep.model';
import { NaepService } from 'app/core/service/naep.service';

@Component({
  selector: 'app-select-advisor',
  templateUrl: './select-advisor.component.html',
  styleUrls: ['./select-advisor.component.scss']
})
export class SelectAdvisorComponent implements OnInit {

  dataNaep : Naep;
  title = Title.LEFT;
  advisorId: string;
  
  constructor(private naepService : NaepService,
    private router : Router) { }

  ngOnInit(): void {
    this.naepService.getListInviteAdvisor().subscribe(
      data => {
        this.dataNaep = data;
        this.advisorId = this.dataNaep[0].recruiterCustomer.id;

      }
    )
  }

  goToApplyForm(){
    if(this.dataNaep[0].status2 === "SUBMIT")
    {
      this.router.navigate(["/advisor-earning-program/apply-new-advior-earning-program"])
    }else if(this.dataNaep[0].status2 === "APPLY")
    {
      this.router.navigate(['/advisor-earning-program/buy-packet-naep'])
    }
  }

  changeAdvisor(event) {
    this.advisorId = event.value;
  }

}
