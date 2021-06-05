import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { ResetPassword } from 'app/core/models/reset-password.model';
import { AuthService } from 'app/core/service/auth.service';
import { trim } from 'lodash';
import { MustMatch } from '../_helper/must-match.validator';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';

@Component({
  selector: 'app-resent-email',
  templateUrl: './resent-email.component.html',
  styleUrls: ['./resent-email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResentEmailComponent implements OnInit {
  serverResponseMsg: string;
  resentEmailForm: FormGroup;
  language: string;
  showLanguage: string;
  isShowErrorActivedEmail: boolean = false;
  isShowErrorNotregisterEmail: boolean = false;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private _translateService: TranslateService,
    public  dialog    : MatDialog,

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
    this.resentEmailForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }


  onSubmit() {
    this.isShowErrorActivedEmail = false;
    this.isShowErrorNotregisterEmail = false;
    let email = this.resentEmailForm.value.email.trim().toLowerCase();
    this.authService.resentEmail(email).subscribe(response=>{
      if(response.code === 200)
      { 
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:"Activation email sent successfully.",
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data =>
        {
          this.backToLogin()
        })
      }else if(response.code === 201)
      { 
        this.isShowErrorActivedEmail = true;
        this.isShowErrorNotregisterEmail = false;;
      }else if(response.code === 202)
      {
        this.isShowErrorActivedEmail = false;
        this.isShowErrorNotregisterEmail = true;
      }else{
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:"Error happened when active email. Please try later.",
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data =>
        {
          this.backToLogin()
        })
      }
    })
  }

  getLanguge(language) {
    this.language = language

    if (language == 'en') {
      this.showLanguage = 'English'
    } else if (language == 'zh') {
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