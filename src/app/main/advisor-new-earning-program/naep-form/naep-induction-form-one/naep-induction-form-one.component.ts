
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from 'app/core/enum/title';
import { QuestionnaireNaep } from 'app/core/models/questionnaire-naep.model';
import { QuestionnaireNaepService } from 'app/core/service/questionnaire-naep.service';
import { DialCodeComponent } from 'app/main/account/authentication/dial-code/dial-code.component';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-naep-induction-form-one',
  templateUrl: './naep-induction-form-one.component.html',
  styleUrls: ['./naep-induction-form-one.component.scss']
})
export class NaepInductionFormOneComponent implements OnInit {

  constructor(
    private router : Router,
    private questionNaepService : QuestionnaireNaepService
  ) {}

  dial_code= environment.dialcode;
  Users : any;
  startDate: Date = new Date();
  endDate: Date = new Date()
  title = Title.LEFT_LINK;
  editable: boolean = true;  
  selectedDialCode;
  dataNaepForm: QuestionnaireNaep;
  loading: boolean = true; 

  @ViewChild(DialCodeComponent) dialcode: DialCodeComponent;
  ngOnInit(): void {
    this.getDataQuestionNaep();
  }

  getDataQuestionNaep(): Promise<any> {
    return new Promise(resolve => {
      this.questionNaepService.getNaepIntroductionForm().subscribe( data => {
        this.dataNaepForm = data;
        this.dial_code = this.dataNaepForm.dialCode;

        this.loading = false;
      })
    })
  }

  onChangeStartDate(event){

  }

  nextStep() {
    this.router.navigate(['advisor-earning-program/getting-to-know-you'])
  }

}
