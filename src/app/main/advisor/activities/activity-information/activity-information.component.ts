import { Component, OnInit, Inject } from '@angular/core';
import { Activity, Attendee } from '../../../../core/models/activity.model';
import { AppModule } from 'app/app.module';
import { Location, DOCUMENT } from '@angular/common';
// import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DialogConfirmComponent} from 'app/main/common-component/dialog-confirm/dialog-confirm.component';

import { MatDialog } from '@angular/material/dialog';
import { ActivitiesService } from 'app/core/service/activities.service';
import { ActivatedRoute, Router } from '@angular/router'
import { GeolocationService} from 'app/core/service/geolocation.service';
import { PlaceLocation} from 'app/core/models/place.model';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { environment } from 'environments/environment';
import { Title } from 'app/core/enum/title';
@Component({
  selector: 'app-activity-information',
  templateUrl: './activity-information.component.html',
  styleUrls: ['./activity-information.component.scss']
})
export class ActivityInformationComponent implements OnInit {
  title = Title.LEFT_LINK;
  storageUrl = environment.storageUrl;
  activity : Activity;
  id: number;
  page : string;
  STT = 0;
  isShowNotification: boolean;
  is_need_approved : boolean;
  constructor(
    private _location : Location,
    public dialog: MatDialog, private _activatedRoute: ActivatedRoute,
    private _activitiesService: ActivitiesService,
    private _geolocationService : GeolocationService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params=>{
      this.id = params.id;
      this.page = params.page;
 
    })
    

    this.isShowNotification = history.state.isShowNotification;
    this.is_need_approved = history.state.is_need_approved
    this._activitiesService.getActivityById(this.id).subscribe(data=>{
     
      this.activity = data;
    })

    if(this.isShowNotification){
      this.showNotification();
    }
    
  }

  cancleInfo(){
    const dialogRef = this.dialog.open(DialogConfirmComponent,{
      width : '500px',
      data: { message: 'Do you wish to cancel this activity?', type:"REJECTED"}
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result === true){
       
        this._activitiesService.cancelActivity(this.activity.id).subscribe(
          data => {
            if(data.code == 200)
            {
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    data.message,
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(data=>{
                this.router.navigate(['/advisor/activities']);
              })
            }
            else{
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    data.message,
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              // dialogNotifi.afterClosed().subscribe(data =>
              // {
              //   window.location.reload();
              // })
            }
          },
        )
       
      }else{
        dialogRef.close();
      }
    })
  }

  goMap(address_city,address_unit){
    let addressLocation = new PlaceLocation(address_city, address_unit);
    const mapURL = this._geolocationService.getMapLink(addressLocation)
    // location.href = mapURL;
    const isMobile = {
      Android: function ()
      {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function ()
      {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function ()
      {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function ()
      {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function ()
      {
        return (
          navigator.userAgent.match(/IEMobile/i) ||
          navigator.userAgent.match(/WPDesktop/i)
        );
      },
      any: function ()
      {
        return (
          isMobile.Android() ||
          isMobile.BlackBerry() ||
          isMobile.iOS() ||
          isMobile.Opera() ||
          isMobile.Windows()
        );
      },
    };
    if (isMobile.any())
    {
      location.href = mapURL;
    } else
    {
      window.open(mapURL);
    }
  }

  back(){
    this._location.back();
  }

  showNotification() {
    let message: string = this.is_need_approved == true ? "Your activity has been created and is pending room approval by Branch Manager." : "Your activity has been created.";
      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:message,
          title:"NOTIFICATION",
          colorButton: false
        },
      });
  }

  /**
   * Edit Activity
   */
  editActivity(){
    this.router.navigate(['/advisor/activities/activity-edit'],
          { queryParams: {id: this.id} });
  }

  remakeActivity(){
    this.router.navigate(['/advisor/activities/create-activity'],
    { queryParams: {id: this.id} });
  }

   capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
  invite() {
    const port = this.document.location.port ? `:${this.document.location.port}` : ''
    const registerURL = `${this.document.location.protocol}//${this.document.location.hostname}${port}/activity-overview/class-information?id=${this.activity.id}`;

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

    // const messageText = `I%20would%20like%20to%20invite%20you%20to%20join%20my%20Thermomix®%20event%20at%20`
    const messageText = `You%20are%20cordially%20invited%20to%20attend%20my%20Thermomix®%20Event%20at%20`
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
  // activity-overview/class-information?id=74
}
