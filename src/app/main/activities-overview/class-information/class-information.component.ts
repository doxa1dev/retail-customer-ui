import { Component, OnInit, Inject } from '@angular/core';
import { Activity, Attendee } from 'app/core/models/activity.model';
import { AppModule } from 'app/app.module';
import { Location, DOCUMENT } from '@angular/common';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivitiesService } from 'app/core/service/activities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { GeolocationService } from 'app/core/service/geolocation.service';
import { PlaceLocation } from 'app/core/models/place.model'
import { Title } from 'app/core/enum/title';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
@Component({
  selector: 'app-class-information',
  templateUrl: './class-information.component.html',
  styleUrls: ['./class-information.component.scss']
})
export class ClassInformationComponent implements OnInit {
  activity_image: string  = "assets/images_doxa/image_activity_01.png";
  activity : Activity;
  id: number;
  class = "";
  storageUrl = environment.storageUrl;
  title = Title.LEFT;
  
  constructor(
    private _location : Location,private _activatedRoute: ActivatedRoute, private router:Router,
    private _activitiesService: ActivitiesService,public dialog: MatDialog,
    private _geolocationService: GeolocationService,
    @Inject(DOCUMENT) private document: Document,
    ) { }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params=>{
      this.id = params.id
      this.class = params.page
    });
    this._activitiesService.getActivityById(this.id).subscribe(data=>{
      this.activity = data;
    })
  }

  back(){
    this._location.back();
  }

  goMap(address_city, address_unit)
  {
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

  navigateToDone(classID){
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
              message: "This activity is hosted by different branch/team. Please join another acitivity",
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

    const messageText = `I%20would%20like%20to%20invite%20you%20to%20join%20with%20me%20in%20activity%20at%20`
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

}
