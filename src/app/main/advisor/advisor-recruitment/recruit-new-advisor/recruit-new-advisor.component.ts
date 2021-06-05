import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Title } from 'app/core/enum/title';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { RecruitmentService, CustomerInformationNewAdvisor } from 'app/core/service/recruitment.service';
import { MatRadioChange } from '@angular/material/radio';
import { MatPaginator, PageEvent, } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { CommonDialogComponent } from "app/main/common-dialog/common-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pattern} from 'app/core/enum/pattern';
import { catchError } from 'rxjs/internal/operators/catchError';

@Component({
  selector: 'app-recruit-new-advisor',
  templateUrl: './recruit-new-advisor.component.html',
  styleUrls: ['./recruit-new-advisor.component.scss']
})
export class RecruitNewAdvisorComponent implements OnInit {

  title = Title.LEFT
  isShow: boolean = true;
  searchNoData: boolean = false;
  isShowListData: boolean = false;
  advisorSearch: string;
  selected: string;
  uuid: string;
  disabled: boolean = true;
  warrantyArray = new Array<CustomerInformationNewAdvisor>();
  pageEvent: PageEvent;
  totalSize: number = 0;

  //invite
  isShowInvite: boolean = false;
  inviteForm: FormGroup;
  isShowError: boolean = false;

  //loading
  buttonName = "Recruit";
  active: boolean = false;
  loading: boolean = true; 
  
  constructor(private location: Location,
    private router: Router,
    private recruitmentService: RecruitmentService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder) { }
    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<CustomerInformationNewAdvisor>;

  ngOnInit(): void {
    this.inviteForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(pattern.email)]],
    });
  }

  back(){
    this.location.back();
  }

  createCustomerRecruitment() {
    this.recruitmentService.createRecruitmentByAdvisor(this.uuid).subscribe(response=>{
      if(response.code === 200)
      {
        this.router.navigate(['/advisor/recruit-new-advisor-done'])
      }else{
        const dialogRef = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message: "Error when recruit, please try later.",
            title: "CONFIRM",
            colorButton: false,
          },
        });
      }
    })
  }

  searchCustomer() {
    this.isShow = false;

    this.recruitmentService.searchCustomerByName(this.advisorSearch).subscribe( data => {
      if (data.length === 0) {
        this.searchNoData = true
        this.isShowListData = false
      } else {
        this.totalSize = data.length;
        this.searchNoData = false
        this.isShowListData = true
        this.warrantyArray = data
        this.dataSource = new MatTableDataSource(this.warrantyArray);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.obs = this.dataSource.connect();
      }
    })
  }

  radioChange(event: MatRadioChange){
    this.uuid = event.value
    this.disabled = false
  }

  showFormInvite() {
    if (this.isShowInvite) {
      this.isShowInvite = false;

      this.inviteForm.setValue({
        name: '',
        email: ''
      });

      this.isShowError = false;
    } else {
      this.isShowInvite = true;
    }
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
            this.buttonName = "Recruit";
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
            this.buttonName = "Recruit";
          }
          // this.dialog.closeAll()
        }
  

      )
    }
  }

  
}
