import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from 'app/core/models/activity.model';
import { ActivitiesService } from 'app/core/service/activities.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { isNullOrUndefined } from 'util';
import { ActivityService } from 'app/core/service/activity.service';
import { Location, DatePipe } from '@angular/common';
import * as jwt_decode from 'jwt-decode';
import { ACTIVITY_PRIVACY_TYPE, ACTIVITY_TYPE_ADVISOR, ACTIVITY_TYPE_BRANCH_MANAGER, ACTIVITY_TYPE_TEAM_LEADER } from '../../../../core/constants/constant';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { Title } from 'app/core/enum/title';
import { getLocaleDate } from 'app/core/utils/date.util';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';

@Component({
  selector: 'app-activity-edit',
  templateUrl: './activity-edit.component.html',
  styleUrls: ['./activity-edit.component.scss']
})
export class ActivityEditComponent implements OnInit {
  title = Title.LEFT
  /** activity Id */
  id: string;
  /** activity Object */
  activity : Activity;
  /** array privacy activity */
  actPrivacy = []
  /** activity Form */
  activityForm: FormGroup;
  /** other location Form */
  otherLocationForm: FormGroup;

  /** check Other Location */
  checkOtherLocation: boolean = false;
  /** check other location detail */
  locationDetail: boolean = false;

   /** store url get enviroment */
   storageUrl = environment.storageUrl;

   maximumImageSize : number = environment.imageSize;
   /** image url */
   myProfileImgUrl: string;

   cover_photo_key : string;
   /** array type actitivty */
  actType = [];
  /** array room activity */
  actRoom = [];
  /** array time slote activity */
  actTimeSlot = [];
  /** Start time */
  startTime: string;
  /** End Time */
  endTime: string;
  /** Adress ID */
  addressId: string;

  /** Array selected time slot */
  arrSelectedTimeSlot = [];
  /** Array object time slot */
  actObjectTimeSlot = [];
  /** Array object room */
  actObjectRoom = [];

  active: boolean = false;
  buttonName: string = 'Update';

