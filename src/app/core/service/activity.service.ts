import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, throwError } from 'rxjs';
import { ActivityRoom, RoomAddress, TimeSlot, Activity, Address} from '../models/activity.model';
import { 
    getAllRoomActivityApi, getTimeSlotByRoomApi, saveActivityImageApi,  createActivityOtherLocationApi, 
    createActivityApi, updateActivityApi, updateOtherLocationApi, createActivityOtherApi, findClassApi,  
    checkValidBeforeCreateActivityApi} from './backend-api';
import { catchError, map, retry } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse, HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AddressDisplay} from './commom/address.service'

@Injectable({
    providedIn: "root"
  })
  export class ActivityService {

    headers: HttpHeaders;
    token: string;
    constructor(
        private api: ApiService,
        private http: HttpClient,
        private datePipe: DatePipe,
        private httpClient: HttpClient,
        private router: Router,
      ) {
      }
  
    /**
     * get all room
     */
    addressDisplay = new AddressDisplay();

    getAllRoom(): Observable<any> {
        return this.api.get(getAllRoomActivityApi).pipe(
            map((value) => {
              let result = this.renderActivityRoom(value.data);
              return result;
            }), catchError(value => throwError(value))
        );
    }

    /**
     * get
     * @param data 
     */
    getTimeSlotByRoomId(roomId, dateActivity): Observable<any> {
        dateActivity = this.datePipe.transform(dateActivity, 'yyyy-MM-dd')
        let url = getTimeSlotByRoomApi.replace(':id', roomId);
        url = url.replace(':date', dateActivity);
        return this.api.get(url).pipe(
            map((value) => {
                
              let result = this.renderTimeSlot(value.data);
              return result;
            }), catchError(value => throwError(value))
        );
    }

     /**
     * create activity other location
     */
    createActivityOtherLocation(formCreateActivityLocation) {
        return this.api.post(createActivityOtherLocationApi, formCreateActivityLocation);
    }

    /**
     * create activity
     */
    createActivity(formCreateActivity) {
        return this.api.post(createActivityApi, formCreateActivity);
    }

    /**
     * create other Location
     * @param formUpdate 
     */
    createActivityother(formCreateActivity) {
        return this.api.post(createActivityOtherApi, formCreateActivity);
    }

    /**
     * 
     * @param data 
     */
    updateActivity(formUpdate) {
        return this.api.put(updateActivityApi, formUpdate);
    }

    /**
     * Update location
     * @param data 
     */
    updateOtherLocation(formUpdateActivityLocation){
        return this.api.put(updateOtherLocationApi, formUpdateActivityLocation)
    }

    /**
     * 
     * @param data 
     */
    findClassFilter(title: string, start: Date, end: Date): Observable<any>{
        let startConver: string;
        let endConver: string;
        let param = new HttpParams();
        if (!isNullOrUndefined(title)){
            param = param.append('title', title);
        }
        if (!isNullOrUndefined(start)){
            startConver = this.datePipe.transform(start, 'yyyy-MM-dd')
            param = param.append('start', startConver);
        }
        if (!isNullOrUndefined(end)){
            endConver = this.datePipe.transform(end, 'yyyy-MM-dd')
            param = param.append('end', endConver);
        }
        if (this.isEnable()){
            return this.httpClient.get<any>(findClassApi, {headers : this.headers, params: param}).pipe(
                map((value) => {
                let result = this.renderArrayActivity(value.data);
               
                return result;
                }), catchError(this.errorHandler)
            );
        }
    }

    /**
     * render Array Activity
     * @param data 
     */
    renderArrayActivity(data: any){
        let arrActivity = [];
        if (!isNullOrUndefined(data) && data.length > 0){
            data.forEach(element => {
              
                let activity = new Activity();
                activity.id = element.id;
                activity.title = element.title;
                activity.description = element.description;
                activity.notes = element.notes;
                activity.capacity = element.capacity;
                activity.type = element.activity_type;
                activity.privacy = element.privacy;
                activity.start_time = element.start_time;
                activity.end_time = element.end_time;
                activity.activity_date =  element.activity_date;
                activity.cover_photo_key = element.cover_photo_key;
                let address = new Address();
                address.id = element.id;
                address.postalCode = element.address.postal_code;
                address.cityState = element.address.city_state;
                address.detailAddress = element.address.detail_address;
                address.unitNumber = element.address.unit_number;
                address.show_address = this.addressDisplay.setDisplayAddressLine(element.address.unit_number,element.address.detail_address,element.address.city_state , element.address.postal_code)
                activity.address = address;
                activity.advisor = isNullOrUndefined(element.advisor.preferred_name) ? element.advisor.firt_name : element.advisor.preferred_name;
                arrActivity.push(activity);
            });
        }
        return arrActivity;
    }
    /**
     * render Activity Room
     * @param data 
     */
    renderActivityRoom(data: any){
        let arrRoom = [];
        if (!isNullOrUndefined(data) && data.length > 0){
            data.forEach(element => {
                let activityRoom = new ActivityRoom();
                activityRoom.id = element.id;
                activityRoom.entityId = element.entity_id;
                activityRoom.roomName = element.room_name;
                activityRoom.description = element.description;
                activityRoom.roomCapacity = element.room_capacity;
                activityRoom.createdAt = element.created_at;
                activityRoom.updatedAt = element.updated_at;
                activityRoom.isActive = element.is_active;
                activityRoom.roomAddress = this.renderRoomAddress(element.et_address);
                arrRoom.push(activityRoom)
            });
        }
        return arrRoom;
    }

    /**
     * render Room Address
     * @param data 
     */
    renderRoomAddress(data: any){
        let roomAddress = new RoomAddress();
        roomAddress.id = data.id;
        roomAddress.createdOn = data.created_on;
        roomAddress.isDeleted = data.is_deleted;
        roomAddress.updatedOn = data.updated_on;
        roomAddress.addrLabel = data.addr_label;
        roomAddress.addrLine1 = data.addr_line1;
        roomAddress.addrLine2 = data.addr_line2;
        roomAddress.addrLine3 = data.addr_line3;
        roomAddress.city = data.city;
        roomAddress.countryCode = data.country_code;
        roomAddress.globalAddrId = data.global_addr_id;
        roomAddress.postalCode = data.postal_code;
        roomAddress.createdById = data.created_by_id;
        roomAddress.updatedById = data.updated_by_id;
        roomAddress.doxaEntityId = data.doxa_entity_id;
        roomAddress.etVendorId = data.et_vendor_id;
        roomAddress.latitude = data.latitude;
        roomAddress.longitude = data.longitude;
        return roomAddress;
    }

    /**
     * render Time Slot
     * @param data 
     */
    renderTimeSlot(data: any){
        data.sort((a,b)=>{return a.slot_number - b.slot_number})

        let arrTimeSlot = [];
        if (!isNullOrUndefined(data) && data.length > 0){
            data.forEach(element => {
                let timeSlot = new TimeSlot();
                timeSlot.id = element.id;
                timeSlot.officeRoomId = element.office_room_id;
                timeSlot.slotNumber = element.slot_number;
                timeSlot.slotDescription = element.slot_description;
                timeSlot.isActive = element.is_active;
                timeSlot.createdAt = element.created_at;
                timeSlot.updatedAt = element.updated_at;
                timeSlot.startTime = element.start_time;
                timeSlot.endTime = element.end_time;
                arrTimeSlot.push(timeSlot);
            });
        }
        return arrTimeSlot;
    }

    getPreSignedUrl(fileName: string, fileType: string)
    {
        const bodyObj = { name: fileName, type: fileType };
        return this.api.post(saveActivityImageApi, bodyObj).pipe(retry(3), catchError(this.errorHandler));

    }
    //For Upload Image to AWS
    uploadActivityImage(url: string, contentType: string, file)
    {
        const headers = new HttpHeaders({ 'Content-Type': contentType });
        return this.http.put<any>(url, file, { headers: headers, reportProgress: true }).pipe(retry(3), catchError(this.errorHandler));
    }

    private errorHandler(error: HttpErrorResponse)
    {
        if (error.error instanceof ErrorEvent)
        {
            console.error('An error occured:', error.error.message);
        }
        else
        {
            console.error(
                `Back-end return code: ${error.status}\n` +
                `Body content: ${error.status}`
            );
        }

        return throwError(error.message || 'Server Error');
    }

    isEnable() {
        // get token localstorege in localstorage
        this.token = "Bearer " + localStorage.getItem('token');
        // User had logged but profile in localstorage had delete
        if (isNullOrUndefined(this.token) || this.token === "Bearer null"){
          this.router.navigate(["/login"]);
          return false;
        } else {
          this.headers = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});
          return true;
        }
      }

      checkValidBeforeCreateActivity(data)
      {
          return this.api.post(checkValidBeforeCreateActivityApi,data).pipe(map(data=>{
              if(data.code === 200){
                  return data.data
              }else{
                  return null
              }
          }))
      }
}