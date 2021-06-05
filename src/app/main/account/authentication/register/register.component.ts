import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';

import { isNullOrUndefined } from 'util';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Subject } from 'rxjs';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { SelectItem } from 'primeng/api';
import { MustMatch } from '../_helper/must-match.validator';
import { DialCodeComponent } from '../dial-code/dial-code.component';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/service/auth.service';
import { User, UserNoRegister } from '../../../../core/models/user.model';
import { environment } from 'environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { element } from 'protractor';
import { pattern } from 'app/core/enum/pattern';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  animations: fuseAnimations,
})
export class RegisterComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  storageUrl = environment.storageUrl;
  registerForm: FormGroup;
  designations: SelectItem[];
  selectedDesignation = 'MR';
  registerMessage = '';
  advisor_user_id: string = null;
  advisorId = '';
  user: User;
  userNoRegister: UserNoRegister;
  AdvisorImg = '';
  language: string;
  showLanguage: string;
  register_url: string;
  advisor_id: string;
  register_dial_code = environment.dialcode;
  accountAttendee: boolean = false;
  is_summitted: boolean = false;
  termAndPolicyLink: any;
  contact_uuid: string;
  email_form_naep: string;
  contact_id: string;
  returnUrl: string = '';
  customer_uuid : string;
  anomynous ;
  customer_public_id : string;
  is_from_naep : boolean = false;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _translateService: TranslateService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {

      //   this.advisor_id = isNullOrUndefined(params.id) ? '0' :  params.id;
      // this.advisor_id =  params.id;
      // if(isNullOrUndefined(this.advisor_id)){
      //   this.router.navigate(["/login"])
      // }
      this.contact_uuid = isNullOrUndefined(params.contact_uuid) ? null : params.contact_uuid;
      // if (!this.contact_id) {
      //   this.contact_uuid = params.advisor_uuid ? params.advisor_uuid : "";
      // }
      this.email_form_naep = !CheckNullOrUndefinedOrEmpty(params.email_naep) ? params.email_naep : null;
      this.contact_id = !CheckNullOrUndefinedOrEmpty(params.contact_id) ? params.contact_id : null;
      this.customer_uuid = params.customer_uuid;
    });



    this.userNoRegister = JSON.parse(localStorage.getItem('user'))
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        toolbar: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        sidepanel: {
          hidden: true,
        },
      },
    };

    this.designations = [
      { value: 'MR', label: 'Mr.' },
      { value: 'MS', label: 'Ms.' },
      { value: 'MRS', label: 'Mrs.' },
      { value: 'MISS', label: 'Miss.' },
    ];

    this._unsubscribeAll = new Subject();
  }

  @ViewChild(DialCodeComponent) dialcode: DialCodeComponent;

  ngOnInit(): void {


 

    this.returnUrl = this.activatedRoute.snapshot.queryParams['checkUrl'];
    if (!this.returnUrl)
      this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
    if (this.returnUrl != undefined) {
      localStorage.setItem('returnUrl', this.returnUrl)
    }

    let entityNation = environment.entity == "MY" ? "MY" : "SG";
    this.termAndPolicyLink = environment.termAndPolycy[entityNation];
    // this.authService.getAdvisor(this.advisor_id).subscribe(
    //   response => {
    // if(response.code === 201)
    // { 
    //   this.backToLogin()
    // }
    // if(this.accountAttendee){
    //   this.registerForm.patchValue({
    //     'AdvisorName': !this.userNoRegister.advisor_preferred_name ? this.userNoRegister.advisor_first_name : this.userNoRegister.advisor_preferred_name,
    //   });
    //   this.AdvisorImg = !this.userNoRegister.advisor_photo_key ? 'assets/icons/ICON/UserMenu.svg' : this.storageUrl + this.userNoRegister.advisor_photo_key;
    // }else if (response.code === 200) {
    //   this.registerForm.patchValue({
    //     'AdvisorName': !response.advisor_display.preferred_name ? response.advisor_display.firt_name : response.advisor_display.preferred_name,
    //   });
    //   this.AdvisorImg = !response.advisor_display.profile_photo_key ? 'assets/icons/ICON/UserMenu.svg' : this.storageUrl + response.advisor_display.profile_photo_key;
    //   this.advisor_user_id = response.advisor_display.user_id;
    // }
    // else {
    //   this.registerForm.patchValue({
    //     'AdvisorName': 'N/A',
    //   });
    //   this.AdvisorImg = '';
    //   this.advisor_id = null;
    //   this.registerForm.patchValue({
    //     'AdvisorID': ''
    //   });
    // }
    // });


    // if (this.activatedRoute.snapshot.paramMap.get('advisorId') !== 'register') {
    //   this.advisorId = this.activatedRoute.snapshot.paramMap.get('advisorId');
    // }

    this.registerForm = this._formBuilder.group(
      {
        fname: ['', Validators.required],
        preferredname: [''],
        email: ['', [Validators.required, , Validators.pattern(pattern.email)]],
        phoneNum: ['', [Validators.required, Validators.pattern(pattern.phone_number)]],
        // AdvisorID: [{ value: this.advisor_id, disabled: true }],
        // AdvisorName: [{ value: '', disabled: true }],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );

    if (!isNullOrUndefined(this.userNoRegister)) {
      this.registerForm.controls['fname'].setValue(this.userNoRegister.firt_name);
      this.registerForm.controls['preferredname'].setValue(this.userNoRegister.preferred_name);

      this.designations.forEach((element) => {
        if (element.value == this.userNoRegister.designation) {
          this.selectedDesignation = element.value;
          return;
        }
      })

      this.registerForm.controls['email'].setValue(this.userNoRegister.email);
      this.register_dial_code = this.userNoRegister.phone_dial_code;
      // this.registerForm.controls['AdvisorID'].setValue(this.advisor_id);
      // this.registerForm.controls['email'].setValue(this.userNoRegister.email);
      this.registerForm.controls['phoneNum'].setValue(this.userNoRegister.phone_number) ;
    
    }

    //email naep : 
    if (!CheckNullOrUndefinedOrEmpty(this.email_form_naep)) {
      this.registerForm.controls['email'].setValue(this.email_form_naep);

      this.is_from_naep = true;
      this.registerForm.controls['email'].disable();
      this.registerForm.controls['email'].markAllAsTouched();
      // this.registerForm.controls['email'].mark

    }



    if(!CheckNullOrUndefinedOrEmpty(this.customer_uuid))
    {
       this.authService.getdataAnomynousSignUp(this.customer_uuid).subscribe(response=>{
        if(response.code === 200)
        {
          this.anomynous = response.data;
          this.registerForm.controls['email'].setValue(this.anomynous.email)
          this.registerForm.controls['fname'].setValue(this.anomynous.firt_name)
          this.registerForm.controls['phoneNum'].setValue(this.anomynous.phone_number)
          this.register_dial_code = this.anomynous.phone_dial_code;
        }
      })
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  
  onSubmit() {
  
    this.is_summitted = true;
    this.registerForm.controls['email'].enable();
    if (this.registerForm.invalid) {
      console.log(this.registerForm)
      if (this.is_from_naep) 
       this.registerForm.controls['email'].disable();
      return;
    }
    if (isNullOrUndefined(this.userNoRegister)) {
      this.userNoRegister = new UserNoRegister();
    }
    
    this.customer_public_id = !CheckNullOrUndefinedOrEmpty(this.userNoRegister.public_id) ? this.userNoRegister.public_id : this.customer_uuid;
    
    this.user = new User(
      this.customer_public_id,
      this.registerForm.value.fname,
      '',
      this.registerForm.value.preferredname,
      this.registerForm.value.email.toLowerCase(),
      this.registerForm.value.password,
      this.selectedDesignation,
      this.dialcode.selectedDial,
      this.registerForm.value.phoneNum.replace(/^0+/, ""),
      'EN',
      this.contact_uuid,
      this.contact_id
    );
    let checkExistForm = {
      email: this.user.email,
      phone_dial_code: this.user.phone_dial_code,
      phone_number: this.user.phone_number
    };
    this.registerMessage = '';
    this.authService.checkExist(checkExistForm).subscribe(data => {
      if (this.is_from_naep)  
        this.registerForm.controls['email'].disable();
      if (data.code === 201) {
        this.registerMessage = data.message;
      }
      else if (data.code === 200) {
        // localStorage.setItem('user' , JSON.stringify(this.user))
        // localStorage.setItem('advisor_id', this.advisor_id )
        // this.router.navigate(['/register/code/verify']);
        this.authService.register(this.user).subscribe(data => {
          //Open when have verify

          if (data.code === 200) {
            this.backToRegisterDone()
          } else {
            return;
          }
        })
      }
    });

  }

  getLanguge(language) {
    this.language = language;

    if (language == 'en') {
      this.showLanguage = 'English';
    } else if (language == 'en') {
      this.showLanguage = 'Chinese';
    }
    this._translateService.setDefaultLang(this.language);
    const browserLang = this._translateService.getBrowserLang();
    this._translateService.use(this.language);
  }

  backToLogin() {
    this.router.navigate(["/login"],
      { queryParams: { language: this.language } });
  }

  backToRegisterDone() {
    this.router.navigate(["/auth/register/done"], { queryParams: { checkUrl: this.returnUrl }});
        
  }
}

function phoneNumberValidator(registerForm: FormControl) {
  if (isNaN(registerForm.value) === false && !registerForm.value.includes(' ')) {
    return null;
  }
  return { phoneNum: true };
}
