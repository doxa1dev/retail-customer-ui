import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Title } from 'app/core/enum/title';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location, formatDate } from '@angular/common';
import { Select } from 'app/core/models/reports.model';
import { ReportsService } from 'app/core/service/reports.service';
import { ConvertService } from 'app/core/service/convert.service';
import { isNullOrUndefined } from 'util';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import * as jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  title = Title.DOT;
  buttonName: string = 'EXPORT';
  active: boolean = false;
  startDay: string;
  endDay: Date = new Date();
  DateEndFormat: string;
  reportsForm: FormGroup;
  maxDateFrom: Date = new Date();
  minDateStart: Date = new Date();
  minDateEnd: Date  = new Date();
  isShow: boolean = false;
  branchName: string;
  totalQuantity: number;
  totalPrice: number;
  branch : string;
  //select
  listMultiSelect = [];
  listBranch = [];
  listTeam = [];
  listReports = [];
  listProduct = [];
  listSegment = [];

  //get value select
  branchValue: any;
  teamValue: any;
  categoryValue: any;
  reportsValue: any;
  segmentValue: any;

  typeReportValue
  salesPeriodValue
  endDate: string;
  teamName: string;
  listSalesPeriod=[];

  isShowNAEPRecruitment: boolean = false;
  isShowNAEPSuccess: boolean = false;
  isDisabled: boolean = true;

  selectedBranch: any = [];
  selectedTeam: any = [];
  selectedProduct: any = [];

  branchNameLabel: string;
  leaderNameLabel: string;
  branchNameId : any = [];
  decoded: any;
  isTeamLeader : boolean = false;
  constructor(private location: Location,
    private _formBuilder: FormBuilder,
    private reportsService: ReportsService,
    private convertService: ConvertService,
    private _changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService) {

      this.listProduct = [
        {
          name: 'All',
          value: 'all'
        },
        {
          name: 'Special Product',
          value: 'special_product'
        }
      ]
  
      this.listSalesPeriod = [
        {
          name: 'All',
          value: 0
        },
        {
          name: 'Under 45 days',
          value: 45
        },
        {
          name: 'Under 90 days',
          value: 90
        }
      ]

      this.listMultiSelect = [
        {
          name: 'Total sales',
          value: 'total_sales'
        },
        {
          name: 'Total recruitments',
          value: 'naep_recruitment'
        },
        {
          name: 'NAEP First sales',
          value: 'first_sales'
        },
        {
          name: 'NAEP Success',
          value: 'naep_success'
        }
      ]

      translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        this._changeDetectorRef.detectChanges();
        this.leaderNameLabel = this.translateService.instant('REPORTS.SELECT_TEAM');
      });
    }

  ngOnInit(): void {

    let token = localStorage.getItem('token');
      if (!isNullOrUndefined(token)){
          this.decoded = jwt_decode(token); 
      }


    this.reportsForm = this._formBuilder.group({
      type: ['', Validators.required],
      // branch: ['', Validators.required],
      team: ['', Validators.required],
      product: [{value: '', disabled: false}, Validators.required],
      period: [{value: '', disabled: true}, Validators.required],
      startDay: ['', Validators.required],
      endDay: ['', Validators.required],
    })

    this.reportsService.getBranchManager().subscribe(
      data => {
        this.listBranch = data
        // console.log(data)
        if(!isNullOrUndefined(data[0])){
          this.branchNameLabel = data[0].label
          this.branchNameId.push(data[0].value.id)
        }
        this.getTeamLeaderOfBranch(this.branchNameId);
        this.branchValue = this.changInArr(this.branchNameId);
      }
    )
    
    this.reportsService.getListProduct().subscribe(data=>{
      this.listProduct = data;
    })
  }

  getTeamLeaderOfBranch(branchName) {
    branchName = this.changInArr(branchName)
    this.reportsService.getTeamLeaderOfBranch(branchName).subscribe(data=>{
      this.listTeam = data;
      if (this.decoded.role.length > 0){
        // console.log(this.decoded)
        if (this.decoded.role.indexOf("TEAM_LEADER") !== -1 && this.decoded.role.indexOf("BRANCH_MANAGER") === -1){
          this.isDisabled = true  ;
          this.reportsForm.get('team').disable();
          this.isTeamLeader = true;
          let name;
          let arrId = [];
           this.listTeam.forEach(element => {
            if(element.value.id === this.decoded.user_id){
              name = element
              arrId.push(element.value.id)
            }
          });
          this.teamValue = this.changInArr(arrId);
          if(!isNullOrUndefined(name)){
            this.leaderNameLabel = name.label
          }
        }else{
          this.isDisabled = false  ;
          // this.leaderNameLabel = "Select Team"
          this.leaderNameLabel = this.translateService.instant('REPORTS.SELECT_TEAM');
        }
      }
    })
  }

  SelectedTypeReports(event) {
    this.typeReportValue = event.value.value;

    if (event.value.value === "naep_recruitment") {
      this.reportsForm.get('product').disable();
      this.reportsForm.get('period').disable();
      this.isShowNAEPRecruitment = true;
      this.isShowNAEPSuccess = false;
    } else if (event.value.value === "naep_success") {
      this.reportsForm.get('product').disable();
      this.reportsForm.get('period').enable();
      this.isShowNAEPRecruitment = true;
      this.isShowNAEPSuccess = true;
    } else if (event.value.value === "total_sales") {
      this.reportsForm.get('product').enable();
      this.reportsForm.get('period').disable();
      this.isShowNAEPRecruitment = false;
      this.isShowNAEPSuccess = false;
    } else if (event.value.value === "first_sales") {
      this.reportsForm.get('product').enable();
      this.reportsForm.get('period').disable();
      this.isShowNAEPRecruitment = false;
      this.isShowNAEPSuccess = false;
    }
  }

  onChangeFrom(event) {
    this.startDay = formatDate(event, "yyyy-MM-dd", "en-US");
    this.minDateEnd = event;
  }

  onChangeTo(event) {
    this.endDay.setDate(event.getDate()+1)
    // this.DateEndFormat = formatDate(this.endDay, "yyyy/MM/dd", "en-US");
    this.endDate = formatDate(this.endDay, "yyyy-MM-dd", "en-US");
    this.DateEndFormat = formatDate(event, "yyyy-MM-dd", "en-US");
  }

  SelectedBranch(event) {
    if (event.value.length != 0) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
    // this.branchValue = event.value.customerId;
    let listBranchName = [];
    event.value.forEach(element => {
      listBranchName.push(element.name)
    });
    this.branchName = listBranchName.toString();

    //get data team by branch
    let listIdBranchSelect = [];
    event.value.forEach(element => {
      listIdBranchSelect.push(element.id)
    });
    this.getTeamLeaderOfBranch(listIdBranchSelect);

    //get list data id branch
    this.selectedBranch = [];
    event.value.forEach(element => {
      this.selectedBranch.push(element.id)
    });

    this.branchValue = this.changInArr(this.selectedBranch);
  }

  SelectedTeam(event) {
    this.selectedTeam = [];
    event.value.forEach(element => {
      this.selectedTeam.push(element.id)
    });

    this.teamValue = this.changInArr(this.selectedTeam);

    let listTeamName = [];
    event.value.forEach(element => {
      listTeamName.push(element.name)
    });
    this.teamName = listTeamName.toString();
  }

  SelectedProduct(event) {
    this.selectedProduct = [];
    event.value.forEach(element => {
      this.selectedProduct.push(element.id)
    });

    this.categoryValue = this.changInArr(this.selectedProduct);
  }

  SelectedSalesPeriod(event) {
    this.salesPeriodValue = event.value.value;
  }

  back() {
    this.location.back();
  }
  
  // exportFile() {
  //   this.isShow = true;
  //   if (this.reportsForm.invalid)
  //   {
  //     return;
  //   }

  //   var formExports = {
  //     type: "sang",
  //     start: this.startDay,
  //     end: this.endDay,
  //     branch: Number(this.branchValue),
  //     team: this.teamValue,
  //     category: this.categoryValue,
  //     segment: this.segmentValue
  //   }

  //   this.reportsService.getDataReport(formExports).subscribe(
  //     data => {
  //       let dataGet;
  //       dataGet = this.reportsService.renderReports(data);

  //       let result = dataGet.fileCSV
  //       this.totalQuantity = dataGet.sumQuantity;
  //       this.totalPrice = dataGet.sumTotal;

  //       this.convertService.downloadFile(result, 'Sales of all/all at ' + this.branchName + ' branch from ' 
  //       + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice , typeReportValue)
  //     }
  //   )
  // }

  exports() {
    this.isShow = true;

    if (this.reportsForm.invalid)
    {
      return;
    }
    
    // var formExports = {
    //   type: this.typeReportValue,
    //   start: this.startDay,
    //   end: this.endDate,
    //   branch: Number(this.branchValue),
    //   team: this.teamValue,
    //   category: this.categoryValue,
    //   segment: this.segmentValue
    // }
    this.active = true
    this.buttonName = this.translateService.instant('REPORTS.PROCESSING')

    this.reportsService.reportData(this.typeReportValue, this.startDay, this.endDate,
        this.branchValue, this.teamValue, this.categoryValue, this.salesPeriodValue).subscribe(
      data => {
        if (data.code === 200) {
          this.active = false;
          this.buttonName = this.translateService.instant('REPORTS.EXPORT');
          
          let dataGet;
          if (this.typeReportValue === 'total_sales') {
            dataGet = this.reportsService.renderTotalSalesReports(data);
          } else {
            dataGet = this.reportsService.renderNAEPReports(data);
          }
          let result = dataGet.fileCSV
          this.totalQuantity = dataGet.sumQuantity;
          this.totalPrice = dataGet.sumTotal;

          if (this.typeReportValue === 'total_sales') {
            this.convertService.downloadFile(result, 'Sales of specific products at ' + this.branchNameLabel + ' branch from ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
          } else if (this.typeReportValue === 'naep_recruitment'){
            this.convertService.downloadFile(result, 'NAEP recruitment at ' + this.branchNameLabel + ' branch from ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
          } else if (this.typeReportValue === 'first_sales'){
            this.convertService.downloadFile(result, 'First sales of specific products at ' + this.teamName + " of " + this.branchNameLabel + ' branch from ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
          } else if (this.typeReportValue === 'naep_success'){
            this.convertService.downloadFile(result, '45/90 days NAEP winners at ' + this.teamName + " of " + this.branchNameLabel + ' branch from ' + this.startDay + ' to ' + this.DateEndFormat , this.totalQuantity, this.totalPrice, this.typeReportValue)
          }
        }
      }
    )
  }

  changInArr(arr){
    if(!isNullOrUndefined(arr)){
      if (arr.length > 0) {
        let merge = '('
        for (let index = 0; index < arr.length; index++) {
            if(index === 0){
                merge = merge +  arr[0];
            } else {
                merge = merge + ',' + arr[index]
            }
    
        }
        return merge + ')'
        } else {
          return;
        }
    }
  }

  // get translation
  // getTranslation(key: string) {
  //   return this.translateService.getStreamOnTranslationChange(key);
  // }
}
