import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from 'app/core/enum/title';
import { DOCUMENT, Location } from "@angular/common";
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { QuestionnaireNaepService } from 'app/core/service/questionnaire-naep.service';

@Component({
  selector: 'app-naep-induction-form-three',
  templateUrl: './naep-induction-form-three.component.html',
  styleUrls: ['./naep-induction-form-three.component.scss']

})
export class NaepInductionFormThreeComponent implements OnInit {
  
  formCheckList: FormGroup;
  answerGroup1: any;
  isCheck: boolean = false;
  
  constructor(
    private _location: Location,
    private router: Router,
    private _formBuilder: FormBuilder,
    private questionNaepService : QuestionnaireNaepService
  ) { }

  title = Title.LEFT_LINK
  
  

  ngOnInit(): void {
    this.answerGroup1 = JSON.parse(localStorage.getItem('answer_group1'));
    this.formCheckList = this._formBuilder.group({
      checkbox1 : ['', Validators.requiredTrue],
      checkbox2 : ['', Validators.requiredTrue],
      checkbox3 : ['', Validators.requiredTrue],
      checkbox4 : ['', Validators.requiredTrue],
      checkbox5 : ['', Validators.requiredTrue],
      checkbox6 : ['', Validators.requiredTrue],
      dateCheckbox1: [{value: '', disabled: true}, Validators.required],
      timeCheckbox1: [{value: '', disabled: true}, Validators.required],

      dateCheckbox2: [{value: '', disabled: true}, Validators.required],
      timeCheckbox2: [{value: '', disabled: true}, Validators.required],

      dateCheckbox3: [{value: '', disabled: true}, Validators.required],
      timeCheckbox3: [{value: '', disabled: true}, Validators.required],

      dateCheckbox4: [{value: '', disabled: true}, Validators.required],
      timeCheckbox4: [{value: '', disabled: true}, Validators.required],

      dateCheckbox6: [{value: '', disabled: true}, Validators.required]
    });

    this.formCheckList.get('checkbox4').valueChanges.subscribe( x => {
      if (x == true) {
        this.formCheckList.controls['dateCheckbox1'].enable();
        this.formCheckList.controls['timeCheckbox1'].enable();

        this.formCheckList.controls['dateCheckbox2'].enable();
        this.formCheckList.controls['timeCheckbox2'].enable();

        this.formCheckList.controls['dateCheckbox3'].enable();
        this.formCheckList.controls['timeCheckbox3'].enable();

        this.formCheckList.controls['dateCheckbox4'].enable();
        this.formCheckList.controls['timeCheckbox4'].enable();
      } else {
        this.formCheckList.controls['dateCheckbox1'].disable();
        this.formCheckList.controls['timeCheckbox1'].disable();
        this.formCheckList.controls['dateCheckbox1'].setValue('');
        this.formCheckList.controls['timeCheckbox1'].setValue('');

        this.formCheckList.controls['dateCheckbox2'].disable();
        this.formCheckList.controls['timeCheckbox2'].disable();
        this.formCheckList.controls['dateCheckbox2'].setValue('');
        this.formCheckList.controls['timeCheckbox2'].setValue('');

        this.formCheckList.controls['dateCheckbox3'].disable();
        this.formCheckList.controls['timeCheckbox3'].disable();
        this.formCheckList.controls['dateCheckbox3'].setValue('');
        this.formCheckList.controls['timeCheckbox3'].setValue('');

        this.formCheckList.controls['dateCheckbox4'].disable();
        this.formCheckList.controls['timeCheckbox4'].disable();
        this.formCheckList.controls['dateCheckbox4'].setValue('');
        this.formCheckList.controls['timeCheckbox4'].setValue('');
      }
    });

    this.formCheckList.get('checkbox6').valueChanges.subscribe( x => {
      if (x == true) {
        this.formCheckList.controls['dateCheckbox6'].enable();
      } else {
        this.formCheckList.controls['dateCheckbox6'].disable();
        this.formCheckList.controls['dateCheckbox6'].setValue('');
      }
    });
  }
  backStep() {
    this.router.navigate(['advisor-earning-program/getting-to-know-you']);
  }

  nextStep(){
    // this._location.();
    this.isCheck = true;

    if (this.formCheckList.invalid) {
      return;
    }

    let answer_group2 = {
      q1: this.formCheckList.get('checkbox1').value,
      q2: this.formCheckList.get('checkbox2').value,
      q3: this.formCheckList.get('checkbox3').value,
      q4: this.formCheckList.get('checkbox4').value,
      q4_date1: this.formCheckList.get('dateCheckbox1').value,
      q4_time1: this.formCheckList.get('timeCheckbox1').value,
      q4_date2: this.formCheckList.get('dateCheckbox2').value,
      q4_time2: this.formCheckList.get('timeCheckbox2').value,
      q4_date3: this.formCheckList.get('dateCheckbox3').value,
      q4_time3: this.formCheckList.get('timeCheckbox3').value,
      q4_date4: this.formCheckList.get('dateCheckbox4').value,
      q4_time4: this.formCheckList.get('timeCheckbox4').value,
      q5: this.formCheckList.get('checkbox5').value
    }

    let answer_group3 = {
      q6: this.formCheckList.get('checkbox6').value,
      q6_date: this.formCheckList.get('dateCheckbox6').value
    }

    let form = {
      answer_group1: this.answerGroup1,
      answer_group2: answer_group2,
      answer_group3: answer_group3
    }

    this.questionNaepService.createNaepIntroductionForm(form).subscribe( data => {
      if (data.code === 200) {
        this.router.navigate(['advisor-earning-program/form-view']);
      }
    })
  }

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
        bodyBackgroundColor: 'white',
        buttonColor: '#269A3E'
    },
    dial: {
        dialBackgroundColor: '#269A3E'
    },
    clockFace: {
        clockFaceBackgroundColor: '#F3F3F3',
        clockHandColor: '#269A3E',
        clockFaceTimeInactiveColor: '#5A616F'
    }
  };
}
