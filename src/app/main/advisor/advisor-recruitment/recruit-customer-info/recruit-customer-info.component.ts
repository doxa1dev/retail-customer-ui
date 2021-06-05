import { Component, NgZone, OnInit } from '@angular/core';
import { Title} from 'app/core/enum/title';
import { NAEPStatus, RecruitEnum} from 'app/core/enum/recruit';
import { NaepService} from 'app/core/service/naep.service';
import { Naep} from 'app/core/models/naep.model';
import { ActivatedRoute, Router} from '@angular/router'
import * as moment from "moment";
import { QuestionnaireNaepService } from 'app/core/service/questionnaire-naep.service';
import { QuestionnaireNaep } from 'app/core/models/questionnaire-naep.model';

@Component({
  selector: 'app-recruit-customer-info',
  templateUrl: './recruit-customer-info.component.html',
  styleUrls: ['./recruit-customer-info.component.scss']
})
export class RecruitCustomerInfoComponent implements OnInit {

  title = Title.DOT;
  sale_in_process = NAEPStatus.PROCESS;
  sale_completed = NAEPStatus.COMPLETED;
  sale_failed = NAEPStatus.FAILED;
  dataReturn: any;
  recruit_status_pending  = RecruitEnum.PENDING;
  recruit_status_approved = RecruitEnum.APPROVED;
  recruit_status_rejected = RecruitEnum.REJECTED;
  total : number;
  timeTo45Days ;
  timeToEndDays : number;
  FastAndFuriusDay: Date ;
  uuid : string;
  buttonNameNAEP = "View Induction Form"
  checkNaepType: boolean = false;
  dataNaepTypeSort = [];
  daysLeftEndDay: number = 0;
  dataNaepForm: QuestionnaireNaep;
  loading: boolean = true; 
  constructor(
    private naepService : NaepService,
    private router : Router,
    private activedRoute: ActivatedRoute,
    private questionNaepService: QuestionnaireNaepService,
    private ngZone: NgZone
  ) {
    this.activedRoute.queryParams.subscribe( param =>{
      this.uuid = param.uuid;
    })
   }

  ngOnInit(): void {
    this.naepService.getCustomerNaepInfomationByAdvisor(this.uuid).subscribe((data)=>{
  
      this.dataReturn = data;
     
      if (this.dataReturn.status === "COMPLETED") {

        if (this.dataReturn.naepTypeArr.length === 1) {
          this.checkNaepType = true;

          let now = moment(moment(new Date()).format("YYYY-MM-DD"), "YYYY-MM-DD");
          let endDay = moment(moment(this.dataReturn.endTime).format("YYYY-MM-DD"), "YYYY-MM-DD");
          this.daysLeftEndDay = moment.duration(endDay.diff(now)).asDays();

        } else {
          this.checkNaepType = false;

          let type = this.dataReturn.naepTypeArr.sort((a, b) => Number(b.period_length) - Number(a.period_length));

          let valueMax = Math.max.apply(Math, type.map(data => Number(data.period_length)));
          this.dataNaepTypeSort = type.filter(naep => Number(naep.period_length) < valueMax);

          let listNaep = [];
          let now = moment(moment(new Date()).format("YYYY-MM-DD"), "YYYY-MM-DD");
          let endDay = moment(moment(this.dataReturn.endTime).format("YYYY-MM-DD"), "YYYY-MM-DD");
          this.daysLeftEndDay = moment.duration(endDay.diff(now)).asDays();

          this.dataNaepTypeSort.forEach(item => {

            let naepDay = new NaepDay();
            
            naepDay.name = item.name;
            // naepDay.dateNaep = endDay.subtract(Number(item.periodLength), 'days').format("YYYY-MM-DD");
            naepDay.dateNaep = moment(item.end_type_date).format("YYYY-MM-DD");
            let datePeriod = moment(moment(naepDay.dateNaep).format("YYYY-MM-DD"), "YYYY-MM-DD");
            naepDay.daysLeft = moment.duration(datePeriod.diff(now)).asDays();
  
            listNaep.push(naepDay)
          })
  
          this.dataNaepTypeSort = listNaep;
        }
      }
    });

    this.naepService.checkIsBuyNaep().subscribe(data=>{
      this.total = data;
    }) 
  

  }
  
  goToNaepForm(uuid){
  
   this.router.navigate(['/advisor-earning-program/form-view'], {
      queryParams: { uuid: uuid },
    })

  }
}

export class NaepDay {
  name: string;
  daysLeft: number;
  dateNaep: string;
}
