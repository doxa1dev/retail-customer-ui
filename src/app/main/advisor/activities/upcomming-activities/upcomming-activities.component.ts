import { Component, OnInit , ViewEncapsulation } from '@angular/core';
import { StringNullableChain } from 'lodash';
import { Location } from '@angular/common';
import { Router ,ActivatedRoute } from '@angular/router';
import { ActivitiesService } from 'app/core/service/activities.service'
import { from } from 'rxjs';
import { environment } from 'environments/environment';
import { Title } from 'app/core/enum/title'
@Component({
  selector: 'app-upcomming-activities',
  templateUrl: './upcomming-activities.component.html',
  styleUrls: ['./upcomming-activities.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class UpcommingActivitiesComponent implements OnInit {
  constructor(
    private _location : Location,
    private router:Router, private _activatedRoute: ActivatedRoute,
    private _activitiesService: ActivitiesService,
  ) { }
  title = Title.LEFT_LINK;
  arrClasses  = [];
  page: string = "";
  storageUrl = environment.storageUrl ;

  

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params=>{
      this.page = params.page;
    })
    if(this.page === "upcoming"){
      this._activitiesService.getAllActiveActivitiesOfAdvisor().subscribe(data=>{
        this.arrClasses = data;
      });
    }else if(this.page === "completed"){
      this._activitiesService.getAllCompletedActivitiesOfAdvisor().subscribe(data=>{
        this.arrClasses = data;
      });
    }else if(this.page === "rejected"){
      this._activitiesService.getAllRejectedActivitiesOfAdvisor().subscribe(data=>{
        this.arrClasses = data;
      });
    }else{
      this._activitiesService.getAllPendingActivitiesOfAdvisor().subscribe(data=>{
        this.arrClasses = data;
      });
    }
  }

  back(){
    this._location.back();
  }
}

export class Class{
  uri: string;
  title : string;
  address: string;
  advisor: string;
  day: string;
  start: string;
  end: string
}