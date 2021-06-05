import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/service/auth.service';
import { Location} from '@angular/common';
import { environment} from 'environments/environment'
import
{
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
@Component({
  selector: 'app-register-done',
  templateUrl: './register-done.component.html',
  styleUrls: ['./register-done.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RegisterDoneComponent implements OnInit {
  
  public count : number = 60 ;
  otpForm: FormGroup;
  ShowMessage : boolean = false;
  message: string;
  language: string;
  showLanguage: string;
  is_from_naep : boolean = false;
  returnUrl: string;
 // advisor_id: string;
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
      private activatedRoute: ActivatedRoute,
      public dialog: MatDialog
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
    // this.returnUrl = localStorage.getItem('returnUrl');
    // this.phoneNumber = localStorage.getItem('phoneNumber');
    // this.dialCode = localStorage.getItem('dialCode');
    this.returnUrl = this.activatedRoute.snapshot.queryParams['checkUrl'];
    if (!this.returnUrl)
      this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
    if (this.returnUrl != undefined) {
      localStorage.setItem('returnUrl', this.returnUrl)
    }
  }

  backToLogin() {
    this.router.navigate(["/login"], { queryParams: { checkUrl: this.returnUrl }});
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

