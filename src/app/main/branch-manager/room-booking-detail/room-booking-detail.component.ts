import { Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute} from '@angular/router';
// import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog} from '@angular/material/dialog';
import { ActivitiesService } from 'app/core/service/activities.service';
import { Activity } from 'app/core/models/activity.model';
import { environment } from 'environments/environment';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { isNullOrUndefined } from 'util';
import { Title } from 'app/core/enum/title'
import { TranslateService } from '@ngx-translate/core';
import { DialogConfirmComponent} from 'app/main/common-component/dialog-confirm/dialog-confirm.component'

@Component({
  selector: 'app-room-booking-detail',
  templateUrl: './room-booking-detail.component.html',
  styleUrls: ['./room-booking-detail.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RoomBookingDetailComponent implements OnInit {
  title = Title.LEFT;
  id: number;
  activity: Activity;
  storageUrl = environment.storageUrl;
  inputComment: string ='';
  language: string;
  showErrorMessage : boolean  = false;
  constructor(
    private location : Location,
    private router   : Router,
    public  dialog    : MatDialog,
    private _activitiesService: ActivitiesService,
    private _activatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
  ) { }
  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params =>
    {
      this.id = params.activity_id;
    });
    this._activitiesService.getActivityById(this.id).subscribe(data =>
    {
      
      this.activity = data;
    })
    this.language = 'en'
    this._translateService.setDefaultLang(this.language);
    const browserLang = this._translateService.getBrowserLang();
    this._translateService.use(this.language);
  }

  goRoomStatus(){
    this.router.navigate(['branch-manager/room-status'],{queryParams : {date : this.activity.activity_date}});
  }
  onKey(event){
    if(event.target.value !== "")
    {
    this.showErrorMessage = false;

    }
    else{
    this.showErrorMessage = true;
      
    }
  }
  rejectActivity(activity_id)
  {
    if(this.inputComment === ''){
      this.showErrorMessage = true;
      return;
    }
    this.showErrorMessage = false;
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: { message: 'Do you wish to reject this activity?', type : "REJECTED" }
      
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result === true){
       
        //reject activity here
        this._activitiesService.rejectActivity(activity_id, { comment  : this.inputComment}).subscribe(data =>{
          if(data.code === 200)
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Activity was rejected.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(data =>
            {
              this.router.navigate(['/branch-manager/pending-room-booking'], { queryParams: { status: 'pending' } })
            })
          }
        })
       
      }else{
        dialogRef.close();
      }
    })
  }

  approveActivity(activity_id)
  {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: { message: 'Do you wish to approve this activity?', type : "APPROVED" }
    });
    dialogRef.afterClosed().subscribe(result =>
    {
      if (result === true)
      {

        //approve activity here
        this._activitiesService.approveActivity(activity_id).subscribe(data =>
        {
          if (data.code === 200)
          {
            if (data.is_approved === true)
            {
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    'Slot was booked previously. Please REJECT this activity.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(data =>
              {
                
              })
            }
            else{
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    'Activity was approved.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(data =>
              {
                this.router.navigate(['/branch-manager/pending-room-booking'], { queryParams: { status: 'pending' } })
              })
            }
            
          }
        })

      } else
      {
        dialogRef.close();
      }
    })
  }

  back(){
    this.location.back();
  }
}
