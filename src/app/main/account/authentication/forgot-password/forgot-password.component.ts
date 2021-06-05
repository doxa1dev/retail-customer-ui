import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';

import { ResetPassword } from '../../../../core/models/reset-password.model';

import { AuthService } from '../../../../core/service/auth.service';
import { MustMatch } from '../_helper/must-match.validator';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'app/core/service/commom/shared.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {
  token: string;
  isValidToken: boolean;
  isTokenVerifyError: boolean;
  isEmailSent: boolean;
  isEmailSentError: boolean;
  isPasswordReset: boolean;
  isPasswordResetError: boolean;
  serverResponseMsg: string;
  forgotForm: FormGroup;
  resetForm: FormGroup;
  language: string;
  showLanguage: string;
  isShowCheck: boolean;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private _translateService: TranslateService
  ) {
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
    };
  }

  ngOnInit(): void {
    this.isEmailSent = false;
    this.isEmailSentError = false;
    this.isPasswordReset = false;
    this.isPasswordResetError = false;
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.token = params.get('token');

      if (this.token == null) {
        this.isValidToken = false;
        this.forgotForm = this._formBuilder.group({
          email: ['', [Validators.required, Validators.email]]
        });
      }
      else {
        this.authService.verifyForgotPasswordToken(this.token).subscribe(response => {
          this.isValidToken = response.isValidToken;
          if (this.isValidToken) {
            this.resetForm = this._formBuilder.group({
              newPassword: ['', [Validators.required, Validators.minLength(8)]],
              confirmPassword: ['', Validators.required]
            },
              {
                validator: [
                  MustMatch('newPassword', 'confirmPassword')
                ]
              });
          }
          else {
            this.isTokenVerifyError = true;
            this.serverResponseMsg = response.message;
          }
        });
      }
    });

    // this.activatedRoute.queryParams.subscribe( params => {
    //   this.language = params.language;

    //   if (this.language == 'en') {
    //     this.showLanguage = 'English'
    //   } 
    //   else if (this.language == 'en') {
    //     this.showLanguage = 'Chinese'
    //   }

    //   this._translateService.setDefaultLang('en');
    //   const browserLang = this._translateService.getBrowserLang();
    //   this._translateService.use(browserLang.match(/en|zh/) ? browserLang : 'en');
    // })

  }

  retryRequest() {
    this.isEmailSentError = false;
    this.forgotForm.controls['email'].setValue('');
    this.router.navigate(['/forgot-password']);
  }

  onSubmit(type: string) {
    if (type === 'forgot') {
      this.forgotForm.value.email = this.forgotForm.value.email.trim().toLowerCase();
      this.authService.forgotPassword(this.forgotForm.value.email).subscribe(response => {
        if (response.code === "200") {
          this.isEmailSent = true;
        }
        else {
          this.isEmailSentError = true;
        }
        this.serverResponseMsg = response.message;

        if (response.code === 404) {
          this.isShowCheck = false;
        } else if (response.code === 200) {
          this.isShowCheck = true;
        }
      });
    }

    if (type === 'reset') {
      const resetPassword: ResetPassword = {
        newPassword: this.resetForm.value.newPassword,
        confirmPassword: this.resetForm.value.confirmPassword,
        token: this.token
      };
      this.authService.resetPassword(resetPassword).subscribe(response => {
        if (response.code === "200") {
          this.isPasswordReset = true;
        }
        else {
          this.isPasswordResetError = true;
        }
        this.serverResponseMsg = response.message;
      });

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

  backToLogin() {
    this.router.navigate(["/login"], 
    { queryParams: { language: this.language} });
  }
}
