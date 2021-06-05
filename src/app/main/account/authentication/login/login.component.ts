import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators,FormControl} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthService} from '../../../../core/service/auth.service'
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { HttpParams, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiService } from 'app/core/service/api.service';
import { changeLanguages } from 'app/core/service/backend-api';
import { MyProfileService } from 'app/core/service/my-profile.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'app/core/service/commom/shared.service';
import { Title } from 'app/core/enum/title';
import { User, UserNoRegister } from 'app/core/models/user.model';
import { pattern} from 'app/core/enum/pattern'
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginAlert : boolean;
  loginAlert204 : boolean = false;
  loginAlert202 : boolean = false;
  loginAlert203 : boolean = false;
  redirect: string;
  id: number;
  token: string;
  language: string;
  showLanguage: string;
  tokenParam: string;
  isRegister : boolean = false;

  dataNoRegister : any;

  active: boolean = false;
  buttonName: string = 'LOG IN';
  title = Title.LEFT_LINK;
  message :string = ''
  returnUrl : string = '';
  slides = [
  {image: "assets/images_doxa/Login-1.png"},
  {image: "assets/images_doxa/Login-2.png"},
  {image: "assets/images_doxa/Login-3.png"}
  ];

  //check token
  decoded: any;

  constructor
  ( 
    private _fuseConfigService : FuseConfigService,
    private _formBuilder : FormBuilder,
    private _authenticationService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private http: HttpClient,
    private myProfileService: MyProfileService,
    private _translateService: TranslateService,
  )         
  {
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
    // this.route.queryParams.subscribe((params) => {
    //   this.redirect = params.redirect;
    //   this.id = params.id;
    //   this.language = params.language;
    //   if (this.language == 'en') {
    //     this.showLanguage = 'English'
    //   } 
    //   else if (this.language == 'en') {
    //     this.showLanguage = 'Chinese'
    //   }
    //   const browserLang = this._translateService.getBrowserLang();
    //   this._translateService.setDefaultLang(browserLang.match(/en|zh/) ? browserLang : 'en');
      
      // this._translateService.use(browserLang.match(/en|zh/) ? browserLang : 'en');
    // });
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/store';
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (!this.returnUrl)
      this.returnUrl = localStorage.getItem('returnUrl');
    if (!this.returnUrl)
      this.returnUrl = '/store';
    console.log(this.returnUrl);
    this.route.queryParams.subscribe((params) => {
      this.tokenParam = params.tokenParam;
    });
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(pattern.email)]],
      password: ['', [Validators.required, Validators.pattern('^.{8,}$')]]
    });
  }
  onSubmit(){
    this.active = true;
    this.buttonName = "Processing...";
    this.loginForm.value.email = this.loginForm.value.email.trim().toLowerCase();
    this._authenticationService.login(this.loginForm.value).subscribe(
      respone => {
        if(respone.code ===  201){
          this.language = 'en';
          this.showLanguage = 'English';
          this.router.navigate(["/login"]);
          this.active = false;
          this.buttonName= 'LOG IN';
          this.loginAlert = true;
          this.loginAlert202 = false;
          this.loginAlert203 = false;
          this.loginAlert204 = false;
          this.loginForm.controls["email"].markAsPristine();
          this.loginForm.controls["password"].markAsPristine();
          this._translateService.setDefaultLang(this.language);
          const browserLang = this._translateService.getBrowserLang();
          this._translateService.use(this.language);
        }else if (respone.code ===  204){
          this.language = 'en';
          this.showLanguage = 'English'
          this.router.navigate(["/login"]);
          this.active = false;
          this.buttonName= 'LOG IN';
          this.loginAlert204 = true;
          this.loginAlert = false;
          this.loginAlert202 = false;
          this.loginAlert203 = false;
          this.loginForm.controls["email"].markAsPristine();
          this.loginForm.controls["password"].markAsPristine();
          this._translateService.setDefaultLang(this.language);
          const browserLang = this._translateService.getBrowserLang();
          this._translateService.use(this.language);
          // this.isRegister = true;
          this.dataNoRegister = respone.data;
        }else if (respone.code ===  202){
          this.language = 'en';
          this.showLanguage = 'English'
          this.router.navigate(["/login"]);
          this.active = false;
          this.buttonName= 'LOG IN';
          this.loginAlert202 = true;
          this.loginAlert= false;
          this.loginAlert203 = false;
          this.loginAlert204 = false;
          this.loginForm.controls["email"].markAsPristine();
          this.loginForm.controls["password"].markAsPristine();
          this._translateService.setDefaultLang(this.language);
          const browserLang = this._translateService.getBrowserLang();
          this._translateService.use(this.language);
          // this.isRegister = true;
          this.dataNoRegister = respone.data;
        }else if (respone.code ===  203){
          this.language = 'en';
          this.showLanguage = 'English'
          this.router.navigate(["/login"]);
          this.active = false;
          this.buttonName= 'LOG IN';
          this.loginAlert203 = true;
          this.loginAlert = false;
          this.loginAlert202 = false;
          this.loginAlert204 = false;
          this.loginForm.controls["email"].markAsPristine();
          this.loginForm.controls["password"].markAsPristine();
          this._translateService.setDefaultLang(this.language);
          const browserLang = this._translateService.getBrowserLang();
          this._translateService.use(this.language);
          // this.isRegister = true;
          this.dataNoRegister = respone.data;
        }
        else{

          // check edit email
          if (!CheckNullOrUndefinedOrEmpty(respone.accessToken)){
            this.decoded = jwt_decode(respone.accessToken);
            localStorage.removeItem('returnUrl');

            if (!CheckNullOrUndefinedOrEmpty(this.decoded)) {
              localStorage.setItem("token", respone.accessToken);
              
              // if (this.decoded.is_edit_email) {
              //   localStorage.setItem("dialCode", this.decoded.phone_dial_code);
              //   localStorage.setItem("phoneNumber", this.decoded.phone_number);
              //   // this.router.navigate(['/register/code/verify']);
              // } else {

                this.active = false;
                this.buttonName= 'LOG IN';
                // localStorage.setItem("token", respone.accessToken);
                this.token = respone.accessToken;
    
                this.myProfileService.getProfile().subscribe((response) => {
                  if (response.code === 200) {
                    if (isNullOrUndefined(response.userProfileData.language_code) && isNullOrUndefined(this.language)) 
                    {
                      this.language = 'en'
                    } 
                    else if (!isNullOrUndefined(response.userProfileData.language_code) && isNullOrUndefined(this.language)) 
                    {
                      this.language = response.userProfileData.language_code
                    } 
                  }
                  this._authenticationService.changeLanguage(this.language).subscribe( data => {
                    if(isNullOrUndefined(this.tokenParam)){
                      localStorage.setItem('checkLogin', 'true');

                      this._authenticationService.checkNaepCustomer().subscribe(isCheck => {
                        if (!isCheck) {
                          this.router.navigateByUrl('/advisor-earning-program');
                        } else {
                          this.router.navigateByUrl(this.returnUrl);
                        }
                      })

                    } else {
                      this.router.navigate(['questionnaire/one']);
                    }
                  })
                })
              // }
            }
          }
        }
      },
      err => {
        this.active = false;
        this.buttonName= 'LOG IN';
      }
    )
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

  nextToForgotPassword(){
    if (this.language == undefined) {
      this.language = 'en'
    }
    this.router.navigate(["/forgot-password"], 
    { queryParams: { language: this.language} });
  }
  nextToResentMail(){
    if (this.language == undefined) {
      this.language = 'en'
    }
    this.router.navigate(["/resent-email"], 
    { queryParams: { language: this.language} });
  }

  nextToSignUp() {
    if (this.language == undefined) {
      this.language = 'en'
    }
    if (this.isRegister == false) {
      this.router.navigate(["/register"],
        { queryParams: { language: this.language } });
    } else {
      let user = new UserNoRegister();
      if(!isNullOrUndefined(this.dataNoRegister)){
        user.public_id = this.dataNoRegister.public_id;
        user.firt_name = this.dataNoRegister.firt_name;
        user.preferred_name = this.dataNoRegister.preferred_name;
        user.email = this.dataNoRegister.email;
        user.designation = this.dataNoRegister.designation;
        user.phone_dial_code = this.dataNoRegister.phone_dial_code;
        user.phone_number = this.dataNoRegister.phone_number;
        user.advised_by_customer_id = this.dataNoRegister.advised_by_customer_id;
        user.advisor_first_name = this.dataNoRegister.advisorCustomer.firt_name;
        user.advisor_last_name = this.dataNoRegister.advisorCustomer.last_name;
        user.advisor_preferred_name = this.dataNoRegister.advisorCustomer.preferred_name;
        user.advisor_photo_key = this.dataNoRegister.advisorCustomer.profile_photo_key;

        const navigationExtras: NavigationExtras = {
          state: { userNoRegister: user },
          queryParams: { language: this.language }
        };
        this.router.navigate(["/register"],navigationExtras);
      }
      
    }

  }

}

