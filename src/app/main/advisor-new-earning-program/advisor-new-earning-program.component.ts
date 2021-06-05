import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { RecruitmentService } from 'app/core/service/recruitment.service';

@Component({
  selector: 'app-advisor-new-earning-program',
  templateUrl: './advisor-new-earning-program.component.html',
  styleUrls: ['./advisor-new-earning-program.component.scss']
})
export class AdvisorNewEarningProgramComponent implements OnInit {
  is_router_to_package  : number = 0;
  decoded : any;
  constructor(
    private recruitmentService: RecruitmentService,
  ) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (!CheckNullOrUndefinedOrEmpty(token)){
        this.decoded = jwt_decode(token); 
        if(CheckNullOrUndefinedOrEmpty(this.decoded.email))
        {
          this.is_router_to_package = 1;
        }else{
          this.recruitmentService.checkRouterNaep().subscribe(data=>{
            if(data.code === 200)
            {
              this.is_router_to_package = 2;
            }else if(data.code == 201)
            {
              this.is_router_to_package = 1;
            }
          })
        }
    }else{
      this.is_router_to_package =  1;
    }
  }
}

