import { isNullOrUndefined } from 'util';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/service/auth.service';
import { HttpClient} from '@angular/common/http'
import { TranslateService } from '@ngx-translate/core';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class VerifyEmailComponent implements OnInit {
  verifyEmailResult: string ='';
  uuid : string;
  isShowValid : boolean ;
  token : string;
  language: string;
  showLanguage: string;
  returnValue  : number;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private router: Router,
    private authService : AuthService,
    private activatedRoute: ActivatedRoute,
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
    };
    this.activatedRoute.queryParams.subscribe(params =>{
      this.token = params.token;
    })
  }

  ngOnInit(): void {
    if(!CheckNullOrUndefinedOrEmpty(this.token))
    {
      this.authService.verifyUserEmail(this.token).subscribe(
        // code 200 -- show success active mail
        // code 202 -- show link active mail expired
        // code 201 -- Invalid token link
        response =>{

          if(response.code === 200)
          {
            this.returnValue = 200;
          }else if(response.code === 202)
          {
            this.returnValue = 202;
          }else{
            this.returnValue === 201
          }
        },
        err => console.log(err)
      )
    }
    
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

  gotoResentEmail(){
    this.router.navigate(["/resent-email"], 
    { queryParams: { language: this.language} });
  }
}
