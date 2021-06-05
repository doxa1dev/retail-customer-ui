import { Title } from 'app/core/enum/title';
import { Component, OnInit, ChangeDetectorRef, NgZone,ViewEncapsulation, Inject } from '@angular/core';
import { GridApi, GridSizeChangedEvent, IGetRowsParams, GridOptions } from 'ag-grid-community';
import { RecruitmentService } from 'app/core/service/recruitment.service';
import { RecruitEnum, RecruitEnum2 } from 'app/core/enum/recruit';
import { isNullOrUndefined } from 'util';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pattern} from 'app/core/enum/pattern';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MyContactsService } from 'app/core/service/my-contact.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { DOCUMENT, formatDate, Location } from "@angular/common";

@Component({
  selector: 'app-advisor-recruitment',
  templateUrl: './advisor-recruitment.component.html',
  styleUrls: ['./advisor-recruitment.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AdvisorRecruitmentComponent implements OnInit {
  title = Title.DOT;
  advisorArray = []
  defaultColDef
  gridApi: GridApi
  gridOptions:GridOptions;
  gridColumnApi;
  page: number = 1;
  totalElements: number;
  noRowsTemplate;
  loadingTemplate;
  columnAdvisor;
  public currentLang: string;
  cruitCustomer: string;
  cruitStatus: string;
  cruitRecruitedBy: string = 'Recruited By';

  //invite
  isShowInvite: boolean = false;
  inviteForm: FormGroup;
  isShowError: boolean = false;
  buttonName = "Via Email";
  buttonName2 = "Via Whatsapp";
  active: boolean = false;
  active2: boolean = false;

  customerContacts: ContactList;
  contact_list : ContactList[];
  getLink: string;

  constructor(private recruitmentService: RecruitmentService,
    public translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
    private router : Router,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private _contactService: MyContactsService,
    @Inject(DOCUMENT) private document: Document,


    ) {

      this.currentLang = translateService.currentLang;

      this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        this.currentLang = event.lang;
        this._changeDetectorRef.detectChanges();
        this.cruitCustomer = this.translateService.instant('ADVISOR_RECRUITMENT.INFOR_CUSTOMER');
        this.cruitStatus = this.translateService.instant('ADVISOR_RECRUITMENT.STATUS');
        this.cruitRecruitedBy = this.translateService.instant('ADVISOR_RECRUITMENT.RECRUITED');
        let colCustomer = this.gridOptions.columnApi.getColumn('customer');
        let colDefCustomer = colCustomer.getColDef();
        colDefCustomer.headerName = this.cruitCustomer;
        let colStatus = this.gridOptions.columnApi.getColumn('status');
        let colDefStatus = colStatus.getColDef();
        colDefStatus.headerName = this.cruitStatus;
        let colRecruitedBy = this.gridOptions.columnApi.getColumn('recruitedby');
        let colDefRecruitedBy = colRecruitedBy.getColDef();
        colDefRecruitedBy.headerName = this.cruitRecruitedBy;

        this.gridOptions.api.refreshHeader();
      });

      this.inviteForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(pattern.email)]],
      });

      this.gridOptions = {
        rowHeight: 65,
        rowStyle: { 'padding': '0px 0px' },
        rowSelection: 'single',
        maxBlocksInCache: 2,
        cacheBlockSize: 10,
        paginationAutoPageSize: false,
        pagination: true,
        paginationPageSize: 10,
        enableServerSideFilter: true,
        enableFilter:true,
        enableServerSideSorting: true,
        rowModelType: 'infinite',
        sortingOrder: ["asc", "desc"],
      };
      this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
      this.noRowsTemplate = `"<span">no rows to show</span>"`;
  }

  
  ngOnInit(): void {
    this.columnAdvisor = [
      { headerName: this.cruitCustomer, field: "customer", resizable: false, filter: 'agTextColumnFilter', cellRenderer: CustomerRenderer},
      { headerName: this.cruitStatus, field: "status", resizable: false, filter: true,
      filterParams: {
        filterOptions: ['inRange'],
      }, cellRenderer: StatusRenderer},
      { headerName: this.cruitRecruitedBy, field: "recruitedby", resizable: false, filter: 'agTextColumnFilter', cellRenderer: RecruiterRenderer},
    ];
  

    this._contactService.getContactListNaep('').subscribe(data=>{
      this.contact_list = data;

     })

  }

  onGridReady(params) {
    this.gridApi = params.api
    this.getMethod(params.api)
  }

  onGridSizeChanged(params: GridSizeChangedEvent)
  {
    if (window.innerWidth >= 599) {
      params.api.sizeColumnsToFit();
    }
  }

  async getValueContact(changedValue){
    this.customerContacts = changedValue.value;
  
  }

  getMethod(api:GridApi) {
  
    var datasource = {
      getRows: (params: IGetRowsParams) => {
       
        this.page = params.startRow/10 + 1
          this.recruitmentService.getSubmissionHistory(params, this.page, 10).subscribe(data => {
            this.advisorArray = data.returnListRecruit;
       
            this.totalElements = data.count;
            setTimeout(function(){
              params.successCallback(data.returnListRecruit , data.count)
            },500)
          },err=>[]);
        
      }
    };
   
    api.setDatasource(datasource); 
    
  }

  onViewCustomerNaepInfor(event){
    this.ngZone.run(() => this.router.navigate(['advisor/recruitment/customer-naep-infomation'],{ queryParams: { uuid: event.data.customer.uuid} })).then();
  }

  inviteEmail() {
    this.isShowError = true;

    if (this.inviteForm.invalid) {
      return;
    } else {

      this.active = true;
      this.buttonName = "Processing...";
      return this.recruitmentService.inviteNewContactByName(this.inviteForm.value.name.trim().toLowerCase(), 
      this.inviteForm.value.email.trim().toLowerCase()).subscribe(
        data => {
        
          if (data.code === 200) {
            this.router.navigate(['/advisor/recruit-new-advisor-done'])
          } 
          else if (data.code === 203) {
            this.active = false;
            this.buttonName = "Via Email";
            const dialogNotifi = this.dialog.open(CommonDialogComponent, { 
              width: "500px",
              data: {
                message: "This user has already become an advisor, please invite another person",
                title:
                  "NOTIFICATION",
                colorButton: true
              },
            });
          
          } 
          else {
            if(data = "0") {
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: "Unauthorized Access. You are not allowed to access this page.",
                  title: "NOTIFICATION",
                  colorButton: false,
                },
              }); 
            }
            this.active = false;
            this.buttonName = "Via Email";
          }
        }
      )
    }
  }

  inviteEmailContact() {
    
    if(CheckNullOrUndefinedOrEmpty(this.customerContacts)) {
      
      const dialogNotifi = this.dialog.open(CommonDialogComponent, { 
        width: "500px",
        data: {
          message: "Please select the customer to recruit.",
          title:
            "NOTIFICATION",
          colorButton: false
        },
      });
      this.active = false;
      this.buttonName = "Via Email";
    } else {

      this.active = true;
      this.buttonName = "Processing...";

      return this.recruitmentService.inviteNewContactByName(this.customerContacts.first_name.trim().toLowerCase(), 
      this.customerContacts.email.trim().toLowerCase()).subscribe(
        data => {
        
          if (data.code === 200) {
            this.router.navigate(['/advisor/recruit-new-advisor-done'])
          } 
      
          else {
            this.active = false;
            this.buttonName = "Via Email";
            const dialogNotifi = this.dialog.open(CommonDialogComponent, { 
              width: "500px",
              data: {
                message: "This user has already become an advisor, please invite another person",
                title:
                  "NOTIFICATION",
                colorButton: true
              },
            });
          
            this.active = false;
            this.buttonName = "Via Email";
          }
        }
      )
    }
  }

  inviteWhatsapp() {


    this.isShowError = true;

    if (this.inviteForm.invalid) {
      return;
    } else {

      this.active2 = true;
      this.buttonName2 = "Processing...";
      return this.recruitmentService.inviteNewContactbyWhatsapp(this.inviteForm.value.name.trim().toLowerCase(), 
      this.inviteForm.value.email.trim().toLowerCase()).subscribe(
        data => {
        
          if (data.code === 200) {
            this.getLink = data.data;
            this.shareWhatsapp()
           this.active2 = false;
           this.buttonName2 = "Via Whatsapp";

          } 
    
          else {
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: data.message,
                  title: "NOTIFICATION",
                  colorButton: false,
                },
              }); 
            
            this.active2 = false;
            this.buttonName2 = "Via Whatsapp";
          }
        }
      )
    }

  }

  inviteWhatsappContact() {
    // console.log(this.customerContacts)
    if(CheckNullOrUndefinedOrEmpty(this.customerContacts)) {
      const dialogNotifi = this.dialog.open(CommonDialogComponent, { 
        width: "500px",
        data: {
          message: "Please select the customer to recruit.",
          title:
            "NOTIFICATION",
          colorButton: false
        },
      });
    
      this.active2 = false;
      this.buttonName2 = "Via Whatsapp";
    } else {
      this.active2 = true;
      this.buttonName2 = "Processing...";
      return this.recruitmentService.inviteNewContactbyWhatsapp(this.customerContacts.first_name.trim().toLowerCase(), 
      this.customerContacts.email.trim().toLowerCase()).subscribe(
        data => {
          if (!CheckNullOrUndefinedOrEmpty(this.customerContacts.first_name)) {

          
          if (data.code === 200) {
            this.getLink = data.data;
            this.shareWhatsapp()
           this.active2 = false;
           this.buttonName2 = "Via Whatsapp";

          }
          else {
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: data.message,
                  title: "NOTIFICATION",
                  colorButton: false,
                },
              }); 
            
            this.active2 = false;
            this.buttonName2 = "Via Whatsapp";
          }
        }
        }
      )
    }


  }

  shareWhatsapp() {

   // const port = this.document.location.port ? `:${this.document.location.port}` : ''
     const registerURL = `${this.getLink}`;

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

    // const messageText = `I%20would%20like%20to%20invite%20you%20to%20join%20my%Thermomix®%20event%20at%20`

    const messageText = `Yay!%20You’re%20on%20your%20way%20to%20earn%20a%20free%20Thermomix®!%20Start%20now%20at:%20`
    if (isMobile.any()) {
      const shareUrl = `whatsapp://send?text=${messageText}${registerURL}`;
      location.href = shareUrl;
    } else {
      window.open(
        `https://web.whatsapp.com/send?l=en&text=${messageText}${encodeURIComponent(registerURL)}`,
        '_blank'
      );
    }

  }


}

