import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GridApi, GridSizeChangedEvent, IGetRowsParams } from 'ag-grid-community';
import { TeamdLeaderService} from 'app/core/service/teamleader.service';
import { listRecruit} from 'app/core/models/list_recruit.model';
import { RecruitEnum} from 'app/core/enum/recruit';
import {StatusRecruitComponent} from './status-recruit/status-recruit.component';
import { Title } from 'app/core/enum/title'
import { isNullOrUndefined } from 'util';
import { TranslateService, LangChangeEvent  } from '@ngx-translate/core';
@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss']
})
export class RecruitmentComponent implements OnInit {
  title = Title.DOT
  listRecruitArray = [] as any;
  defaultColDef
  gridApi: GridApi
  totalElements: number;
  page = 1;
  gridOptions ;

  public currentLang: string;
  cruitCustomer: string
  cruitStatus: string

  constructor(
    private teamdLeaderService : TeamdLeaderService,
    private translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { 
    this.currentLang = translateService.currentLang;

    this.gridOptions = {
      rowHeight: 85,
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
      context: {
        componentParent: this
      }
    };

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      // TODO This as a workaround.
      this._changeDetectorRef.detectChanges();
      this.cruitCustomer = this.translateService.instant('TEAM_LEADER.LIST_CRUIT_CUSTOMER');
      this.cruitStatus = this.translateService.instant('TEAM_LEADER.LIST_CRUIT_STATUS');
      var colCustomer = this.gridOptions.columnApi.getColumn('customer');
      var colDefCustomer = colCustomer.getColDef();
      colDefCustomer.headerName = this.cruitCustomer;
      var colStatus = this.gridOptions.columnApi.getColumn('status');
      var colDefStatus = colStatus.getColDef();
      colDefStatus.headerName = this.cruitStatus;
      this.gridOptions.api.refreshHeader();
    });
  }

  columnAdvisor = [
    { headerName: this.cruitCustomer, field: "customer", resizable: false, filter: 'agTextColumnFilter', cellRenderer: CustomerRenderer},
    { headerName: this.cruitStatus, field: "status", resizable: false, filter: true, 
    filterParams: {
      filterOptions: ['inRange']
      }, disabled: true, "cellRendererFramework": StatusRecruitComponent},
  ];

  ngOnInit(): void
  { 
    // this.teamdLeaderService.getlistRecruit().subscribe(
    //   (data) =>{
    //     this.listRecruitArray = data;
    //   }
    // )
    // console.log(this.listRecruitArray)
  }

  onGridReady(params)
  {
    this.gridApi = params.api;
    this.getMethod(params.api)
  }

  onGridSizeChanged(params: GridSizeChangedEvent)
  {
    params.api.sizeColumnsToFit();
  }

  goToRecruitDetail(){
    // console.log("THACH")
  }

  getMethod(api:GridApi) {
  
    var datasource = {
      getRows: (params: IGetRowsParams) => {
       
        this.page = params.startRow/10 + 1
          this.teamdLeaderService.getlistRecruit(params, this.page, 10).subscribe(data => {
            this.listRecruitArray = data.returnListRecruit;
            this.totalElements = data.count;
            setTimeout(function(){
              params.successCallback(data.returnListRecruit , data.count)
            },500)
          },err=>[]);
        
      }
    };
   
    api.setDatasource(datasource); 
    
  }

}

// function CustomerRenderer(params)
// {
//   let customer_name = params.value.customer_name;
//   let customer_email = params.value.email;
//   let customer_phone = '(+' + params.value.dial_code + ')' + ' ' + params.value.phone_number;
  
//   let returnData = `
//     <p class="p-aggrid" style="margin:0px; padding:0px" >${customer_name}</p>
//     <p style="margin:0px; padding:0px">${customer_email}</p>
//     <p style="margin:0px; padding:0px">${customer_phone}</p>
//   `
//   return returnData;
// }



function CustomerRenderer(params)
{
  if(!isNullOrUndefined(params.value)){
    let customer_name = params.value.customer_name;
    let customer_email = params.value.email;
    let customer_phone = '(+' + params.value.dial_code + ')' + ' ' + params.value.phone_number;
    let returnData = `
    <p class="p-aggrid" style="margin:0px; padding:0px; color: #5a616f;  font-size: 12px" >${customer_name}</p>
    <p style="margin: -5px 0px 0px 0px;; padding:0px; color: #C8CBDC;  font-size: 10px">${customer_email}</p>
    <p style="margin: -10px 0px 0px 0px;; padding:0px; color: #C8CBDC;  font-size: 10px">${customer_phone}</p>
    `
    return returnData;
  }
  
  
}


function StatusRenderer(params)
{
  if(!isNullOrUndefined(params.value)){
    let returnData : string;
    const status = params.value.recruit_status;
    const uuid = params.value.recruit_uuid;
    if (status === RecruitEnum.APPROVED)
    {
      returnData = '<p style="color: #269a3e; font-size: 14px; margin:0px; padding:0px; cursor: pointer">Approved by Admin</p>';
    }else if(status === RecruitEnum.REJECTED){
      returnData = '<p style="color: #DE3535; font-size: 14px; margin:0px; padding:0px; cursor: pointer">Rejected by Admin</p>';
    }
    else if(status === RecruitEnum.PENDING){
      returnData = `<p style="color: #5a616f; font-size: 14px; margin:0px; padding:0px; cursor: pointer">Pending from Team Leader</p>
      <button (click)="goToRecruitDetail()">VIEW</button>
      `;
    }
    return returnData;
  }
  
}
