import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/service/auth.service';
import { Location} from '@angular/common';
import { environment} from 'environments/environment'
import
{
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class VerifyCodeComponent implements OnInit {
  isShow : boolean = true;
  user;
  uuid: string;
  public count : number = 60 ;
  otpForm: FormGroup;
  ShowMessage : boolean = false;
  message: string;
  language: string;
  showLanguage: string;
  is_from_naep : boolean = false;
  returnUrl: string;
  phoneNumber: string;
  dialCode: string;
  checkChangeEmail: boolean = false;
  token: string;
  email;

  constructor
    (
      private _fuseConfigService: FuseConfigService,
      private router: Router,
      private authService : AuthService,
      private _formBuilder: FormBuilder,
      private location : Location,
      private _translateService: TranslateService,
      public dialog: MatDialog
    )         
  {
    this.user = JSON.parse(localStorage.getItem('user'));

    if (!CheckNullOrUndefinedOrEmpty(this.user)) {
      if(!CheckNullOrUndefinedOrEmpty(this.user.contact_id))
      {
        this.is_from_naep = true;
      }
    }

    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    }
  }

  ngOnInit(): void {
    this.returnUrl = localStorage.getItem('returnUrl');
    this.phoneNumber = localStorage.getItem('phoneNumber');
    this.dialCode = localStorage.getItem('dialCode');
    this.uuid = localStorage.getItem('uuid');
 
    if (!CheckNullOrUndefinedOrEmpty(this.dialCode) && !CheckNullOrUndefinedOrEmpty(this.phoneNumber)) {
      this.GetOtp(this.dialCode + this.phoneNumber);

    } 
    else if (environment.has_phone_verification === true) {
      this.GetOtp(this.phoneNumber);
    }
    else if (CheckNullOrUndefinedOrEmpty(this.dialCode)) {
      this.GetOtp(this.phoneNumber);
    }
  

    this.otpForm = this._formBuilder.group({
      input1 : [''],
      input2: [''],
      input3: [''],
      input4: [''],
      input5: [''],
      input6: [''],
    })
  }

  GetOtp(phoneNumber) {
    this.authService.GetOtp(phoneNumber).subscribe(data =>
      {
        if (data.code === 200)
        {
          this.uuid = data.uuid;
        }
      })
  }

  ReSentOTPApi(phoneNumber) {
    this.authService.GetOtp(phoneNumber).subscribe(data =>
      {
        if (data.code === 200)
        {
          this.uuid = data.uuid;
        }
      })
  }

  ReSentOTP(){
    this.count = 1;

    if (!CheckNullOrUndefinedOrEmpty(this.dialCode + this.phoneNumber))
    {
      this.ReSentOTPApi(this.dialCode + this.phoneNumber);
    }
    else if (environment.has_phone_verification === true) {
      this.ReSentOTPApi(this.dialCode + this.phoneNumber)
    }
    else{
      return;
    }
    
  }

  onTimerFinished(event: Event)
  {
    if (event["action"] == "done")
    {
      this.count = 0;
    }
  }

  Verify(){
    let otp = 
    this.otpForm.value.input1 + 
    this.otpForm.value.input2 +
    this.otpForm.value.input3 +
    this.otpForm.value.input4 +
    this.otpForm.value.input5 +
    this.otpForm.value.input6;

    this.authService.VerifyOTP(this.uuid, otp).subscribe( data=> {
      if(data.code === 200) {
        this.email = localStorage.getItem('email');
        this.token = data.token;
        this.authService.activePhone(this.token, this.email, this.uuid).subscribe(
          data =>{
            this.router.navigate(['/auth/verify-done']);
          },
          err => console.log(err)
        )
        // localStorage.removeItem('uuid')
        // localStorage.removeItem('email')
      } else {
        this.ShowMessage = true;
        this.message = data.message;
      }
    })
  }

  back(){
    this.location.back();
  }

  backToLogin() {
    this.router.navigate(["/login"]);
  }

  onInputEntry(event, nextInput) {
    let input = event.target;
    let length = input.value.length;
    let maxLength = input.attributes.maxlength.value;

    if (length >= maxLength) {
      nextInput.focus();
    }
  }
  getLanguge(language) {
    this.language = language

    if (language == 'en') {
      this.showLanguage = 'English'
    } else if (language == 'en') {
      this.showLanguage = 'Chinese'
    }
    this._translateService.setDefaultLang(this.language);
    const browserLang = this._translateService.getBrowserLang();
    this._translateService.use(this.language);
  }
}
