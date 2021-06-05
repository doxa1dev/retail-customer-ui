import { MatDialog } from '@angular/material/dialog';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as helper from '../_helper/helper-fn';

import { environment } from '../../../../../environments/environment';

import { MyProfileService } from 'app/core/service/my-profile.service';
import { QuestionnaireService } from '../../../../core/service/questionnaire.service';

import { DialCodeComponent } from '../../authentication/dial-code/dial-code.component';

import { MyProfile } from 'app/core/models/my-profile.model';
import { QueryFormOne } from '../../../../core/models/query-form-one.model';
import { AuthService } from 'app/core/service/auth.service';
import { isNullOrUndefined } from 'util';
import { Title } from 'app/core/enum/title';
import { QuestionOne } from 'app/core/models/question-one';
import { USER_TYPE } from 'app/core/constants/constant';
import { DialogLoginComponent } from 'app/main/common-component/dialog-login/dialog-login.component';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';

@Component({
  selector: 'app-questionnaire-one',
  templateUrl: './questionnaire-one.component.html',
  styleUrls: ['./questionnaire-one.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionnaireOneComponent implements OnInit {

  ngAfterContentChecked() {

    this.cdref.detectChanges();

  }
  page: number;
  isPersonalInfoFilled: boolean;
  tokenParam: string
  queryForm: FormGroup;
  checkToken: boolean = true;

  userTypes = [
    { id: 1, text: "Host" },
    { id: 2, text: "Guest" },
  ];
  selectedDialCode: string = '93';
  p2q1data = [
    { id: 1, text: "Easy" },
    { id: 2, text: "Healthy" },
    { id: 3, text: "Fast" },
    { id: 4, text: "Economical" },
    { id: 5, text: "Avoiding Additives" },
  ];
  p2q2data = [
    { id: 1, text: "Convenient" },
    { id: 2, text: "Inconvenient" },
    { id: 3, text: "Variety of Choices" },
    { id: 4, text: "Costly" },
    { id: 5, text: "Unhealthy" },
    { id: 6, text: "Others" },
  ];
  p2q3data = [
    { id: 1, text: "Sauces" },
    { id: 2, text: "Bread" },
    { id: 3, text: "Jams" },
    { id: 4, text: "Soups" },
    { id: 5, text: "Yoghurt" },
    { id: 6, text: "Ice Creams" },
    { id: 7, text: "Juices" },
    { id: 8, text: "Pizzas" },
    { id: 9, text: "Cakes" },
  ];
  p2q4data = [
    { id: 1, text: "Daily" },
    { id: 2, text: "Rarely" },
    { id: 3, text: "1 to 3 Days" },
    { id: 4, text: "4 to 6 Days" },
  ];
  p2q5data = [
    { id: 1, text: "1" },
    { id: 2, text: "2" },
    { id: 3, text: "3 to 4" },
    { id: 4, text: "5 or more" },
  ];
  p2q6data = [
    { id: 1, text: "Breakfast" },
    { id: 2, text: "Lunch" },
    { id: 3, text: "Dinner" },
    { id: 4, text: "Desert" },
  ];
  p2q7data = [
    { id: 1, text: "Healthier" },
    { id: 2, text: "Saves money" },
    { id: 3, text: "Convenient" },
    { id: 4, text: "Gives me more control" },
    { id: 5, text: "Better food choices" },
    { id: 6, text: "Allows creativity" }
  ];
  p2q8data = [
    { id: 1, text: "No" },
    { id: 2, text: "Vegetarian" },
    { id: 3, text: "Gluten-Free" },
    { id: 4, text: "Diabetic" },
    { id: 5, text: "Lactose" },
    { id: 6, text: "Peanut Allergy" },
    { id: 7, text: "Intolerance" },
    { id: 8, text: "Others" },
  ];
  p2q9data = [
    { id: 1, text: "Yes" },
    { id: 2, text: "No" },
  ];
  p2q9dataModel = [
    { id: 1, text: "TM31" },
    { id: 2, text: "TM5" },
    { id: 3, text: "TM6" }
  ];

  title = Title.DOT;

  version: string;
  questionOne = new QuestionOne();
  is_show_model : boolean = false;
  advisor_id : string;
  constructor(
    private _formBuilder: FormBuilder,
    private _myprofileService: MyProfileService,
    private _questionnaireService: QuestionnaireService,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private cdref: ChangeDetectorRef,
    public dialog: MatDialog,

  
    
  ) { }

  @ViewChild(DialCodeComponent) dialCode: DialCodeComponent;

  ngOnInit(): void {

    this.page = 1;

    this.queryForm = this._formBuilder.group({
      p2q1: new FormArray([], helper.minSelectedCheckboxesValidator(1)),
      p2q2: new FormArray([], helper.minSelectedCheckboxesValidator(1)),
      p2q2Text: new FormControl({ value: '', disabled: true }, Validators.required),
      p2q3: new FormArray([], helper.minSelectedCheckboxesValidator(1)),
      p2q4: [, Validators.required],
      p2q5: [, Validators.required],
      p2q6: new FormArray([], helper.minSelectedCheckboxesValidator(1)),
      p2q7: new FormArray([], helper.minSelectedCheckboxesValidator(1)),
      p2q8: new FormArray([], helper.minSelectedCheckboxesValidator(1)),
      p2q8Text: new FormControl({ value: '', disabled: true }, Validators.required),
      p2q9: [, Validators.required],
      p2q9Model : []

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
                this.getQuestion(true)
                this.renderAnswerQuestionnaire()
              } else if(!isRegistered && isNullOrUndefined(token)){
                this.checkToken = false
                this.getQuestion(false)
              }
            })
          }
        })
      }else{
        if(!isNullOrUndefined(token)) {
          this.getQuestion(true)
          this.renderAnswerQuestionnaire()
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
    this._questionnaireService.getDataQuestionnaireOne(this.version).subscribe(
      data => {

        this.questionOne = data;
        if (!isNullOrUndefined(this.questionOne)) {
          // console.log(this.questionOne,'thach')
          this.queryForm.get('p2q1').setValue(this.checkDataCheckBox(this.p2q1data, this.questionOne.p2q1));
          this.queryForm.get('p2q2').setValue(this.checkDataCheckBox(this.p2q2data, this.questionOne.p2q2));
          this.queryForm.get('p2q2Text').setValue(this.questionOne.p2q2Text);
          this.queryForm.get('p2q3').setValue(this.checkDataCheckBox(this.p2q3data, this.questionOne.p2q3));
          !CheckNullOrUndefinedOrEmpty(this.p2q4data[Number(this.questionOne.p2q4) - 1]) ? this.queryForm.get('p2q4').setValue(this.p2q4data[Number(this.questionOne.p2q4) - 1].id) : null;
          !CheckNullOrUndefinedOrEmpty(this.p2q5data[Number(this.questionOne.p2q5) - 1]) ? this.queryForm.get('p2q5').setValue(this.p2q5data[Number(this.questionOne.p2q5) - 1].id) : null;
          this.queryForm.get('p2q6').setValue(this.checkDataCheckBox(this.p2q6data, this.questionOne.p2q6));
          this.queryForm.get('p2q7').setValue(this.checkDataCheckBox(this.p2q7data, this.questionOne.p2q7));
          this.queryForm.get('p2q8').setValue(this.checkDataCheckBox(this.p2q8data, this.questionOne.p2q8));
          if(!CheckNullOrUndefinedOrEmpty(this.questionOne.p2q9)){
            this.queryForm.get('p2q9').setValue(this.p2q9data[Number(this.questionOne.p2q9) - 1].id);
            if(Number(this.questionOne.p2q9) == 1)
            {
              this.is_show_model = true;
              this.queryForm.get('p2q9Model').setValue(this.p2q9dataModel[Number(this.questionOne.p2q9Model) - 1].id)
            }
          }
          this.queryForm.get('p2q8Text').setValue(this.questionOne.p2q8Text);
        }
        console.log(this.queryForm)
      }
    )

    helper.addCheckboxes(this.p2q1data.length, <FormArray> this.queryForm.controls.p2q1);
    helper.addCheckboxes(this.p2q2data.length, <FormArray> this.queryForm.controls.p2q2);
    helper.addCheckboxes(this.p2q3data.length, <FormArray> this.queryForm.controls.p2q3);
    helper.addCheckboxes(this.p2q6data.length, <FormArray> this.queryForm.controls.p2q6);
    helper.addCheckboxes(this.p2q7data.length, <FormArray> this.queryForm.controls.p2q7);
    helper.addCheckboxes(this.p2q8data.length, <FormArray> this.queryForm.controls.p2q8);

    this.queryForm['controls'].p2q2['controls'][this.p2q2data.length - 1].valueChanges.subscribe(val => {
      if (val === true) {
        this.queryForm['controls'].p2q2Text.enable();
      }
      else {
        this.queryForm['controls'].p2q2Text.setValue('');
        this.queryForm['controls'].p2q2Text.disable();
      }
    });

    this.queryForm['controls'].p2q8['controls'][0].valueChanges.subscribe(val => {
      if (val === true) {
        for (let i = 1; i < this.p2q8data.length; i++) {
          this.queryForm['controls'].p2q8['controls'][i].setValue(false);
          this.queryForm['controls'].p2q8['controls'][i].disable();
        }
        this.queryForm['controls'].p2q8Text.setValue('');
      }
      else {
        for (let i = 1; i < this.p2q8data.length; i++) {
          this.queryForm['controls'].p2q8['controls'][i].enable();
        }
      }
    });

    this.queryForm['controls'].p2q8['controls'][this.p2q8data.length - 1].valueChanges.subscribe(val => {
      if (val === true) {
        this.queryForm['controls'].p2q8Text.enable();
      }
      else {
        this.queryForm['controls'].p2q8Text.setValue('');
        this.queryForm['controls'].p2q8Text.disable();
      }
    });
  }

  onNextPage() {
    if (this.queryForm['controls'].name.valid
      && this.queryForm['controls'].email.valid
      && this.queryForm['controls'].address.valid
      && this.queryForm['controls'].postalCode.valid
      && this.queryForm['controls'].phoneNum.valid
    ) {
      this.selectedDialCode = this.dialCode.selectedDial == null ? '93' : this.dialCode.selectedDial;
      this.page = (this.page + 1) % 2;
      
      if (!isNullOrUndefined(this.questionOne)) {
        this.queryForm.get('p2q1').setValue(this.checkDataCheckBox(this.p2q1data, this.questionOne.p2q1));
        this.queryForm.get('p2q2').setValue(this.checkDataCheckBox(this.p2q2data, this.questionOne.p2q2));
        this.queryForm.get('p2q2Text').setValue(this.questionOne.p2q2Text);
        this.queryForm.get('p2q3').setValue(this.checkDataCheckBox(this.p2q3data, this.questionOne.p2q3));
        this.queryForm.get('p2q4').setValue(this.p2q4data[Number(this.questionOne.p2q4) - 1].id);
        this.queryForm.get('p2q5').setValue(this.p2q5data[Number(this.questionOne.p2q5) - 1].id);
        this.queryForm.get('p2q6').setValue(this.checkDataCheckBox(this.p2q6data, this.questionOne.p2q6));
        this.queryForm.get('p2q7').setValue(this.checkDataCheckBox(this.p2q7data, this.questionOne.p2q7));
        this.queryForm.get('p2q8').setValue(this.checkDataCheckBox(this.p2q8data, this.questionOne.p2q8));
        if(!CheckNullOrUndefinedOrEmpty(this.questionOne.p2q9)){
          this.queryForm.get('p2q9').setValue(this.p2q9data[Number(this.questionOne.p2q9) - 1].id);
          if(Number(this.questionOne.p2q9) == 1)
          {
            this.is_show_model = true;
            this.queryForm.get('p2q9Model').setValue(this.p2q9dataModel[Number(this.questionOne.p2q9Model) - 1].id)
          }
        }
        this.queryForm.get('p2q8Text').setValue(this.questionOne.p2q8Text);
      }
    }
  };

  radioChange(event)
  {
    if(event.value === 1)
    {
      this.is_show_model = true;
      this.queryForm.controls.p2q9Model.setValidators(Validators.required);

    }else{
      this.is_show_model = false;
      this.queryForm.controls.p2q9Model.clearValidators();
    }
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

  onPrevPage() {
    this.page = (this.page + 1) % 2;
  };

  submitted: boolean = false;
  onSubmit() {
    this.submitted = true;
    const queryFormOne: QueryFormOne = new QueryFormOne(
      helper.booleanArrayToIndicesString(this.queryForm.value.p2q1),
      helper.booleanArrayToIndicesString(this.queryForm.value.p2q2),
      this.queryForm.value.p2q2Text,
      helper.booleanArrayToIndicesString(this.queryForm.value.p2q3),
      this.queryForm.value.p2q4,
      this.queryForm.value.p2q5,
      helper.booleanArrayToIndicesString(this.queryForm.value.p2q6),
      helper.booleanArrayToIndicesString(this.queryForm.value.p2q7),
      // this.queryForm.value.p2q7,
      helper.booleanArrayToIndicesString(this.queryForm.value.p2q8),
      this.queryForm.value.p2q8Text,
      this.queryForm.value.p2q9,
      this.queryForm.value.p2q9 == 1 ? this.queryForm.value.p2q9Model : null
    );
    if(queryFormOne.p2q1 == "" || queryFormOne.p2q2 == ""  || queryFormOne.p2q3 == "" || 
       queryFormOne.p2q4 == null || queryFormOne.p2q5 == null || queryFormOne.p2q6 == "" || queryFormOne.p2q7 == "" || queryFormOne.p2q8 == "" || 
       queryFormOne.p2q9 == null || (queryFormOne.p2q9 == "1" && queryFormOne.p2q9Model == null)) {
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
    else if (!/^[a-z]+$/i.test(queryFormOne.p2q2Text) || queryFormOne.p2q2Text == '') {
      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:"Please fill at Others on question 2.",
          title:"NOTIFICATION",
          colorButton: false
        },
      });
      return
    }
    
    else if (!/^[a-z]+$/i.test(queryFormOne.p2q8Text) || queryFormOne.p2q8Text == '') {
      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:"Please fill at Others on question 8.",
          title:"NOTIFICATION",
          colorButton: false
        },
      });
      return
    }
    this._questionnaireService.updateQuestionnaireOne(environment.questionnaireOneVersion, queryFormOne, this.checkToken, this.tokenParam, this.advisor_id).subscribe(response => {
      if(this.checkToken){
        this._router.navigate(['/my-profile']);
      } else {
        this._router.navigate(['/store']);
      }
    });
  }

  private getQuestion(isRegistered){
    this._questionnaireService.getQuestionnaireOne(environment.questionnaireOneVersion, isRegistered, this.tokenParam).subscribe(response => {
      if (response.code === 200) {
        // this._router.navigate(["/questionnaire/one"]);
        const prevQuestionnaire: QueryFormOne = response.questionnaire.answer;
        if(response.questionnaire.answer.p2q9 == 1){
          this.is_show_model = true
          this.queryForm.patchValue({
            // userType: parseInt(prevQuestionnaire.userType),
            // email: prevQuestionnaire.email,
            // name: prevQuestionnaire.name,
            // address: prevQuestionnaire.address,
            // postalCode: prevQuestionnaire.postalCode,
            // phoneNum: prevQuestionnaire.phoneNum,
            // dateOfCookingShow: prevQuestionnaire.dateOfCookingShow,
            p2q2Text: prevQuestionnaire.p2q2Text,
            p2q4: parseInt(prevQuestionnaire.p2q4),
            p2q5: parseInt(prevQuestionnaire.p2q5),
            // p2q7: prevQuestionnaire.p2q7,
            p2q8Text: prevQuestionnaire.p2q8Text,
            p2q9: prevQuestionnaire.p2q9,
            p2q9Model: prevQuestionnaire.p2q9Model,
          });
        }
        else if (response.questionnaire.answer.p2q9 == 2){
          this.is_show_model = false
          this.queryForm.patchValue({
            p2q2Text: prevQuestionnaire.p2q2Text,
            p2q4: parseInt(prevQuestionnaire.p2q4),
            p2q5: parseInt(prevQuestionnaire.p2q5),
            p2q8Text: prevQuestionnaire.p2q8Text,
            p2q9: prevQuestionnaire.p2q9,
          });
        }
        // this.selectedDialCode = prevQuestionnaire.dialCode;

        helper.updateCheckboxes(prevQuestionnaire.p2q1.split(',').map(value => parseInt(value)).filter(val => !isNaN(val)), <FormArray>this.queryForm.controls.p2q1);
        helper.updateCheckboxes(prevQuestionnaire.p2q2.split(',').map(value => parseInt(value)).filter(val => !isNaN(val)), <FormArray>this.queryForm.controls.p2q2);
        helper.updateCheckboxes(prevQuestionnaire.p2q3.split(',').map(value => parseInt(value)).filter(val => !isNaN(val)), <FormArray>this.queryForm.controls.p2q3);
        helper.updateCheckboxes(prevQuestionnaire.p2q6.split(',').map(value => parseInt(value)).filter(val => !isNaN(val)), <FormArray>this.queryForm.controls.p2q6);
        helper.updateCheckboxes(prevQuestionnaire.p2q7.split(',').map(value => parseInt(value)).filter(val => !isNaN(val)), <FormArray>this.queryForm.controls.p2q7);
        helper.updateCheckboxes(prevQuestionnaire.p2q8.split(',').map(value => parseInt(value)).filter(val => !isNaN(val)), <FormArray>this.queryForm.controls.p2q8);

        this.isPersonalInfoFilled = true;
        this.page = 1;
      } else {
        this.isPersonalInfoFilled = false;
        // this._router.navigate(["/login"]);
        if(isRegistered){
          this._myprofileService.getProfile().subscribe(response => {
            const myProfile: MyProfile = response.userProfileData;
            const addressLine1 = myProfile.address_line1 ? myProfile.address_line1 + ', ' : "";
            const addressLine2 = myProfile.address_line2 ? myProfile.address_line2 + ', ' : "";
            const addressLine3 = myProfile.address_line3 ? myProfile.address_line3 : "";
            this.queryForm.patchValue({
              name: myProfile.firt_name + ' ' + myProfile.last_name,
              email: myProfile.email,
              address: addressLine1 + addressLine2 + addressLine3,
              postalCode: !myProfile.postal_code ? '' : myProfile.postal_code,
              phoneNum: myProfile.phone_number,
            });
            this.selectedDialCode = myProfile.phone_dial_code;
            this.page = 0;
  
          });
        }
      }


    }, err => {
      console.log(err);
    });
  }

  private phoneNumberValidator(formControl: FormControl) {
    if (isNaN(formControl.value) === false) {
      return null;
    }

    return { phoneNum: true };
  }

  public date(e) {
    let convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.queryForm.get('dateOfCookingShow').setValue(convertDate, {
      onlyself: true
    });
  }
}
