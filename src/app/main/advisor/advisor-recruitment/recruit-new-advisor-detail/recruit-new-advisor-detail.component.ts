import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import {
  RecruitmentService,
  CustomerInformationNewAdvisor,
} from "app/core/service/recruitment.service";
import { environment } from "environments/environment";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { isNullOrUndefined } from 'util';
import { SelectItem } from 'primeng/api';

@Component({
  selector: "app-recruit-new-advisor-detail",
  templateUrl: "./recruit-new-advisor-detail.component.html",
  styleUrls: ["./recruit-new-advisor-detail.component.scss"],
})
export class RecruitNewAdvisorDetailComponent implements OnInit {
  bankType;
  selectBank;
  storageUrl: string = environment.storageUrl;
  banks = environment.bankList;
  customerUuid: string;
  customerId: string;
  customerInformation: CustomerInformationNewAdvisor;
  bankCode: string;
  bankName: string;
  bankAccount;
  bankHolder: string;
  bankHolderIC: string;
  bankCustomer: FormGroup;
  isShow: boolean = false;
  buttonName: string = "Submit";
  active: boolean = false;

  nationalities: SelectItem[];
  isNationalIdRequired: boolean;

  constructor(
    private location: Location,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private recruitmentService: RecruitmentService,
    private _formBuilder: FormBuilder
  ) {
    this.nationalities = [
      { value: 'SG', label: 'Singaporean' },
      { value: 'MY', label: 'Malaysian' }
    ];
  }

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe((params) => {
      this.customerUuid = params.uuid;
    });

    this.recruitmentService
      .getCustomerByUuid(this.customerUuid)
      .subscribe((data) => {
        this.customerInformation = data;

        if (isNullOrUndefined(this.customerInformation.customerImage)) {
          this.customerInformation.customerImage = "assets/icons/ICON/UserMenu.svg";
        } else {
          this.customerInformation.customerImage = this.storageUrl + this.customerInformation.customerImage;
        }
      });

    this.bankCustomer = this._formBuilder.group({
      nationalityCode: ["", Validators.required],
      nationalID: [""],
      bankCode: ["", Validators.required],
      bankAccount: ["", [Validators.required, phoneNumberValidator]],
      bankHolder: ["", Validators.required],
      bankHolderIC: [""],
    });
  }

  back() {
    this.location.back();
  }

  nextToDone() {
    this.isShow = true;
    this.isNationalIdRequired = false;

    if (this.bankCustomer.value.nationalityCode.value === 'MY' && this.bankCustomer.value.nationalID === '') {
      this.isNationalIdRequired = true;
    }

    if (this.bankCustomer.invalid) {
      return;
    } else {
      this.active = true;
      this.buttonName = "Processing...";
      var updateCustomer = {
        nationality_code: this.bankCustomer.value.nationalityCode.value,
        national_id: this.bankCustomer.value.nationalID,
        bank_code: this.bankCustomer.value.bankCode.bank_code,
        bank_name: this.bankCustomer.value.bankCode.bank_name,
        bank_account: this.bankCustomer.value.bankAccount,
        bank_holder: this.bankCustomer.value.bankHolder,
        bank_holder_ic: this.bankCustomer.value.bankHolderIC,
      };

      this.recruitmentService
        .updateCustomer(updateCustomer, this.customerUuid)
        .subscribe((data) => {
          if (data.code === 200) {
            var id = {
              customer_id: this.customerInformation.customerId
            };
            this.recruitmentService.createRecruitment(id).subscribe(
              data => {
                if (data.code === 200) {
                  this.active = false;
                  this.router.navigate(['advisor/recruit-new-advisor-done']);
                }
              }
            );
          }
        });
    }
  }

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

function phoneNumberValidator(checkOutForm: FormControl) {
  if (isNaN(checkOutForm.value) === false && !checkOutForm.value.includes(' ')) {
    return null;
  }
  return { bankAccount: true };
}
