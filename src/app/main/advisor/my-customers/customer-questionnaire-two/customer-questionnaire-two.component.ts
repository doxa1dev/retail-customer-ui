import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Title } from 'app/core/enum/title';
import { ActivatedRoute } from '@angular/router';
import { MyCustomersService } from 'app/core/service/my-customers.service';
import { Location } from '@angular/common';
import { Q1_DATA, Q3_DATA, Q4_DATA, Q5_DATA } from 'app/core/constants/constant';

@Component({
  selector: 'app-customer-questionnaire-two',
  templateUrl: './customer-questionnaire-two.component.html',
  styleUrls: ['./customer-questionnaire-two.component.scss']
})
export class CustomerQuestionnaireTwoComponent implements OnInit {

  uuid: string;
  version1 = environment.questionnaireOneVersion;
  version2 = environment.questionnaireTwoVersion;
  title = Title.LEFT;
  q1Data = Q1_DATA;
  answerQ1: string = '';
  answerQ2: string = '';
  q3Data = Q3_DATA;
  answerQ3: string = '';
  q4Data = Q4_DATA;
  answerQ4: string = '';
  q5Data = Q5_DATA;
  answerQ5: string = '';
  
  constructor(private activatedRoute: ActivatedRoute,
    private location : Location,
    private customerService: MyCustomersService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.uuid = params.uuid;
    });

    this.customerService.getCustomerQuestionnaire(this.uuid, this.version1, this.version2).subscribe(
      data => {
        
        this.answerQ1 = this.getDataAnswer(this.answerQ1, data.questionnaireTwo.q1, this.q1Data);
        this.answerQ2 = data.questionnaireTwo.q2;
        this.answerQ3 = this.getDataAnswer(this.answerQ3, data.questionnaireTwo.q3, this.q3Data);
        this.answerQ4 = this.q4Data[Number(data.questionnaireTwo.q4) - 1].text;
        this.answerQ5 = this.q5Data[Number(data.questionnaireTwo.q5) - 1].text;
      }
    )
  }

  getDataAnswer(answer, dataAnswer, dataQuestion) {
    dataAnswer.split(',').forEach((element, index) => {
      if (dataAnswer.split(',').length - 1 === index) {
        answer += dataQuestion[element].text
      } else {
        answer += dataQuestion[element].text + ", ";
      }
    })

    return answer;
  }

  back(){
    this.location.back();
  }

}
