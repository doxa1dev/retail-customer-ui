import { DOCUMENT, Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from 'app/core/enum/title';
import { AuthService } from 'app/core/service/auth.service';
import { ConvertService } from 'app/core/service/convert.service';
import { QuestionnaireService } from 'app/core/service/questionnaire.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { environment } from 'environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-questionnaire-responses',
  templateUrl: './questionnaire-responses.component.html',
  styleUrls: ['./questionnaire-responses.component.scss']
})
export class QuestionnaireResponsesComponent implements OnInit {

  title = Title.DOT;
  buttonName: string = 'EXPORT';
  active: boolean = false;
  typeReportValue: string = 'questionnaire';
  selectFilter: string;
  dataReport = [];
  isShow: boolean = false;
  version1 = environment.questionnaireOneVersion;
  version2 = environment.questionnaireTwoVersion;
  dayNow = moment(new Date()).format("YYYY-MM-DD");
  advisor_id : string;
  listSelect = [
    {
      label: 'Only Customers',
      value: 'CUSTOMERS'
    }, 
    {
      label: 'All Contacts',
      value: 'CONTACTS'
    }
  ];

  constructor(private location: Location,
    @Inject(DOCUMENT) private document: Document,
    private convertService: ConvertService,
    private questionnaireService: QuestionnaireService,
    private translateService: TranslateService,
    private authService : AuthService) { }
    
  ngOnInit(): void {
    this.authService.getAdvisorByCustomer().subscribe(data=>{
      if(!CheckNullOrUndefinedOrEmpty(data)){
        this.advisor_id = data.id;
      }
    })
  }

  SelectedFromList(event) {
    this.selectFilter = event.value.value;
    this.isShow = false;
  }

  back() {
    this.location.back();
  }

  exports() {
    if (CheckNullOrUndefinedOrEmpty(this.selectFilter)) {
      this.isShow = true;
      return;
    }

    this.active = true
    this.buttonName = this.translateService.instant('REPORTS.PROCESSING')
    this.questionnaireService.getDataQuestionnaireReport(this.selectFilter, this.version1).subscribe(
      data => {
        this.active = false;
        this.buttonName = this.translateService.instant('REPORTS.EXPORT');
        this.dataReport = data;
        this.convertService.downloadFile(this.dataReport, 'questionaire_report ' + this.dayNow, null, null, this.typeReportValue);
      }
    )
  }

  shareQuestionnaire(type : string){
    const port = this.document.location.port
    ? `:${this.document.location.port}`
    : "";
    let sendLinkUrl;
    if(type == 'pre')
    {
       sendLinkUrl = `${this.document.location.protocol}//${this.document.location.hostname}${port}/questionnaire/one?version=${this.version1}&advisor_id=${this.advisor_id}`;

    }else if(type == 'post')
    {
       sendLinkUrl = `${this.document.location.protocol}//${this.document.location.hostname}${port}/questionnaire/two?version=${this.version2}&advisor_id=${this.advisor_id}`;

    }

  
    const isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return (
          navigator.userAgent.match(/IEMobile/i) ||
          navigator.userAgent.match(/WPDesktop/i)
        );
      },
      any: function () {
        return (
          isMobile.Android() ||
          isMobile.BlackBerry() ||
          isMobile.iOS() ||
          isMobile.Opera() ||
          isMobile.Windows()
        );
      },
    };

    const messageText = `Welcome%20to%20Club%20Thermomix®.%20Please%20access%20this%20link%20to%20fill%20in%20your%20questionnaire:%20`;

    if (isMobile.any()) {
      const shareUrl = `whatsapp://send?text=${messageText}${encodeURIComponent(sendLinkUrl)}`;
      location.href = shareUrl;
    } else {
      window.open(
        `https://web.whatsapp.com/send?l=en&text=${messageText}${encodeURIComponent(
          sendLinkUrl
        )}`,
        "_blank"
      );
    }

  }

  

  copyLink(type : string){
    const port = this.document.location.port
    ? `:${this.document.location.port}`
    : "";
    let copyLink;
    if(type == 'pre')
    {
      copyLink = `${this.document.location.protocol}//${this.document.location.hostname}${port}/questionnaire/one?version=${this.version1}&advisor_id=${this.advisor_id}`;

    }else if(type == 'post')
    {
      copyLink = `${this.document.location.protocol}//${this.document.location.hostname}${port}/questionnaire/two?version=${this.version2}&advisor_id=${this.advisor_id}`;

    }
    let orderNumber = document.createElement('textarea');
      orderNumber.value = copyLink
    // if(type == 'pre')
    // {
    //   orderNumber.value = 'prelink'
    // }else{
    //   orderNumber.value = 'postlink'
    // }
      document.body.appendChild(orderNumber);
      orderNumber.select();
      document.execCommand('Copy');
      orderNumber.remove();
  }
}