function CustomerRenderer(params)
{
  if(!isNullOrUndefined(params.value)){
    let customer_name = params.value.customer_name;
    let customer_email = params.value.email;
    let customer_phone_number = params.value.phone_number;
    let returnData = `
    <p class="p-aggrid" style="margin:0px; padding:0px; color: var(--border-color); font-size: 12px" >${customer_name}</p>
    <p style="margin: -5px 0px 0px 0px;; padding:0px; color: var(--border-color); font-size: 12px">${customer_email}</p>
    <p style="margin: -10px 0px 0px 0px;; padding:0px; color: var(--border-color); font-size: 12px">${customer_phone_number}</p>
    `
    return returnData;
  }
  
}

function StatusRenderer(params)
{
  if(!isNullOrUndefined(params.value)){
    
    let returnData : string;
    const status = params.value.recruit_status;
    if (status === RecruitEnum2.COMPLETED)
    {
      returnData = `<p style="color: #269A3E; font-size: 14px; margin:0px; padding:0px; font-size: 12px; white-space: normal;">Customer became advisor</p>`;
    }else if(status === RecruitEnum2.APPLY){
      returnData = `<p style="color: orange; font-size: 14px; margin:0px; padding:0px; font-size: 12px; white-space: normal;">Customer submitted application</p>`;
    }
    else if(status === RecruitEnum2.SUBMIT){
      returnData = `<p style="color: #5a616f; font-size: 14px; margin:0px; padding:0px; font-size: 12px; white-space: normal;">Application form sent</p>`;
    }
    return returnData;
    }

}

function RecruiterRenderer(params)
{
  if(!isNullOrUndefined(params.value)){
    let recruiterId = params.value.recruiterId;
    let recruiterName = params.value.recruiterName;

    let returnData = `
    <p class="p-aggrid" style="margin:0px; padding:0px; color: var(--border-color); font-size: 12px" >${recruiterName}<span> (ID: ${recruiterId})</span></p>
    `
    return returnData;
  }
  
  
}


interface ContactList{
  id : number;
  email: string;
  first_name: string;
  phone_dial_code: string;
  phone_number: string;

}