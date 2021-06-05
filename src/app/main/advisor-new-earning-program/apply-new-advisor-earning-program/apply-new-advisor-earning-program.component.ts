import { customer } from './../../../core/models/list_recruit.model';
import { from } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import {
  RecruitmentService,
  CustomerInformationNewAdvisor,
} from "app/core/service/recruitment.service";
import { NaepService} from "app/core/service/naep.service";
import { environment } from "environments/environment";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { isNullOrUndefined } from 'util';
import { SelectItem } from 'primeng/api';
import { Title } from 'app/core/enum/title';
import { CustomerInformationNaep, applyCustomerinformationNaep } from 'app/core/models/naep.model';
import * as moment from "moment";
import { getLocaleDate } from 'app/core/utils/date.util';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { MatDialog} from '@angular/material/dialog';
import * as NATIONAL from 'assets/nationalities.json'
import { DialogAlertComponent } from '../dialog-alert/dialog-alert.component';

@Component({
  selector: 'app-apply-new-advisor-earning-program',
  templateUrl: './apply-new-advisor-earning-program.component.html',
  styleUrls: ['./apply-new-advisor-earning-program.component.scss']
})
export class ApplyNewAdvisorEarningProgramComponent implements OnInit {
  title = Title.LEFT;
  bankType;
  selectBank;
  storageUrl: string = environment.storageUrl;
  banks = environment.bankList;
  customerUuid: string;
  customerId: number;
  customerInformation: CustomerInformationNewAdvisor;
  bankCode: string;
  bankName: string;
  bankAccount: number;
  bankHolder: string;
  bankHolderIC: string;
  naepForm: FormGroup;
  isShow: boolean = false;
  buttonName: string = "Apply";
  active: boolean = false;
  customerInformationNaep : CustomerInformationNaep;
  nationalities: SelectItem[];
  isNationalIdRequired: boolean;
  customerName : string;
  customerEmail : string;
  customerPhone : string;
  isSummit : boolean = false;
  nationality_list = [];
  stateCodeToNameFormOptions = null;
  countryCodeToName = environment.countryCodeToName;
  country : string = environment.entity === "MY" ? environment.countryCodeToName.MY : environment.countryCodeToName.SG
  nation_code =  environment.entity === "MY" ? "MY" : "SG";
  default_nationality = environment.entity === "MY" ? {"label" : "Malaysian","value" : "Malaysian"} : {"label" : "Singaporean","value" : "Singaporean"};
  minDate: Date;
  maxDate: Date;
  city_state_code;
  advisorID: string;
  companyName = environment.companyInfo.id;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private recruitmentService: RecruitmentService,
    private _formBuilder: FormBuilder,
    private naepService : NaepService,
    public  dialog    : MatDialog,
  ) {
    this.nationalities = [
      { value: 'SG', label: 'Singaporean' },
      { value: 'MY', label: 'Malaysian' }
    ];
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth();

    this.minDate = new Date(currentYear - 65, currentMonth, currentDay);
    this.maxDate = new Date(currentYear - 18, currentMonth, currentDay);
    this.nationality_list = (NATIONAL as any).default;

    this.naepForm = this._formBuilder.group({
      residentCountry : ["", Validators.required],
      nationalty : ["", Validators.required],
      nationlId : ["" , Validators.required],
      passport : ["",Validators.maxLength(50)],
      dob : ["",Validators.required],
      addressLine1 : ["",[Validators.required, Validators.maxLength(40)]],
      addressLine2 : ["",  Validators.maxLength(40)],
      addressLine3 : ["", Validators.maxLength(40)],
      postalCode : ["",Validators.required],
      cityState : ["",Validators.required],
      country : ["",Validators.required],
      bankCode: ["", Validators.required],
      bankAccount: ["", Validators.required],
      checkAgree: ["", Validators.requiredTrue],
      bankHolder: ["", Validators.required]
    });
    
    this.activatedRoute.queryParams.subscribe((params) => {
      this.advisorID = params.advisorID;
    });

    this.naepService.getCustomerInformationNaep().subscribe(data=>{
      this.customerName = data.name;
      this.customerEmail = data.email;
      this.customerPhone = data.phoneNumber;
      this.customerId = data.id;
      this.customerUuid = data.uuid;

      this.naepForm.patchValue({
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        addressLine3: data.addressLine3,
        postalCode: data.postalCode,
        cityState: data.stateCode,
        country: data.countryCode
      })

      if (!data.checkStatus) {
        this.router.navigateByUrl('/advisor-earning-program')
      }
    })

    const selectedCountryCode = this.nation_code;
    this.stateCodeToNameFormOptions = environment.countryCodeToStates[selectedCountryCode];
    this.city_state_code = Object.keys(this.stateCodeToNameFormOptions)[0];
  }
  get naepControl() { return this.naepForm.controls; };
  onSubmit(){
    this.isSummit = true;
    if(this.naepForm.invalid === true || this.naepForm.value.checkAgree === false)
    {
      return;
    }
    else{

      const dialogNotifi = this.dialog.open(DialogAlertComponent, {
        width: "500px",
        data: {
          message: "Please confirm the information you input is true and correct",
          title: "CONFIRM",
          type: "APPLY"
        },
      });

      dialogNotifi.afterClosed().subscribe(data => {
        
        if (data) {
          dialogNotifi.close();
        } else {

          let naepformSumbit  = new applyCustomerinformationNaep();
          naepformSumbit.residentCountry = this.naepForm.value.residentCountry;
          naepformSumbit.nationality = this.naepForm.value.nationalty.value;
          naepformSumbit.nationlId = this.naepForm.value.nationlId ;
          naepformSumbit.passport = this.naepForm.value.passport;
          naepformSumbit.dob = getLocaleDate(this.naepForm.value.dob) ;
          naepformSumbit.addressLine1 = this.naepForm.value.addressLine1;
          naepformSumbit.addressLine2 = this.naepForm.value.addressLine2;
          naepformSumbit.addressLine3 = this.naepForm.value.addressLine3;
          naepformSumbit.postalCode = this.naepForm.value.postalCode;
          naepformSumbit.cityState = this.naepForm.value.cityState;
          naepformSumbit.country = this.naepForm.value.country;
          naepformSumbit.bankCode = this.naepForm.value.bankCode.bank_code;
          naepformSumbit.BankAccountNumber = this.naepForm.value.bankAccount;
          naepformSumbit.bankHolder = this.naepForm.value.bankHolder;
          naepformSumbit.recruitmentId = this.advisorID;
    
          this.naepService.applyCustomerinformationNaepApi(naepformSumbit).subscribe(response=>{
            if(response.code === 200){
              this.active = true;
              this.buttonName = "Processing...";
              this.router.navigate(['/advisor-earning-program'])
            }else{
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: response.data,
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
            }
          })
        }
      })
    }
  }

  back() {
    // this.location.back();

    const dialogNotifi = this.dialog.open(DialogAlertComponent, {
      width: "500px",
      data: {
        message: "Are you sure you want to Cancel and lose all input?",
        title: "ALERT",
        type: "BACK"
      },
    });

    dialogNotifi.afterClosed().subscribe( data => {
      if (data) {
        dialogNotifi.close();
      } else {
        this.location.back();
      }
    })
  }

  buyNaep(){
    this.router.navigate(['advisor-earning-program/buy-packet-naep'])
  }

  setFormState(event): void {
    
  }

  keepOriginalOrder = (a, b) => a.key;

  viewTermsConditions() {
    if (this.companyName === 'SG') {
      let url = this.router.serializeUrl(this.router.createUrlTree(['naep-terms-conditions-sg']));
      window.open(url, '_blank');
    } else if (this.companyName === 'MY') {
      let url = this.router.serializeUrl(this.router.createUrlTree(['naep-terms-conditions-my']))
      window.open(url, '_blank')
    }
  }

  // nextToDone() {
  //   this.isShow = true;
  //   this.isNationalIdRequired = false;

  //   if (this.bankCustomer.value.nationalityCode.value === 'MY' && this.bankCustomer.value.nationalID === '') {
  //     this.isNationalIdRequired = true;
  //   }

  //   if (this.bankCustomer.invalid) {
  //     return;
  //   } else {
  //     this.active = true;
  //     this.buttonName = "Processing...";
  //     var updateCustomer = {
  //       nationality_code: this.bankCustomer.value.nationalityCode.value,
  //       national_id: this.bankCustomer.value.nationalID,
  //       bank_code: this.bankCustomer.value.bankCode.bank_code,
  //       bank_name: this.bankCustomer.value.bankCode.bank_name,
  //       bank_account: this.bankCustomer.value.bankAccount,
  //       bank_holder: this.bankCustomer.value.bankHolder,
  //       bank_holder_ic: this.bankCustomer.value.bankHolderIC,
  //     };

  //     this.recruitmentService
  //       .updateCustomer(updateCustomer, this.customerUuid)
  //       .subscribe((data) => {
  //         if (data.code === 200) {
  //           var id = {
  //             customer_id: this.customerInformation.customerId
  //           };
  //           this.recruitmentService.createRecruitment(id).subscribe(
  //             data => {
  //               if (data.code === 200) {
  //                 this.active = false;
  //                 this.router.navigate(['advisor/recruit-new-advisor-done']);
  //               }
  //             }
  //           );
  //         }
  //       });
  //   }
  // }

  // checkIfNationalIdRequired(formControl: FormControl) {
  //   //console.log(this.selectedNationality);
  //   //console.log(this.bankCustomer.value.nationalID);
  //   if (this.bankCustomer !== null) {
  //     if (this.bankCustomer.value.nationalityCode === 'MY' && this.bankCustomer.value.nationalID === '') {
  //       console.log('here');
  //       return { nationalID: true };
  //     }

  //     return null;
  //   }
  // }

}

export const DateFormat = {
  parse: {
  dateInput: 'input',
  },
 display: {
 dateInput: 'DD/MM/YYYY',
 monthYearLabel: 'MMMM YYYY',
 dateA11yLabel: 'DD/MM/YYYY',
 monthYearA11yLabel: 'MMMM YYYY',
 }
 };

function phoneNumberValidator(checkOutForm: FormControl) {
  if (isNaN(checkOutForm.value) === false && !checkOutForm.value.includes(' ')) {
    return null;
  }
  return { bankAccount: true };
}