  imagePath;
  imgURL: any;
  message: string;
  addressDetail: string;
  defaultDate: Date;
  defaultType: string;
  defaultPrivacy: string;
  roomId: any;
  submitted : boolean = false;
  defauLocation: string;
  changeActivity: boolean = false;
  changeLocationSave: boolean = false;
  roomDefault = [];

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private activitiesService: ActivitiesService,
    private formBuilder: FormBuilder,
    private activityService: ActivityService,
    private datePipe: DatePipe,
    private router : Router,
    public dialog: MatDialog
  ) { 
    
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params.id;
    });
    // from group otherLocationForm
    this.otherLocationForm = this.formBuilder.group({
      locationPostalCode: ['', Validators.required],
      locationCityState: ['', Validators.required],
      locationDetailAddress: ['', Validators.required],
      locationUnit: ['', Validators.required],
      durationStartTime: ['', Validators.required],
      durationEndTime: ['', Validators.required]
    });
    this.activityForm = this.formBuilder.group({
      activityTitle: ['', Validators.required],
      activityType: ['', Validators.required],
      activityPrivacy: ['', Validators.required],
      activityDate: ['', Validators.required],
      actitityLocation: ['', Validators.required],
      activityRoom: ['', Validators.required],
      activityTimeSlot: ['', Validators.required],
      activityCapacity: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      activityDescription: ['', Validators.required],
      activityNote: [],
    });
    // get Room by service\
    this.activityService.getAllRoom().subscribe(
      data => {
        if (!isNullOrUndefined(data) && data.length > 0) {
          this.actObjectRoom = data;
          data.forEach(element => {
            let textboxValue = new TextboxValue();
            textboxValue.value = element.id;
            textboxValue.label = element.roomName;
            this.actRoom.push(textboxValue);
          });
        }
      })
    //user role
    let token = localStorage.getItem('token');
    let decoded = jwt_decode(token);
    if (!isNullOrUndefined(decoded) && decoded.role.length > 0 && decoded.role.indexOf("ADVISOR") !== -1) {
      this.actType = ACTIVITY_TYPE_ADVISOR;
    }
    if (!isNullOrUndefined(decoded) && decoded.role.length > 0 && decoded.role.indexOf("BRANCH_MANAGER") !== -1) {
      this.actType = this.actType.concat(ACTIVITY_TYPE_BRANCH_MANAGER);
    }
    if (!isNullOrUndefined(decoded) && decoded.role.length > 0 && decoded.role.indexOf("TEAM_LEADER") !== -1) {
      this.actType = this.actType.concat(ACTIVITY_TYPE_TEAM_LEADER);
    }

    this.actPrivacy = ACTIVITY_PRIVACY_TYPE;
    // remove duplicates
    this.actType = this.lodash(this.actType, it => it.label)
    this.actPrivacy = this.lodash(this.actPrivacy, it => it.label)

    // form group activityForm
    // get Activity
    this.activitiesService.getActivityById(this.id).subscribe(data => {
    
      this.activity = data;
      this.cover_photo_key = this.activity.cover_photo_key;
      this.myProfileImgUrl = environment.storageUrl + this.activity.cover_photo_key;
      this.defaultDate = new Date(this.activity.activity_date);
      let actitivtyType = this.activity.type;
      
      let activityPrivacyId = this.activity.privacy;
      
      let type = this.actType.find(x => x.label === actitivtyType);
      let privacyValue = this.actPrivacy.find(x=> x.label === activityPrivacyId)
     
      this.defaultType = type.value;

      this.defaultPrivacy = activityPrivacyId;
      // this.roomId =  this.activity.roomId;
      this.addressId = this.activity.address.id;
      this.startTime = this.activity.start_time.substring(0, this.activity.start_time.lastIndexOf(":"));
      this.endTime = this.activity.end_time.substring(0, this.activity.end_time.lastIndexOf(":"));
      if (!isNullOrUndefined(this.activity.offices) && this.activity.offices.length > 0) {
        this.activity.offices.forEach(element => {
          this.roomDefault.push(element.officeRoomSlotId);
          this.roomId = element.officeRoomSlot.officeRoomId;
          this.arrSelectedTimeSlot.push(element.officeRoomSlot);
        });
      }
      if (isNullOrUndefined(this.roomId)) {
        this.defauLocation = '2';
        this.checkOtherLocation = true;
      } else {
        this.defauLocation = '1';
        if (!isNullOrUndefined(this.roomId)) {
          this.activityService.getTimeSlotByRoomId(this.roomId.id, getLocaleDate(this.defaultDate)).subscribe(
            data => {
              if (!isNullOrUndefined(data) && data.length > 0) {
                this.actObjectTimeSlot = data;
                data.forEach(element => {
                  let textboxValue = new TextboxValue();
                  textboxValue.value = element.id;
                  textboxValue.label = element.slotDescription;
                  this.actTimeSlot.push(textboxValue);
                });
              }
            }
          );
        }
      }
    });
    this.activityForm['controls'].activityDate.disable();
    this.activityForm['controls'].activityPrivacy.disable();
    this.activityForm['controls'].actitityLocation.disable();
    this.activityForm['controls'].activityRoom.disable();
    this.activityForm['controls'].activityTimeSlot.disable();
  }

    /**
   * create Actitity
   */
  updateActivity() {
    // this.barButtonOptions.active = true;
    // this.barButtonOptions.text = 'Update Data...';
    // address ID\
    // console.log(this.activityForm)
    this.submitted = true;
    if (this.activityForm.invalid )
    {
      
      return;
    }
    this.active = true;
    this.buttonName = "Processing...";
    let address: string;
    // get location
    let location = this.activityForm.value.actitityLocation;
    let imageName: string;
    if (!isNullOrUndefined(this.myProfileImgUrl) && this.myProfileImgUrl.length > 0) {
      imageName = this.myProfileImgUrl;
    }
  

    let activityTypeId = this.activityForm.value.activityType;
   // let activityPrivacyId = this.activityForm.value.activityPrivacy;

    let type = this.actType.find(x => x.value === activityTypeId);
  //  let privacyValue = this.actPrivacy.find(x=> x.value === activityPrivacyId)

    let activityTypeLabel = type.label;
  //  let activityPrivacyLabel = privacyValue.value;
    let formCreateActivity = {
      id: this.activity.id,
      title: this.activityForm.value.activityTitle,
      description: this.activityForm.value.activityDescription,
      notes: this.activityForm.value.activityNote,
      capacity: Number(this.activityForm.value.activityCapacity),
      activity_type: activityTypeLabel,
   //   privacy: activityPrivacyLabel.toUpperCase(),
      start_time: this.startTime+":00",
      end_time: this.endTime+":00",
     
      activity_date: this.datePipe.transform(this.defaultDate, 'yyyy-MM-dd'),
      address_id: Number(this.addressId),
      cover_photo_key: this.cover_photo_key,
      office_room_slot_id: this.activityForm.value.activityTimeSlot
    }
    
    // Call api create ativity
    this.activityService.updateActivity(formCreateActivity).subscribe(
      data => {
        if (data.code === 200) {
          this.changeActivity = false;
          this.active = false;
          this.buttonName = "Update";
          this.router.navigate(['/advisor/activities/activity-infomation'],
          { queryParams: {isShowNotification: true, id: data.data.activity.id, page:"upcoming"} });
          // this.barButtonOptions.active = false;
          // this.barButtonOptions.text = 'Update';
        }
      }
    );
  }

  /**
   * save address other location
   */
  saveAddress(){
    // console.log(this.otherLocationForm)
    if ( this.otherLocationForm.invalid || this.otherLocationForm.get('durationStartTime').value >= this.otherLocationForm.get('durationEndTime').value )
    {
      return;
    }
    // create data
    let formCreateActivityLocation = {
      id : this.addressId,
      postal_code: this.otherLocationForm.value.locationPostalCode,
      city_state: this.otherLocationForm.value.locationCityState,
      detail_address: this.otherLocationForm.value.locationDetailAddress,
      unit_number: this.otherLocationForm.value.locationUnit
    }
    // call api
    this.activityService.updateOtherLocation(formCreateActivityLocation).subscribe(
      data => {
        if(data.code === 200){
          this.addressDetail = formCreateActivityLocation.unit_number
          + ', ' + formCreateActivityLocation.detail_address
          + ', ' + formCreateActivityLocation.city_state
          + ', ' + formCreateActivityLocation.postal_code
          this.locationDetail = true;
          this.checkOtherLocation = false;
          this.changeLocationSave = false;
        }
      }
    )
    
  }

  /**
   * Funtion back
   */
  back() {
    this.location.back();
  }

  /**
   * radio Change
   */
  radioChange(event) {
    let value = event.value;
    if (value === '2') {
      this.checkOtherLocation = true;
    } else {
      this.checkOtherLocation = false;
    }
  }

  /**
   * on Change Room
   */
  onChangeRoom(event) {
    this.actTimeSlot = [];
    let roomId = event.value;
    let room = this.actObjectRoom.find(x => x.id === roomId);
    if (this.activityForm.value.actitityLocation === '1'){
      this.addressId = room.roomAddress.id
    }
    let actDate = this.activityForm.get('activityDate').value;
    let date = new Date(actDate);
    if (!isNullOrUndefined(roomId)) {
      this.activityService.getTimeSlotByRoomId(roomId, date).subscribe(
        data => {
          if (!isNullOrUndefined(data) && data.length > 0) {
            this.actObjectTimeSlot = data;
            data.forEach(element => {
              let textboxValue = new TextboxValue();
              textboxValue.value = element.id;
              textboxValue.label = element.slotDescription;
              this.actTimeSlot.push(textboxValue);
            });
          }
        }
      );
    }
  }

  /**
   * Selected TimeSlot
   */
  onChangeTimeSlot() {
    let timeSlots = this.activityForm.value.activityTimeSlot;
    let timeLength = timeSlots.length;
    if (timeLength >= 3) {
      for (let i = 0; i < timeLength; i++) {
        let time = this.actObjectTimeSlot.find(time => time.id === timeSlots[i]);
        if (!isNullOrUndefined(time)) {
          this.arrSelectedTimeSlot.push(time);
        }
      }
    } else {
      this.arrSelectedTimeSlot = [];
    }

  }

  /**
   * lodash
   * @param a 
   * @param key 
   */
  lodash(a, key) {
    let seen = new Set();
    return a.filter(item => {
      let k = key(item);
      return seen.has(k.trim()) ? false : seen.add(k.trim());
    });
  }

  /**
   * UPLOAD IMAGE TO AWWS AND RETURN IMAGE KEY
   * @param event 
   */
  onSelectFile(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type != "image/bmp" && file.type != "image/jpeg" && file.type != "image/jpg" && file.type != "image/png") {
        return;
      }
      if (file.size > this.maximumImageSize * 1024 * 1024) {
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              `Maximum File Size ${this.maximumImageSize} MB. Please choose another picture`,
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data => {
  
        });
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        let preSignedUrl: string;
        let profilePhotoKey: string;
        this.activityService.getPreSignedUrl(Date.now().toString() + file.name, file.type).subscribe(response => {
          if (response.code === 200) {
            profilePhotoKey = response.key;
            preSignedUrl = response.url;
            this.activityService.uploadActivityImage(preSignedUrl, file.type, file).subscribe(
              response => {
                this.myProfileImgUrl = this.storageUrl + profilePhotoKey;
                this.changeActivity = true;
              }
            );
            this.cover_photo_key = profilePhotoKey;
           
            return profilePhotoKey;
          }
        });
      };
    }
  }

  /**
   * preview Image
   * @param files 
   */
  preview(files) {
    if (files.length === 0)
      return;

    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    if (files[0].size > this.maximumImageSize * 1024 * 1024) {
      return;
    }
    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  /**
   * edit Address
   */
  editAddress(){
    this.locationDetail = false;
    this.checkOtherLocation =  true;
  }

  /**
   * changeFormActivity
   */
  changeFormActivity(){
    this.changeActivity = true;
  }

  go(){
    console.log(1)
  }
  /**
   * change Other Save
   */
  changeOtherSave(){
    this.changeLocationSave = true;
    this.changeActivity = true;
  }

}

class TextboxValue {
  value: string;
  label: string
}

