
import { from } from 'rxjs';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Activity, Attendee , AttendeeDto } from '../../../../core/models/activity.model';
import { DOCUMENT, formatDate, Location } from "@angular/common";
import { ActivitiesService } from 'app/core/service/activities.service';
import { AttendeeService} from 'app/core/service/attendee.service'
import { ActivatedRoute } from '@angular/router'
import { DialCodeComponent } from 'app/main/account/authentication/dial-code/dial-code.component';
import
{
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
// import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { Title } from 'app/core/enum/title';
import { DialogConfirmComponent} from 'app/main/common-component/dialog-confirm/dialog-confirm.component';
import { element } from 'protractor';
import { environment } from 'environments/environment';
import { MyContactsService } from 'app/core/service/my-contact.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';

interface ContactList{
  id : number;
  email: string;
  first_name: string;
  phone_dial_code: string;
  phone_number: string;
  is_attended : false;
  is_invited : false;
  activity_id: number
}

@Component({
  selector: 'app-activity-attendee',
  templateUrl: './activity-attendee.component.html',
  styleUrls: ['./activity-attendee.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  animations: fuseAnimations,
})
export class ActivityAttendeeComponent implements OnInit {
  title = Title.LEFT;
  atteendee_capacity : string;
  disabled : boolean = true;
  activity : Activity;
  attendees = [];
  attendee : Attendee;
  attendeeDto: AttendeeDto;
  updateattendeeDto: AttendeeDto;
  isShow  : boolean = true;
  isShowContact  : boolean = true;
  isShowView = 0;
  id: number;
  page : string;
  capacity: number;
  addAttendeeForm: FormGroup;
  updateAttendeeForm : FormGroup;
  attendeeEmail : string;
  email_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  attendee_dial_code : string;
  activityId: string;
  buttonName: string = "Save change";
  active : boolean = false;

  butonNameAddAttendee = "Add new";
  activeAddAttendee : boolean = false;
  numberAttendee : number;
  isSubmited : boolean = false;
  defaultDialCode = environment.dialcode;
  contact_list : ContactList[];
  customerContacts: ContactList;
  nameAsIC: string;

  //Check Date for mark as attended
  activityDate: string;
  toDay : Date = new Date();
  isMarkAsAttended: boolean;
  constructor(
    private _location: Location,
    private _activitiesService: ActivitiesService,
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _attendeeService : AttendeeService,
    public dialog: MatDialog,
    private _contactService: MyContactsService,
    
    @Inject(DOCUMENT) private document: Document,
  ) { }
  @ViewChild(DialCodeComponent) dialcode: DialCodeComponent;
  ngOnInit(): void {
    
    this._activatedRoute.queryParams.subscribe(params=>{
      this.id = params.id;
      this.capacity= params.capacity;
      this.page = params.page;
    })
    
    this._activitiesService.getActivityByActivityId(this.id).subscribe(data=>{
      this.activity = new Activity();
      this.attendees = data;
      this.atteendee_capacity = "(" + this.attendees.length +"/" + this.capacity + ")" ;
      this.activityDate = (!CheckNullOrUndefinedOrEmpty(this.attendees[0])) ? this.attendees[0].date : '';
      this.isMarkAsAttended = this.checkDate();
    })

    this._activitiesService.getActivityById(this.id).subscribe(data=>{
      this.activity = data;
      this.activityId = data.id;
     
    })

    this.addAttendeeForm = this._formBuilder.group({
      fname: ['', Validators.required],
      // preferredname: [''],
      email: ['', [Validators.required, Validators.pattern(this.email_pattern)]],
      phoneNum: ['', [Validators.required, phoneNumberValidator]],
      notes : ['']
    });
    
    this._contactService.getContactList('').subscribe(data=>{
     this.contact_list = data;
      if(!CheckNullOrUndefinedOrEmpty(data)) {
        data.forEach(element => {
          this.nameAsIC = element.first_name;
        });
      }
      // console.log('thach',data)
    })


  }
  getAttendeeInformation(attendee)
  {
    this.updateAttendeeForm = this._formBuilder.group({
      firstName: [attendee.firstName, Validators.required],
      preferredName: [attendee.preferredName],
      email: [attendee.email, [Validators.required, Validators.pattern(this.email_pattern)]],
      phone: [attendee.phone, [Validators.required, phoneNumberValidator]],
      notes: [attendee.notes]
    })
    this.updateAttendeeForm.get('email').disable();
    this.attendeeEmail = attendee.email;
    this.attendee_dial_code = attendee.dial_code;
  }
  onSubmit()
  {
    if(this.addAttendeeForm.invalid){
      this.isSubmited = true;
      return;
    }else{
      let index = this.attendees.findIndex(element => element.email === this.addAttendeeForm.value.email);
      if(index != -1 )
      {
        this.butonNameAddAttendee = "Add new";
        this.activeAddAttendee  = false;
        // this.isShow = !this.isShow;
        // this.addAttendeeForm.reset();
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
            "This customer is already invited. Please invite another one.",
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        return ;
      }

      this.butonNameAddAttendee = "Processing...";
      this.activeAddAttendee  = true;
      this.attendeeDto = new AttendeeDto();
      this.attendeeDto.activity_id = parseInt(this.id.toString());
      this.attendeeDto.first_name = this.addAttendeeForm.value.fname;
      this.attendeeDto.preferred_name = this.addAttendeeForm.value.preferredname;
      this.attendeeDto.email = this.addAttendeeForm.value.email;
      this.attendeeDto.phone_dial_code = this.dialcode.selectedDial;
      this.attendeeDto.phone_number = this.addAttendeeForm.value.phoneNum;
      this.attendeeDto.notes = this.addAttendeeForm.value.notes;
      this.attendeeDto.is_attended = false;
      this.attendeeDto.is_invited = false;
     
      this._attendeeService.addAttendee(this.attendeeDto).subscribe(
        response =>
        {

          if (response.code == 200)
          {
            this.butonNameAddAttendee = "Add new";
            this.activeAddAttendee  = false;
            this.isShow = !this.isShow;
            this.addAttendeeForm.reset();
            this._activitiesService.getActivityByActivityId(this.id).subscribe(data =>
            {
              this.activity = new Activity();
              this.attendees = data;
              this.atteendee_capacity = "(" + this.attendees.length +"/" + this.capacity + ")" ;
            })
          }else if (response.code == 202 )
          {
            this.butonNameAddAttendee = "Add new";
            this.activeAddAttendee  = false;
            // this.isShow = !this.isShow;
            // this.addAttendeeForm.reset();
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: response.message,
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
          } else if ( response.code === 201) {
            this.butonNameAddAttendee = "Add new";
            this.activeAddAttendee  = false;
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: response.message,
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
          }
        },
        error =>
        {
          this.butonNameAddAttendee = "Add new";
          this.activeAddAttendee  = false;
        }
      )
    }
    
    
  }

  Remove(email: string)
  {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: "500px",
      data: {
        message:
          "Do you want to remove this attendee from this activity ?",
        type : "REJECTED"
      },
    });

    dialogRef.afterClosed().subscribe((result) =>
    {
      if (result === true)
      {
        this._attendeeService.removeAttendee(email, this.id.toString()).subscribe(
          response =>
          {
            if (response.code === 200)
            {
              this._activitiesService.getActivityByActivityId(this.id).subscribe(data =>
              {
                this.activity = new Activity();
                this.attendees = data;
              })
            }
          }, error =>
          {
            console.log(error);
          }
        )
      } else
      {
        dialogRef.close;
      }
    });
    
  }

  onUpdateAttendee()
  {
    this.active = true;
    this.buttonName = "Processing...";
    // console.log(this.updateAttendeeForm.value);
    this.updateattendeeDto = new AttendeeDto();
    this.updateattendeeDto.activity_id = parseInt(this.id.toString());
    this.updateattendeeDto.first_name = this.updateAttendeeForm.value.firstName;
    this.updateattendeeDto.preferred_name = this.updateAttendeeForm.value.preferredName;
    this.updateattendeeDto.email = this.attendeeEmail;
    this.updateattendeeDto.phone_dial_code = this.dialcode.selectedDial;
    this.updateattendeeDto.phone_number = this.updateAttendeeForm.value.phone;
    this.updateattendeeDto.notes = this.updateAttendeeForm.value.notes;

    this._attendeeService.updateAttendee(this.updateattendeeDto).subscribe(
      response => {
        if(response.code === 200)
        {
          this.active = false;
          this.buttonName = "Save change";
          this._activitiesService.getActivityByActivityId(this.id).subscribe(data =>
          {
            this.activity = new Activity();
            this.attendees = data;
          })
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message:
              "Updated attendee successfully.",
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });

        }
      },
      error => { 
        console.log(error);
        this.active = false;
        this.buttonName = "Save change";
      }
    )
  }
  shareWhatsapp() {

    const port = this.document.location.port ? `:${this.document.location.port}` : ''
    const registerURL = `${this.document.location.protocol}//${this.document.location.hostname}${port}/activity-overview/class-information?id=${this.activityId}`;

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

    // const messageText = `I%20would%20like%20to%20invite%20you%20to%20join%20my%Thermomix®%20event%20at%20`
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

  copyLink() {
    const port = this.document.location.port
    ? `:${this.document.location.port}`
    : "";
    let copyLink;
    copyLink = `${this.document.location.protocol}//${this.document.location.hostname}${port}/activity-overview/class-information?id=${this.activityId}`;
    let linkActivity = document.createElement('textarea');
    linkActivity.value = copyLink
   
      document.body.appendChild(linkActivity);
      linkActivity.select();
      document.execCommand('Copy');
      linkActivity.remove();

  }
  async getValueContact(changedValue){
     this.customerContacts = changedValue.value;
   
  }

  back(){
    this._location.back();
  }
  cancel(){
    this.isShow = !this.isShow;
    this.isSubmited = false;
    this.addAttendeeForm.reset();
  }

  cancelContact(){
    this.isShowContact = !this.isShowContact;
    this.isSubmited = false;
    this.addAttendeeForm.reset();
  }

  addNewContact(){

    let index = this.attendees.findIndex(element => element.email === this.customerContacts.email);
    if(index != -1 )
    {
      this.butonNameAddAttendee = "Add new";
      this.activeAddAttendee  = false;
      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:
          "This customer is already invited. Please invite another one.",
          title:
            "NOTIFICATION",
          colorButton: false
        },
      });
      return ;
    }

    this._attendeeService.addAttendeeFromContact(this.id.toString(), this.customerContacts.email).subscribe(

      response =>
      {
        if (response.code == 200)
        {
          this.butonNameAddAttendee = "Add new";
          this.isShowContact = !this.isShowContact;
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: response.message,
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });
          this._activitiesService.getActivityByActivityId(this.id).subscribe(data =>
          {
            this.activity = new Activity();
            this.attendees = data;
            this.atteendee_capacity = "(" + this.attendees.length +"/" + this.capacity + ")" ;
          })
        }else if ( response.code == 202 )
        {
          this.butonNameAddAttendee = "Add new";
          this.activeAddAttendee  = false;
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: response.message,
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });
        } else if ( response.code === 201) {
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: response.message,
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });
        }
      },
  
    )


  }

  addFromContacts(){

    if(this.attendees.length < this.capacity )
    {
      this.isShowContact = !this.isShowContact;
    }else{
      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:
          "Class is full capacity. Please choose another!",
          title:
            "NOTIFICATION",
          colorButton: false
        },
      });
    }
    
   
    
  }
  addAttendee(){
    // this.isShow = false
    if(this.attendees.length < this.capacity )
    {
      this.isShow = !this.isShow;
    }else{
      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:
          "Class is full capacity. Please choose another!",
          title:
            "NOTIFICATION",
          colorButton: false
        },
      });
    }
    
  }

  updateAttendance(attendeeId , status){
    this._attendeeService.updateIsAttended(this.id, attendeeId).subscribe(
      data=>{
        // console.log(data)
        if(data.code === 200){
                status.attendance = (status.attendance === "No") ? "Yes" : "No"
        }else{
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message:
              "Error when change attendance. Please try later!",
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });
        }
      }
    );
  }

  checkMarkAsAttended(attendee){
    let checkAttendance = (attendee.attendance === "No") ? true : false;
    if(checkAttendance && this.isMarkAsAttended){
      return true;   
    }else{
      return false;
    }
  }

  checkDate(){
    let fotmatToDate = formatDate(this.toDay,'yyyy-MM-dd', 'en-US');
    if((this.activityDate === fotmatToDate && this.page === 'upcoming') || this.page === 'completed'){
      return true;
    }
    return false
  }
}


function phoneNumberValidator(registerForm: FormControl)
{
  if (isNaN(registerForm.value) === false)
  {
    return null;
  }
  return { phoneNum: true };
}