import { ACTIVITY_PRIVACY_TYPE } from './../../../../core/constants/constant';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ACTIVITY_TYPE_ADVISOR, ACTIVITY_TYPE_BRANCH_MANAGER, ACTIVITY_TYPE_TEAM_LEADER } from '../../../../core/constants/constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import { isNullOrUndefined } from 'util';
import { ActivityService } from '../../../../core/service/activity.service';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { environment } from 'environments/environment';
import { Router , ActivatedRoute } from '@angular/router';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { Title } from 'app/core/enum/title';
import { getLocaleDate } from 'app/core/utils/date.util';
import * as moment from 'moment'
import { MatDialog } from '@angular/material/dialog';
import { ActivitiesService } from 'app/core/service/activities.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit {

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private activityService: ActivityService,
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute : ActivatedRoute,
    private activitiesService: ActivitiesService
  ) { }
  title = Title.LEFT;
  /** store url get enviroment */
  storageUrl = environment.storageUrl;

  maximumImageSize : number = environment.imageSize;
  /** image url */
  myProfileImgUrl: string;
  
  coverphotokey : string;
  /** check Other Location */
  checkOtherLocation: boolean = false;
  /** check other location detail */
  locationDetail: boolean = false;

  /** array type actitivty */
  actType = [];
  /** array privacy activity */
  actPrivacy = []
  /** array room activity */
  actRoom = [];
  /** array time slote activity */
  actTimeSlot = [];
  /** activity Form */
  activityForm: FormGroup;
  /** other location Form */
  otherLocationForm: FormGroup;
  /** activity Room Form*/ 
  roomForm: FormGroup;
  submitted : boolean = false;
  submitted_address : boolean = false;
  imagePath;
  imgURL: any;
  message: string;
  addressDetail: string;
  checkTimeSlot = true;
  todayDate: Date = new Date();
  minDate: Date = new Date();
  
  another_location_time_start : any;
  another_location_time_end : any;
  /** Start time */
  startTime: string;
  /** End Time */
  endTime: string;
  /** Adress ID */
  addressId: number;

  /** Array selected time slot */
  arrSelectedTimeSlot = [];
  /** Array object time slot */
  actObjectTimeSlot = [];
  /** Array object room */
  actObjectRoom = [];

  buttonName: string = "CREATE";
  active:  boolean = false;
  is_cooking_location : boolean = false;
  activity_maximum_capacity : number;
  id: string;
  ngOnInit(): void {
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
    this.activityForm = this.formBuilder.group({
      activityTitle: ['', Validators.required],
      activityType: ['', Validators.required],
      activityPrivacy: ['', Validators.required],
      activityDate: ['', Validators.required],
      actitityLocation: ['', Validators.required],
      // activityRoom: ['', Validators.required],
      // activityTimeSlot: ['', Validators.required],
      activityImage: ['', Validators.required],
      activityCapacity: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      activityDescription: ['', Validators.required],
      activityNote: [''],
    });

    this.activatedRoute.queryParams.subscribe(params=>{
      this.id = params.id
      this.getActivityById(this.id);
    })
    // from group otherLocationForm
    this.otherLocationForm = this.formBuilder.group({
      locationPostalCode: ['', Validators.required],
      locationCityState: ['', Validators.required],
      locationDetailAddress: ['', Validators.required],
      locationUnit: ['', Validators.required],
      durationStartTime: ['', Validators.required],
      durationEndTime: ['', Validators.required]
    });
    this.roomForm = this.formBuilder.group({
      activityRoom: ['', Validators.required],
      activityTimeSlot: ['', Validators.required]
    });

    this.roomForm['controls'].activityRoom.disable();
    this.roomForm['controls'].activityTimeSlot.disable();
   

    // get Room by service\
    this.activityService.getAllRoom().subscribe(
      data => {
        if (!CheckNullOrUndefinedOrEmpty(data)) {
          this.actObjectRoom = data;
          data.forEach(element => {
            let textboxValue = new TextboxValue();
            textboxValue.value = element.id;
            textboxValue.label = element.roomName;
            this.actRoom.push(textboxValue);
          });
        }
      })
  }
  get f() { return this.activityForm.controls };
  /**
   * create Actitity
   */
  defaultType: string;
  getActivityById(id){
    this.activitiesService.getActivityById(id).subscribe(data => {
      // console.log(data)
      if(!CheckNullOrUndefinedOrEmpty(data)){
        this.activityForm.patchValue({
          activityTitle: data.title,
          activityCapacity: data.capacity,
          activityDescription: data.description,
          activityNote: data.notes
        });
        this.myProfileImgUrl = this.storageUrl + data.cover_photo_key;
        this.coverphotokey = data.cover_photo_key;
        let type = this.actType.find(x => x.label === data.type);
        this.defaultType = type.value;
        this.activityForm['controls'].activityImage.disable();
      }
    })
  }
  
  createActivity() {
   
    this.submitted = true;
    if (this.activityForm.invalid || this.arrSelectedTimeSlot.length > 3 || !this.checkTimeSlot ||
      this.otherLocationForm.get('durationStartTime').value >= this.otherLocationForm.get('durationEndTime').value )
    {
      return;
    }
    this.buttonName = "Processing...";
    let address: number;
    // get location
    let location = this.activityForm.value.actitityLocation;
    let imageName: string;
    if (!isNullOrUndefined(this.myProfileImgUrl) && this.myProfileImgUrl.length > 0) {
      imageName = this.myProfileImgUrl;
    }
    if(location === '1'){
      if(this.arrSelectedTimeSlot.length <1 )
      {
  
        this.buttonName = "CREATE";
        return;
        
      }
      let timeSlots = this.roomForm.value.activityTimeSlot;
      let timeLength = timeSlots.length;
      if (timeLength > 0) {
        for (let i = 0; i < timeLength; i++) {
          let time = this.actObjectTimeSlot.find(time => time.id === timeSlots[i]);
          if (i === 0) {
            this.startTime = time.startTime;
          }
          if (i === timeLength - 1) {
            this.endTime = time.endTime;
          }
        }
      }
    } else if(location === '2') {
      // start time
      this.startTime =  this.otherLocationForm.value.durationStartTime;
      // end time
      this.endTime =  this.otherLocationForm.value.durationEndTime;
      // address Id
      address = this.addressId;
    }
    let activityTypeId = this.activityForm.value.activityType;
    let activityPrivacyId = this.activityForm.value.activityPrivacy;
    let type = this.actType.find(x => x.value === activityTypeId);
    let privacyValue = this.actPrivacy.find(x=> x.value === activityPrivacyId)
    let activityTypeLabel = type.label;
    let formCreateActivity = {
      title: this.activityForm.value.activityTitle,
      description: this.activityForm.value.activityDescription,
      notes: this.activityForm.value.activityNote,
      capacity: Number(this.activityForm.value.activityCapacity),
      activity_type: activityTypeLabel,
      privacy: privacyValue.value,
      start_time: this.startTime,
      end_time: this.endTime,
      activity_date: getLocaleDate(this.activityForm.value.activityDate),
      address_id: Number(this.addressId),
      cover_photo_key: this.coverphotokey,
      office_room_slot_id: this.roomForm.value.activityTimeSlot,
    
    }
   
    // Call api create ativity
    if(location === '1'){
      let checkdata ={
        "activity_date"  : formCreateActivity.activity_date,
        "activity_start" : formCreateActivity.start_time,
        "activity_end"   : formCreateActivity.end_time
      }
      this.activityService.checkValidBeforeCreateActivity(checkdata).subscribe(data=>{
        if(!isNullOrUndefined(data) && data  > 0)
        {
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: "You are in another activity during this time. Please choose another time slots.",
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });
          this.buttonName = "CREATE";
        }else{
          this.activityService.createActivity(formCreateActivity).subscribe(
            data => {
              if (data.code === 200) {
                this.router.navigate(['/advisor/activities/activity-infomation'],
                { queryParams: {id: data.data.activity.id, page: "pending"}, 
                state: { isShowNotification: true,is_need_approved :  true }});
              }
          
            }
          );
        }
      }) 
    } else if (location === '2'){
      let formOtherActivity = {
        title: this.activityForm.value.activityTitle,
        description: this.activityForm.value.activityDescription,
        notes:  this.activityForm.value.activityNote,
        capacity: Number(this.activityForm.value.activityCapacity),
        activity_type: activityTypeLabel,
        privacy: privacyValue.value,
        start_time: this.startTime,
        end_time: this.endTime,
        activity_date: getLocaleDate(this.activityForm.value.activityDate),
        address_id: Number(this.addressId),
        cover_photo_key: this.coverphotokey
      }
      let checkdata ={
        "activity_date"  : formCreateActivity.activity_date,
        "activity_start" : formOtherActivity.start_time,
        "activity_end"   : formOtherActivity.end_time
      }
      this.activityService.checkValidBeforeCreateActivity(checkdata).subscribe(data=>{
        if(!isNullOrUndefined(data) && data  > 0)
        {
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: "You are in another activity during this time. Please choose another time slots.",
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });
          this.buttonName = "CREATE";
        }else{
          this.activityService.createActivityother(formOtherActivity).subscribe(
            //is_need_approved : Check location 1 or 2.
            data => {
              if (data.code === 200) {
                this.router.navigate(['/advisor/activities/activity-infomation'],
                { queryParams: {id: data.data.activity.id, page: "upcoming"}, 
                state: { isShowNotification: true, is_need_approved :  false}});
              } else if (data.code === 201 ) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "500px",
                  data: {
                    message: data.message,
                    title:
                      "NOTIFICATION",
                    colorButton: false
                  },
                });
              }
            }
          );
        }
      }) 
      
    }
  }

  /**
   * save address other location
   */
  saveAddress(){
    this.submitted_address = true;
    // console.log(this.otherLocationForm)
    if ( this.otherLocationForm.invalid || this.otherLocationForm.get('durationStartTime').value >= this.otherLocationForm.get('durationEndTime').value )
    {
      return;
    }
    // create data
    let formCreateActivityLocation = {
      postal_code: this.otherLocationForm.value.locationPostalCode,
      city_state: this.otherLocationForm.value.locationCityState,
      detail_address: this.otherLocationForm.value.locationDetailAddress,
      unit_number: this.otherLocationForm.value.locationUnit
    }
    // call api
    this.activityService.createActivityOtherLocation(formCreateActivityLocation).subscribe(
      data => {
        if(data.code === 200){
          this.addressDetail = formCreateActivityLocation.unit_number
          + ', ' + formCreateActivityLocation.detail_address
          + ', ' + formCreateActivityLocation.city_state
          + ', ' + formCreateActivityLocation.postal_code
          this.locationDetail = true;
          this.checkOtherLocation = false;
          this.addressId = data.data.id;
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
  radioChange(event) {
    let value = event.value;
    if (value === '2') {
      // this.activityForm.get('activityCapacity').reset()

      this.is_cooking_location = false;
      this.roomForm['controls'].activityTimeSlot.disable();
      this.roomForm['controls'].activityRoom.disable();
      let actDate = this.activityForm.get('activityDate').value;
      let date = new Date(actDate);
      let current_date = new Date()
      let is_same_date = moment(date).format("YYYY-MM-DD") === moment(current_date).format("YYYY-MM-DD");
      if(is_same_date){
        this.another_location_time_start = moment(new Date()).format('hh:mm A');
      }else{
        this.another_location_time_start = "07:00 am";
      }
      
      this.checkOtherLocation = true;
    } else {
      this.is_cooking_location = true;
      this.checkOtherLocation = false;
      this.submitted_address = false;
      this.roomForm['controls'].activityTimeSlot.enable();
      this.roomForm['controls'].activityRoom.enable();
    }
  }
  /**
   * on Change Room
   */
  onChangeRoom(event) {
    this.submitted = false;
    this.checkTimeSlot = true;
    this.arrSelectedTimeSlot = [];
    this.roomForm.controls.activityTimeSlot.reset();
    this.actTimeSlot = [];
    let roomId = this.roomForm.value.activityRoom;
    let room = this.actObjectRoom.find(x => x.id === roomId);
    if (this.activityForm.value.actitityLocation === '1'){
      this.addressId = room.roomAddress.id
    }
    let actDate = this.activityForm.get('activityDate').value;
    let date = new Date(actDate);
    let current_date = new Date()
    let is_same_date = moment(date).format("YYYY-MM-DD") === moment(current_date).format("YYYY-MM-DD")
    if (!isNullOrUndefined(roomId)) {
      this.activityService.getTimeSlotByRoomId(roomId, date).subscribe(
        
        data => {
          if (!isNullOrUndefined(data) && data.length > 0) {
           
            this.activity_maximum_capacity = data[0].officeRoomId.room_capacity;
            // console.log(this.activity_maximum_capacity)
            this.activityForm.get('activityCapacity').setValue(this.activity_maximum_capacity);
            this.actObjectTimeSlot = data;
            
            if(is_same_date)
            {
              data.forEach(element =>{
                if(element.startTime.substring(0,2) > moment(current_date).hour())
                {
                  let textboxValue = new TextboxValue();
                  textboxValue.value = element.id;
                  textboxValue.label = element.slotDescription;
                  this.actTimeSlot.push(textboxValue);
                }
              })
            }else{
              data.forEach(element => {
                let textboxValue = new TextboxValue();
                textboxValue.value = element.id;
                textboxValue.label = element.slotDescription;
                this.actTimeSlot.push(textboxValue);
              });
            }
           
          }
        }
      );
    }
  }
  

  onChangeDate(event){
    let location = this.activityForm.value.actitityLocation;
    let roomId = this.roomForm.value.activityRoom;
    if(location === '1' && roomId != "")
    {
      this.onChangeRoom(event);
    }else{
      let actDate = this.activityForm.get('activityDate').value;
      let date = new Date(actDate);
      let current_date = new Date()
      let is_same_date = moment(date).format("YYYY-MM-DD") === moment(current_date).format("YYYY-MM-DD");
      if(is_same_date){
        this.another_location_time_start = moment(new Date()).format('hh:mm A');
      }else{
        this.another_location_time_start = "07:00 am";
      }
    }
  }
  /**
   * Selected TimeSlot
   */
  onChangeTimeSlot() {
    let  endFirst: string;
    let startSec: string;
    let endSec: string;
    let startTh: string;
    this.arrSelectedTimeSlot = [];
    let timeSlots = this.roomForm.value.activityTimeSlot;
    timeSlots.sort();
    let timeLength = timeSlots.length;
    if (timeLength > 0) {
      for (let i = 0; i < timeLength; i++) {
        let time = this.actObjectTimeSlot.find(time => time.id === timeSlots[i]);
        if (!isNullOrUndefined(time)) {
          this.arrSelectedTimeSlot.push(time);
        }
        if(i === 0){
          endFirst = time.endTime;
          this.checkTimeSlot = true;
        }
        if(i === 1){
          if(endFirst === time.startTime){
            this.checkTimeSlot = true;
          } else {
            this.checkTimeSlot = false
          }
          endSec =  time.endTime;
        }
        if(i === 2){
          if(endSec === time.startTime && this.checkTimeSlot){
            this.checkTimeSlot = true;
          } else {
            this.checkTimeSlot = false
          }
        }
      }
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
              }
            );
            this.coverphotokey = profilePhotoKey;
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
   * cancel Locaton
   */
  cancelLocaton(){
    this.checkOtherLocation = false;
  }

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
        bodyBackgroundColor: 'white',
        buttonColor: '#269A3E'
    },
    dial: {
        dialBackgroundColor: '#269A3E'
    },
    clockFace: {
        clockFaceBackgroundColor: '#F3F3F3',
        clockHandColor: '#269A3E',
        clockFaceTimeInactiveColor: '#5A616F'
    }
};

}



class TextboxValue {
  value: string;
  label: string
}
