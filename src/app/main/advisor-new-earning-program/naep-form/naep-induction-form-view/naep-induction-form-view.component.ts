import { isEmpty } from 'lodash';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Q3_NAEP, Q4A_NAEP, Q4_NAEP, Q5_NAEP } from 'app/core/constants/constant';
import { Title } from 'app/core/enum/title';
import { NaepPartnerInductionFormDetail, ResponseQuestionNewPartner } from 'app/core/models/naep.model';
import { QuestionnaireNaep } from 'app/core/models/questionnaire-naep.model';
import { QuestionnaireNaepService } from 'app/core/service/questionnaire-naep.service';

@Component({
  selector: 'app-naep-induction-form-view',
  templateUrl: './naep-induction-form-view.component.html',
  styleUrls: ['./naep-induction-form-view.component.scss']
})
export class NaepInductionFormViewComponent implements OnInit {
  uuid : string;
  constructor(
    private router: Router,
    private questionNaepService: QuestionnaireNaepService,
    private activedRoute: ActivatedRoute
  ) {
    this.activedRoute.queryParams.subscribe( param =>{
      this.uuid = param.uuid;
    })

   }

  q3data = Q3_NAEP;
  q4data = Q4_NAEP;
  q4adata = Q4A_NAEP;
  q5data = Q5_NAEP;

  partnerInductionDetail: NaepPartnerInductionFormDetail = new NaepPartnerInductionFormDetail();
  newPartnerDetail: ResponseQuestionNewPartner = new ResponseQuestionNewPartner();
  dateAcknowledgement: Date = new Date();
  title = Title.LEFT;
  dataNaepForm: QuestionnaireNaep;
  loading: boolean = true; 
  is_answer: boolean = false ;
   isEmpty : boolean = false;
  ngOnInit(): void {

    if(!CheckNullOrUndefinedOrEmpty(this.uuid)) {
      this.questionNaepService.getNaepIntroductionFormByUuid(this.uuid).subscribe(
        data => {
          
            this.dataNaepForm = data; 
          if(JSON.stringify(data) === '{}' || CheckNullOrUndefinedOrEmpty(data)  || 
          CheckNullOrUndefinedOrEmpty(data.questionnaireNaepApprove)
          || data.questionnaireNaepApprove.is_answer === false 
          ){
            this.isEmpty = true;
          }
          this.loading = false;
        })
    }
     else {
      this.questionNaepService.getNaepIntroductionForm().subscribe(
        data => {
          this.dataNaepForm = data;
          this.loading = false;
        })
    }
  }

}
