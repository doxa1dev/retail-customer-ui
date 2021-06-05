import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivitiesService} from 'app/core/service/activities.service';
import { environment } from 'environments/environment';
import { ActivityService } from 'app/core/service/activity.service';
import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { Title } from 'app/core/enum/title';

@Component({
  selector: 'app-find-class',
  templateUrl: './find-class.component.html',
  styleUrls: ['./find-class.component.scss']
})
export class FindClassComponent implements OnInit {
  title = Title.LEFT;
  storageUrl = environment.storageUrl;
  constructor(
    private _location : Location,
    private router:Router, 
    private _activatedRoute: ActivatedRoute,
    private _activitiesService: ActivitiesService,
    private activityService: ActivityService,
    public dialog: MatDialog
  ) { }
    arrClasses = [];
    /** input search */
    dataSearch: string;
    /** filter search */
    filterSearch: string;
    /**min Date */
    minDate: Date;
    /** check data */
    check: boolean;

    active: boolean = false;
    buttonName: string = "SEARCH"
    
  ngOnInit() {
    // this._activitiesService.getAllReserveActivitiesOfCustomer().subscribe(
    //   data => {
    //     this.arrClasses = data;
    //   }
    // )
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() - 1);
  }

  /**
   * Search
   */
  search(){
    this.active = true;
    this.buttonName = "Processing..."
    var dateDate: Date;
    var firstDay: Date;
    var lastDay: Date;
    var today: Date = new Date();
    var todayFirst = new Date(today.getFullYear(), today.getMonth(), 1);
    if(!isNullOrUndefined(this.filterSearch)){
       dateDate = new Date(this.filterSearch);
       firstDay = new Date(dateDate.getFullYear(), dateDate.getMonth(), 1);
       lastDay = new Date(dateDate.getFullYear(), dateDate.getMonth() + 1, 0);
       if(todayFirst.getTime() == firstDay.getTime()){
        firstDay = new Date();
       }
    }
    this.activityService.findClassFilter(this.dataSearch, firstDay, lastDay).subscribe(
      data => {
        if(data.length > 0){
          this.active = false;
          this.buttonName = "SEARCH"
          this.arrClasses = data;
          this.check = false;
        } else {
          this.active = false;
          this.buttonName = "SEARCH"
          this.check = true;
          this.arrClasses = [];
        }
      }
    )
    
  }

  back(){
    this._location.back();
  }

  Reserve(classID){
    this._activitiesService.reserveActivity(classID).subscribe(
      data =>{
        if(data.code === 200){
          this.router.navigate(['/activity-overview/booking-done'])
        }else if(data.code === 100){
          const dialogNotifi = this.dialog.open(CommonDialogComponent, { 
            width: "500px",
            data: {
              message:
                "Class is full capacity. Please choose another!",
              title:
                "NOTIFICATION",
              colorButton: true
            },
          });
        } else if (data.code === 201) {
          const dialogNotifi = this.dialog.open(CommonDialogComponent, { 
            width: "500px",
            data: {
              message:
                "This activity is hosted by different branch/team. Please join another activity",
              title:
                "NOTIFICATION",
              colorButton: true
            },
          });
        } else if (data.code === 202) {
          const dialogNotifi = this.dialog.open(CommonDialogComponent, { 
            width: "500px",
            data: {
              message: data.message,
              title:
                "NOTIFICATION",
              colorButton: true
            },
          });
        }
      }
    )
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