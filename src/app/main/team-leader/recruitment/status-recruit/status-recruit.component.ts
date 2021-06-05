import { Component, OnInit } from '@angular/core';
import { RecruitEnum } from 'app/core/enum/recruit';
import { Router } from '@angular/router'
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-status-recruit',
  templateUrl: './status-recruit.component.html',
  styleUrls: ['./status-recruit.component.scss']
})
export class StatusRecruitComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  
  gridApi: any;
  active: any;
  params: any;
  id: any;
  status_recruit : RecruitEnum;
  status_recruit_uuid : string;

  status_pending = RecruitEnum.PENDING;
  status_approve = RecruitEnum.APPROVED;
  status_reject = RecruitEnum.REJECTED;
  agInit(params)
  {
    this.gridApi = params.api;
    this.params = params;
    // this.id = params.data.id;
    this.active = params.value;
    // console.log(params)
  }
  ngOnInit(): void
  {
    if(!isNullOrUndefined(this.params.value)){
      this.status_recruit = this.params.value.recruit_status;
      this.status_recruit_uuid = this.params.value.recruit_uuid;
    }

  }
  goDetail(){
    this.router.navigate(['/teamleader/recruitment/detail'], { queryParams: { uuid: this.status_recruit_uuid } })
  }
}
