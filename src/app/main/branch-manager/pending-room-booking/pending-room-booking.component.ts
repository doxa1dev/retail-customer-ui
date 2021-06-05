import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Location} from '@angular/common';
import { ActivitiesService} from 'app/core/service/activities.service'
import { Activity } from 'app/core/models/activity.model';
import { MatPaginator, } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'
import { Observable } from 'rxjs';
import { Title } from 'app/core/enum/title'
@Component({
  selector: 'app-pending-room-booking',
  templateUrl: './pending-room-booking.component.html',
  styleUrls: ['./pending-room-booking.component.scss'],
  encapsulation: ViewEncapsulation.Emulated

})
export class PendingRoomBookingComponent implements OnInit {
  title = Title.LEFT_LINK;
  Activities = [];
  activity: Activity;
  status : string;
  constructor(
    private router            : Router,
    private location          : Location,
    private activitiesService : ActivitiesService,
    private _activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<Activity>;
  
  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params =>
    {
      this.status = params.status;
    });
    if(this.status === 'pending'){
      this.activitiesService.getPendingRoomBookings().subscribe(data =>
      {
        this.Activities = data;
      })

    }else if(this.status === 'past')
    {
      this.activitiesService.getPastRoomBookings().subscribe(data=>{
        this.Activities = data;
        this.changeDetectorRef.detectChanges();
        this.dataSource = new MatTableDataSource(this.Activities)
        // console.log(this.dataSource)
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      })
    }
    
  }
  
  goToDetail(activity_id)
  {
    this.router.navigate(['branch-manager/pending-room-booking/room-booking-detail'], { queryParams: { activity_id: activity_id } });
  }
  back(){
    this.location.back();
  }
}
