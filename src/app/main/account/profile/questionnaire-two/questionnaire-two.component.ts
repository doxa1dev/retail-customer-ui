import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as helper from '../_helper/helper-fn';

import { environment } from '../../../../../environments/environment';

import { QuestionnaireService } from '../../../../core/service/questionnaire.service';

import { QueryFormTwo } from '../../../../core/models/query-form-two.model';
import { isNullOrUndefined } from 'util';
import { AuthService } from 'app/core/service/auth.service';
import { QuestionTwo } from 'app/core/models/question-two';
import { Title } from 'app/core/enum/title';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogLoginComponent } from 'app/main/common-component/dialog-login/dialog-login.component';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';

@Component({
  selector: 'app-questionnaire-two',
  templateUrl: './questionnaire-two.component.html',
  styleUrls: ['./questionnaire-two.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionnaireTwoComponent implements OnInit {
  queryForm: FormGroup;
  text1: string;
  q1data = [
    { id: 1, text: 'Technology' },
    { id: 2, text: "Auto cooking/Auto washing" },
    { id: 3, text: "Faster, easier cooking" },
    { id: 4, text: "Multi-function" },
    { id: 5, text: "Easier and healthier cooking" },
    { id: 6, text: "I can cook too" },
    { id: 7, text: "My family can cook too" },
  ];
  q3data = [
    { id: 1, text: "Weekdays" },
    { id: 2, text: "Weekends" },
    { id: 3, text: "Day Time" },
    { id: 4, text: "Afternoon/Evening" },
  ];
  q4data = [
    { id: 1, text: "Full payment with gift" },
    { id: 2, text: "Financing" },
  ];
  q5data = [
    { id: 1, text: "Yes" },
    { id: 2, text: "No" },
  ];

  checkToken: boolean = true;
  tokenParam: string;

  version: string;
  questionTwo = new QuestionTwo();
  title = Title.DOT;
  advisor_id : string;

  constructor(
    private _formBuilder: FormBuilder,
    private _questionnaireService: QuestionnaireService,
    private _router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    public dialog: MatDialog,

  ) {

  }

  ngOnInit(): void {
    // console.log(this.getTranslation('QUESTIONNAIRE_2.TECHNOLOGY'))
    this.queryForm = this._formBuilder.group({
      q1: new FormArray([], helper.minSelectedCheckboxesValidator(1)),
      q2: ['', Validators.required],
      q3: new FormArray([], helper.minSelectedCheckboxesValidator(1)),
      q4: [, Validators.required],
      q5: [, Validators.required],
    });

    let token = localStorage.getItem('token')
    let decrypt: any
    let isRegistered
    this.activatedRoute.queryParams.subscribe((params) => {
      this.version = params.version;
      this.advisor_id = params.advisor_id;
      this.tokenParam = params.token
      if (!isNullOrUndefined(this.tokenParam)) {
        this.authService.decryptTokenData(this.tokenParam).subscribe(data => {
          decrypt = data
          if (!isNullOrUndefined(decrypt)) {
            this.authService.getCustomerByUuid(decrypt.public_id).subscribe(value => {
              isRegistered = value
              if (isNullOrUndefined(token) && isRegistered) {
                this._router.navigate(["/login"], { queryParams: { tokenParam: this.tokenParam } });
                return
              } else if(!isNullOrUndefined(token)) {
                this.checkToken = true
                this.getQuestion()
              } else if(!isRegistered && isNullOrUndefined(token)){
                this.checkToken = false
                this.getQuestion()
              }
            })
          }
        })
      }else{
        if(!isNullOrUndefined(token)) {
          // check is answer questionnaire 1:
          this._questionnaireService.checkIsAnswerQuestionnaireOne(this.version).subscribe(data=>{
            if(data.code === 200){
              this.getQuestion()
              this.renderAnswerQuestionnaire()
            }else if(data.code === 202)
            {
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:"You have to complete pre-demo questionaire before filling in post-demo questionaire",
                  title:"Alert",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(data =>
              {
                this._router.navigate(['/questionnaire/one'], { queryParams: {version: this.version , advisor_id : this.advisor_id}});
              })
            }
          })

          // this.checkToken = true
          
        } else{
          const dialogRefLogin = this.dialog.open(DialogLoginComponent, {
            width: '500px',
            maxWidth: '90vw',
            data: {
              buttonRightText: 'LOG IN'
            }
          });
    
          dialogRefLogin.afterClosed().subscribe( data => {
    
            if (data === 'signin') {
              this._router.navigate(["/login"], {queryParams : {returnUrl : this._router.url}});
            
            } else if (data === 'signup') {
    
              this._router.navigate(["/register"], {queryParams : {checkUrl : this._router.url}});
            } else {
              // this.active = false;
              // this.buttonName = 'Add to cart';
            }
          });
          return;
        }
      }
    });

    
    
  }

  renderAnswerQuestionnaire(){
    this._questionnaireService.getDataQuestionnaireTwo(this.version).subscribe(
      data => {
        if (!isNullOrUndefined(data)) {
          this.questionTwo = data;
          
          this.queryForm.setValue({
            q1: this.checkDataCheckBox(this.q1data, this.questionTwo.q1),
            q2: this.questionTwo.q2,
            q3: this.checkDataCheckBox(this.q3data, this.questionTwo.q3),
            q4: this.q4data[Number(this.questionTwo.q4) - 1].id,
            q5: this.q5data[Number(this.questionTwo.q5) - 1].id,
          })
        
        }
      }
    )
    helper.addCheckboxes(this.q1data.length, <FormArray> this.queryForm.controls.q1);
    helper.addCheckboxes(this.q3data.length, <FormArray> this.queryForm.controls.q3);
  }


  checkDataCheckBox(data, arrNumber) {
    let arr = [];
    
    for(let i = 0; i < data.length; i ++) {
      arr.push(false);

      arrNumber.split(',').forEach(element => {
        if (Number(element) === i) {
          arr[i] = true;
        } 
      });
    }

    return arr;
  }

  onSubmit() {
    const queryFormTwo: QueryFormTwo = new QueryFormTwo(
      helper.booleanArrayToIndicesString(this.queryForm.value.q1),
      this.queryForm.value.q2,
      helper.booleanArrayToIndicesString(this.queryForm.value.q3),
      this.queryForm.value.q4,
      this.queryForm.value.q5
    );
    if(queryFormTwo.q1 == "" || queryFormTwo.q2 == "" || queryFormTwo.q3 == "" || !queryFormTwo.q4 || !queryFormTwo.q5) {
      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:"Please complete all question.",
          title:"NOTIFICATION",
          colorButton: false
        },
      });
      return
    }
    this._questionnaireService.updateQuestionnaireTwo(environment.questionnaireTwoVersion, queryFormTwo, this.checkToken, this.tokenParam, this.advisor_id).subscribe(response => {
      if(this.checkToken){
        this._router.navigate(['/my-profile']);
      } else {
        this._router.navigate(['/store']);
      }
    });
  }

  private getQuestion(){
    this._questionnaireService.getQuestionnaireTwo(environment.questionnaireTwoVersion, this.checkToken, this.tokenParam).subscribe(response => {
      if (response.code === 200) {
        // this._router.navigate(["/questionnaire/two"]);
        const prevQuestionnaire: QueryFormTwo = response.questionnaire.answer;
        this.queryForm.patchValue({
          q2: prevQuestionnaire.q2,
          q4: parseInt(prevQuestionnaire.q4),
          q5: parseInt(prevQuestionnaire.q5),
        });

        helper.updateCheckboxes(prevQuestionnaire.q1.split(',').map(value => parseInt(value)).filter(val => !isNaN(val)), <FormArray> this.queryForm.controls.q1);
        helper.updateCheckboxes(prevQuestionnaire.q3.split(',').map(value => parseInt(value)).filter(val => !isNaN(val)), <FormArray> this.queryForm.controls.q3);
      }
      else {
        // this._router.navigate(["/login"]);
      }
    }, err => {
      console.log(err);
    });
  }
}
