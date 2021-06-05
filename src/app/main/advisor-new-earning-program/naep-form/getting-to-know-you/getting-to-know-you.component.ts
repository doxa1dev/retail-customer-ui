import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Q3_NAEP, Q4_NAEP, Q4A_NAEP, Q5_NAEP } from 'app/core/constants/constant';
import { Title } from 'app/core/enum/title';
import { QuestionnaireNaep } from 'app/core/models/questionnaire-naep.model';

@Component({
  selector: 'app-getting-to-know-you',
  templateUrl: './getting-to-know-you.component.html',
  styleUrls: ['./getting-to-know-you.component.scss']
})
export class GettingToKnowYouComponent implements OnInit {

  queryForm: FormGroup;
  isCheck: boolean = false;

  constructor(
    private router : Router,
    private _formBuilder: FormBuilder
  ) { }

  title = Title.LEFT_LINK

  q3data = Q3_NAEP;
  q4data = Q4_NAEP;
  q4adata = Q4A_NAEP;
  q5data = Q5_NAEP;

  // data = {
  //   member_family: "3",
  //   children: "2",
  //   ages: "21",
  //   carrer: "policee",
  //   q2: "7 years",
  //   q3: 3,
  //   q3Text: "",
  //   q4: 4,
  //   q4a: 6,
  //   q4aText: "15000$",
  //   q5: 1
  // }

  ngOnInit(): void {
    this.queryForm = this._formBuilder.group({
      family: ['', Validators.required],
      children: ['', Validators.required],
      ages: ['', Validators.required],
      career: ['', Validators.required],
      q2: ['', Validators.required],
      q3: ['', Validators.required],
      q3Text: [{ value: '', disabled: true }, Validators.required],
      q4: ['', Validators.required],
      q4a: ['', Validators.required],
      q4aText: [{ value: '', disabled: true }, Validators.required],
      q5: ['', Validators.required]
    });

    // this.queryForm.setValue({
    //   family: this.data.member_family,
    //   children: this.data.children,
    //   ages: this.data.ages,
    //   career: this.data.ages,
    //   q2: this.data.q2,
    //   q3: this.q3data[Number(this.data.q3) - 1].id,
    //   q3Text: this.data.q3Text,
    //   q4: this.q4data[Number(this.data.q4) - 1].id,
    //   q4a: this.q4adata[Number(this.data.q4a) - 1].id,
    //   q4aText: this.data.q4aText,
    //   q5: this.q5data[Number(this.data.q5) - 1].id
    // })

    if (this.queryForm.controls['q3Text'].value != "") {
      this.queryForm.controls['q3Text'].enable();
    }

    if (this.queryForm.controls['q4aText'].value != "") {
      this.queryForm.controls['q4aText'].enable();
    }

    this.queryForm.get('q3').valueChanges.subscribe( x => {
      if (x == 4) {
        this.queryForm.controls['q3Text'].enable();
      } else {
        this.queryForm.controls['q3Text'].setValue('');
        this.queryForm.controls['q3Text'].disable();
      }
    });

    this.queryForm.get('q4a').valueChanges.subscribe( x => {
      if (x == 6) {
        this.queryForm.controls['q4aText'].enable();
      } else {
        this.queryForm.controls['q4aText'].setValue('');
        this.queryForm.controls['q4aText'].disable();
      }
    });
  }

  // nextStep(){
  //   this.router.navigate(['advisor-earning-program/induction-form-three'])
  // }
  backStep(){
    this.router.navigate(['advisor-earning-program/induction-form-one'])
  }

  nextStep() {
    this.isCheck = true;

    if (this.queryForm.invalid) {
      return;
    }

    let answer_group1 = {
      q1a: this.queryForm.get('family').value,
      q1b: this.queryForm.get('children').value,
      q1c: this.queryForm.get('ages').value,
      q1d: this.queryForm.get('career').value,
      q2: this.queryForm.get('q2').value,
      q3: this.queryForm.get('q3').value,
      q3_text: this.queryForm.get('q3Text').value,
      q4: this.queryForm.get('q4').value,
      q4a: this.queryForm.get('q4a').value,
      q4a_text: this.queryForm.get('q4aText').value,
      q5: this.queryForm.get('q5').value
    }

    localStorage.setItem('answer_group1', JSON.stringify(answer_group1));

    this.router.navigate(['advisor-earning-program/induction-form-three']);
  }
}
