import { Component, OnInit } from '@angular/core';
import { MyCustomersService } from 'app/core/service/my-customers.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'environments/environment';
import { Title } from 'app/core/enum/title';
import { P2_Q1, P2_Q2, P2_Q3, P2_Q4, P2_Q5, P2_Q6, P2_Q7, P2_Q8 } from 'app/core/constants/constant';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-customer-questionnaire-one',
  templateUrl: './customer-questionnaire-one.component.html',
  styleUrls: ['./customer-questionnaire-one.component.scss']
})
export class CustomerQuestionnaireOneComponent implements OnInit {

  uuid: string;
  version1 = environment.questionnaireOneVersion;
  version2 = environment.questionnaireTwoVersion;
  title = Title.LEFT;
  p2q1 = P2_Q1;
  answerP2Q1: string = '';
  p2q2 = P2_Q2;
  answerP2Q2: string = '';
  answerP2Text: string;
  p2q3 = P2_Q3;
  answerP2Q3: string = '';
  p2q4 = P2_Q4;
  answerP2Q4: string = '';
  p2q5 = P2_Q5;
  answerP2Q5: string = '';
  p2q6 = P2_Q6;
  answerP2Q6: string = '';
  p2q7 = P2_Q7;
  answerP2Q7: string = '';
  p2q8 = P2_Q8;
  answerP2Q8: string = '';
  answerP8Text: string;

  constructor(private activatedRoute: ActivatedRoute,
    private location : Location,
    private customerService: MyCustomersService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.uuid = params.uuid;
    });

    this.customerService.getCustomerQuestionnaire(this.uuid, this.version1, this.version2).subscribe(
      data => {

        this.answerP2Q1 = this.getDataAnswer(this.answerP2Q1, data.questionnaireOne.p2q1, this.p2q1);
        this.answerP2Q2 = this.getDataAnswer(this.answerP2Q2, data.questionnaireOne.p2q2, this.p2q2);
        this.answerP2Q3 = this.getDataAnswer(this.answerP2Q3, data.questionnaireOne.p2q3, this.p2q3);
        this.answerP2Q6 = this.getDataAnswer(this.answerP2Q6, data.questionnaireOne.p2q6, this.p2q6);
        this.answerP2Q7 = this.getDataAnswer(this.answerP2Q7, data.questionnaireOne.p2q7, this.p2q7);
        this.answerP2Q8 = this.getDataAnswer(this.answerP2Q8, data.questionnaireOne.p2q8, this.p2q8);

        if (!isNullOrUndefined(data.questionnaireOne.p2q2Text)) {
          this.answerP2Text = data.questionnaireOne.p2q2Text
        }

        if (!isNullOrUndefined(data.questionnaireOne.p2q8Text)) {
          this.answerP8Text = data.questionnaireOne.p2q8Text
        }

        this.answerP2Q4 = this.p2q4[Number(data.questionnaireOne.p2q4) - 1].text;
        this.answerP2Q5 = this.p2q5[Number(data.questionnaireOne.p2q5) - 1].text;
      }
    )
  }

  getDataAnswer(answer, dataAnswer, dataQuestion) {
    dataAnswer.split(',').forEach((element, index) => {
      if (dataAnswer.split(',').length - 1 === index) {
        answer += dataQuestion[element].text;
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
