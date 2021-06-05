import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import {    
    activitiesAdvisorApi , 
    activitiesAdvisorActiveApi , activitiesAdvisorPendingApi,
    activitiesAdvisorCompletedApi , activityApi,
    getActiviryByActivityId,
    getActiveActivityofCustomer,
    getCompletedActivityofCustomer,
    getReserveActivityofCustomer,
    ReserveActivity,
    cancelActivityApi,
    getPendingRoomBookingsApi,
    getPastRoomBookingsApi,
    rejectActivityApi,
    approveActivityApi , activityCustomerCount, activitiesAdvisorRejectedApi
} from './backend-api';
import { ApiService } from './api.service'
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { Activity, Attendee, Address, Office, OfficeRoomSlot, OfficeRoomSlotBooking } from 'app/core/models/activity.model'
import { AddressDisplay} from './commom/address.service'
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';


@Injectable({
    providedIn: 'root'
})

export class ActivitiesService
{
    constructor(
        private api: ApiService,
    ) {}
    addressDisplay = new AddressDisplay();
    getNumberActivitiesOfAdvisor() {
        return this.api.get(activitiesAdvisorApi);
    }

    getNumberActiveActivitiesOfCustomer(){
        return this.api.get(getActiveActivityofCustomer).pipe(
            map(data=>{
                return data.data.length
            })
        )
    }

    getNumberCompletedActivitiesOfCustomer(){
        return this.api.get(getCompletedActivityofCustomer).pipe(
            map(data=>{
                return data.data.length
            })
        )
    }

    getNumberActivityofCustomer(){
        return this.api.get(activityCustomerCount).pipe(
            map(data=>{
                if(data.code === 200){
                    return data.data
                }
            }), catchError(data => throwError(data))
        )
    }

    getAllActiveActivitiesOfAdvisor(){
        return this.api.get(activitiesAdvisorActiveApi).pipe(
            map((data)=>{
                if(data.code === 200)
                {
                    let listActivities = [];
                    data.data.forEach(element => {
                    let activity = new Class();
                    activity.id = element.id;
                    activity.uri = element.cover_photo_key;
                    activity.title = element.title;
                    activity.address = this.addressDisplay.setDisplayAddressLine(element.address.unit_number,element.address.detail_address,element.address.city_state , element.address.postal_code)
                    activity.advisor = element.advisor.preferred_name;
                    activity.day = element.activity_date;
                    activity.start = element.start_time;
                    activity.end = element.end_time;
                    listActivities.push(activity);
                });
                    return listActivities;
                }else{
                    return;
                }
                
            }), catchError(data => throwError(data))
        )
    }

    getAllCompletedActivitiesOfAdvisor(){
        return this.api.get(activitiesAdvisorCompletedApi).pipe(
            map((data)=>{
                if(data.code === 200)
                {
                    let listActivities = [];
                    data.data.forEach(element => {
                        let activity = new Class();
                        activity.id = element.id;
                        activity.uri = element.cover_photo_key;
                        activity.title = element.title;
                        activity.address = this.addressDisplay.setDisplayAddressLine(element.address.unit_number,element.address.detail_address,element.address.city_state , element.address.postal_code)
                        activity.advisor = element.advisor.preferred_name;
                        activity.day = element.activity_date;
                        activity.start = element.start_time;
                        activity.end = element.end_time;
                        listActivities.push(activity);
                    });
                    return listActivities;
                }else{
                    return;
                }
               
            }), catchError(data => throwError(data))
        )
    }

    getAllRejectedActivitiesOfAdvisor(){
        return this.api.get(activitiesAdvisorRejectedApi).pipe(
            map((data)=>{
                if(data.code === 200)
                {
                    let listActivities = [];
                    data.data.forEach(element => {
                        let activity = new Class();
                        activity.id = element.id;
                        activity.uri = element.cover_photo_key;
                        activity.title = element.title;
                        activity.address = this.addressDisplay.setDisplayAddressLine(element.address.unit_number,element.address.detail_address,element.address.city_state , element.address.postal_code)
                        activity.advisor = element.advisor.preferred_name;
                        activity.day = element.activity_date;
                        activity.start = element.start_time;
                        activity.end = element.end_time;
                        listActivities.push(activity);
                    });
                    return listActivities;
                }else{
                    return;
                }
               
            }), catchError(data => throwError(data))
        )
    }

    getAllPendingActivitiesOfAdvisor(){
        return this.api.get(activitiesAdvisorPendingApi).pipe(
            map((data)=>{
                if(data.code === 200)
                {
                    let listActivities = [];
                    data.data.forEach(element => {
                    let activity = new Class();
                    activity.id = element.id;
                    activity.uri = element.cover_photo_key;
                    activity.title = element.title;
                    activity.address = this.addressDisplay.setDisplayAddressLine(element.address.unit_number,element.address.detail_address,element.address.city_state , element.address.postal_code)
                    activity.advisor = element.advisor.preferred_name;
                    activity.day = element.activity_date;
                    activity.start = element.start_time;
                    activity.end = element.end_time;
                    listActivities.push(activity);
                    });
                    return listActivities;
                }else{
                    return
                }
                
            }), catchError(data => throwError(data))
        )
    }

    getActivityById(id){
        let url = activityApi.replace(":id", id);
        return this.api.get(url).pipe(
            map((data)=>{
                if(data.code === 200)
                {
                    let activity = new Activity();
                    activity.id = data.data.id;
                    activity.title = data.data.title;
                    activity.uri = data.data.cover_photo_key;
                    activity.created_by =  data.data.advisor.preferred_name;
                    activity.activity_date =  data.data.activity_date;
                    activity.description =  data.data.description;
                    activity.start_time =  data.data.start_time;
                    activity.end_time =  data.data.end_time;
                    activity.type =   data.data.activity_type;
                    activity.privacy = data.data.privacy;
                    activity.capacity =  data.data.capacity;
                    // activity.address_unit =  data.data.address.unit_number;
                    activity.address_unit = this.addressDisplay.setDisplayAddressLine(data.data.address.unit_number,data.data.address.detail_address,data.data.address.city_state , data.data.address.postal_code)
                    activity.room_name = data.data.offices.length > 0 ?  data.data.offices[0].office_room_slot.office_room_id.room_name : '';
                    activity.address_city = data.data.address.city_state;
                    activity.notes=  data.data.notes;
                    activity.cover_photo_key = data.data.cover_photo_key;
                    let address = new Address();
                    address.id = data.data.address.id;
                    address.postalCode = data.data.address.postal_code;
                    address.cityState = data.data.address.city_state;
                    address.detailAddress = data.data.address.detail_address;
                    address.unitNumber = data.data.address.unit_number;
                    activity.address = address;
                    // if (!isNullOrUndefined(data.data.officeRoomSlotBooking)){
                    //     activity.roomId = data.data.officeRoomSlotBooking.office_room_slot.office_room_id;
                    // }
                    if(!isNullOrUndefined(data.data.offices)){
                        activity.offices = this.renderOffice(data.data.offices)
                    }
                    data.data.activity_attendees.forEach(element=>{
                        let attendee = new Attendee;
                        attendee.id = element.customer_id;
                        attendee.name = element.first_name + (element.last_name !== null ? ' ' +  element.last_name : '' );
                        attendee.phone = element.phone_number;
                        attendee.email = " ";
                        attendee.notes = element.notes;
                        attendee.attendance = element.is_attended == true ? "Yes" : 'No';
                        attendee.questionnaire1 = " ";
                        attendee.questionnaire2 = " ";
                        attendee.STT = data.data.activity_attendees.findIndex(el=>el == element) +1;
                        activity.attendees.push(attendee);
                    });
                    return activity
                }else{
                    return
                }
            })
        )
    }
    
    getActivityByActivityId(id){
        let url = getActiviryByActivityId.replace(":id", id);
        return this.api.get(url).pipe(
            map(data=>{
                if(data.code === 200){
                    let listAttendees =[];
                    data.data.forEach(element=>{
                        let attendee = new Attendee;
                        attendee.id = element.customer.id;
                        attendee.name = element.first_name + (element.last_name !== null ? ' ' + element.last_name : '');
                        attendee.phone_number = '(+' + element.phone_dial_code + ') ' + element.phone_number;
                        attendee.phone = element.phone_number;
                        attendee.dial_code = element.phone_dial_code;
                        attendee.email = element.customer.email;
                        attendee.firstName = element.first_name;
                        attendee.lastName =  element.last_name;
                        attendee.preferredName = element.preferred_name;
                        attendee.notes = element.notes;
                        attendee.date = !CheckNullOrUndefinedOrEmpty(element.activity) ? element.activity.activity_date : '' ;
                        attendee.attendance = element.is_attended == true ? "Yes" : 'No';
                        if(element.customer.questionnaire.length == 0){
                            attendee.questionnaire1 = "Not completed";
                            attendee.questionnaire2 = "Not completed";
                        }
                        if(element.customer.questionnaire.length == 1)
                        {
                            if (element.customer.questionnaire[0].questionnaire_type === "BEFORE"){
                                attendee.questionnaire1 = "Completed";
                                attendee.questionnaire2 = "Not completed";
                            }else{
                                attendee.questionnaire1 = "Not completed";
                                attendee.questionnaire2 = "Completed";
                            }   
                        }
                        if (element.customer.questionnaire.length == 2)
                        {
                            attendee.questionnaire1 = "Completed";
                            attendee.questionnaire2 = "Completed";
                        }
                        attendee.showView = true;
                        listAttendees.push(attendee);
                    });
                    return listAttendees;
                }else{
                    return
                }
            })
        )
    }


    //cancel Activity
    cancelActivity(activity_id : string)
    {
        let url = cancelActivityApi.replace(':id',activity_id);
        return this.api.post(url,'');
    }

    //Customer
    getAllActiveActivitiesOfCustomer(){
        return this.api.get(getActiveActivityofCustomer).pipe(
            map((data)=>{
                if(data.code === 200){
                    let listActivities = [];
                 data.data.forEach(element => {
          
                    let activity = new Class();
                    activity.id = element.id;
                    activity.uri = element.cover_photo_key;
                    activity.title = element.title;
                    activity.address = this.addressDisplay.setDisplayAddressLine(element.address.unit_number,element.address.detail_address,element.address.city_state , element.address.postal_code)
                    activity.advisor = element.advisor.preferred_name;
                    activity.day = element.activity_date;
                    activity.start = element.start_time;
                    activity.end = element.end_time;
                    listActivities.push(activity);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             });
                    return listActivities;
                }else{
                    return
                }
                
            }), catchError(data => throwError(data))
        )
    }


    getAllCompletedActivitiesOfCustomer(){
        return this.api.get(getCompletedActivityofCustomer).pipe(
            map((data)=>{
                if(data.code === 200)
                {
                    let listActivities = [];
                    data.data.forEach(element => {
                        let activity = new Class();
                        activity.id = element.id;
                        activity.uri = element.cover_photo_key;
                        activity.title = element.title;
                        activity.address = element.address.unit_number;
                        activity.advisor = element.advisor.preferred_name;
                        activity.day = element.activity_date;
                        activity.start = element.start_time;
                        activity.end = element.end_time;
                        listActivities.push(activity);
                    });
                    return listActivities;
                }else{
                    return
                }
               
            }), catchError(data => throwError(data))
        )
    }

    getAllReserveActivitiesOfCustomer()
    {
        return this.api.get(getReserveActivityofCustomer).pipe(
            map((data) =>
            {
                if(data.code === 200)
                {
                    let listActivities = [];
                    data.data.forEach(element =>
                    {
                        let activity = new Class();
                        activity.id = element.id;
                        activity.uri = element.cover_photo_key;
                        activity.title = element.title;
                        activity.address = element.address.unit_number;
                        activity.advisor = element.advisor.preferred_name;
                        activity.day = element.activity_date;
                        activity.start = element.start_time;
                        activity.end = element.end_time;
                        listActivities.push(activity);
                    });
                    return listActivities;
                }else{
                    return
                }                
            }), catchError(data => throwError(data))
        )
    }
    reserveActivity(activity_id){
        let url = ReserveActivity.replace(":id", activity_id);
        return this.api.post(url,'');
    }

    renderOffice(data){
        let offices = []
        if (!isNullOrUndefined(data) && data.length > 0){
            data.forEach(element => {
                let office = new Office();
                office.id = element.id;
                office.officeRoomSlotId = element.office_room_slot_id;
                office.status = element.status;
                office.bookingDate = element.booking_date;
                office.createdAt = element.created_at;
                office.updatedAt = element.updated_at;
                office.officeRoomSlot = this.renderofficeRoomSlot(element.office_room_slot);
                offices.push(office);
            });
        }
        return offices;
    }

    renderofficeRoomSlot(data) {
        let officeRoomSlot = new OfficeRoomSlot();
        if (!isNullOrUndefined(data)) {
            officeRoomSlot.id = data.id;
            officeRoomSlot.isActive = data.is_active;
            officeRoomSlot.officeRoomId = data.office_room_id;
            officeRoomSlot.slotDescription = data.slot_description
            officeRoomSlot.startTime = data.start_time;
            officeRoomSlot.endTime = data.end_time;
            officeRoomSlot.slotNumber = data.slot_number;
        }
        return officeRoomSlot;
    }

    //Branch manager
    getPendingRoomBookings()
    {
        return this.api.get(getPendingRoomBookingsApi).pipe(
            map((data) =>
            {
                if(data.code === 200){
                    let listPendingActivities = [];
                    data.data.forEach(element =>
                    {
                        let activity = new Activity();
                        activity.id = element.id;
                        activity.title = element.title;
                        activity.created_by = !isNullOrUndefined(element.advisor.preferred_name) ? element.advisor.preferred_name : element.advisor.firt_name ;
                        activity.activity_date = element.activity_date;
                        activity.description = element.description;
                        activity.type = element.activity_type;
                        activity.capacity = element.capacity;
                        activity.notes = element.notes;
                        activity.cover_photo_key = element.cover_photo_key;

                        activity.roomId = isNullOrUndefined(element.offices[0]) ? '' : element.offices[0].office_room_slot.office_room_id.room_name;
                        activity.bookingSlots = [];
                        element.offices.sort(function (a, b) { return a.office_room_slot_id - b.office_room_slot_id }).forEach(office =>{
                            let slotbooking = new OfficeRoomSlotBooking();
                            slotbooking.slotDescription = office.office_room_slot.slot_description;
                            activity.bookingSlots.push(slotbooking);
                        })
                        listPendingActivities.push(activity)
                    });
                return listPendingActivities;
                }else{
                    return
                }
                
            }), catchError(data => throwError(data))
        )
    }
    
    getPastRoomBookings()
    {
        return this.api.get(getPastRoomBookingsApi).pipe(
            map((data) =>
            {

                let listPendingActivities = [];
                if(data.code === 200){
                    
                    data.data.forEach(element =>
                    {
                        let activity = new Activity();
                        activity.id = element.id;
                        activity.title = element.title;
                        activity.status = element.status;
                        activity.created_by = !isNullOrUndefined(element.advisor.preferred_name) ? element.advisor.preferred_name : element.advisor.firt_name;
                        activity.activity_date = element.activity_date;
                        activity.description = element.description;
                        activity.type = element.activity_type;
                        activity.capacity = element.capacity;
                        activity.notes = element.notes;
                        // activity.cover_photo_key = element.cover_photo_key;
                        activity.roomId = isNullOrUndefined(element.offices[0])? null : element.offices[0].office_room_slot.office_room_id.room_name;
                        activity.bookingSlots = [];
                        element.offices.sort(function (a, b) { return a.office_room_slot_id - b.office_room_slot_id}).forEach(office =>
                        {
                            let slotbooking = new OfficeRoomSlotBooking();
                            slotbooking.slotDescription = office.office_room_slot.slot_description;
                            activity.bookingSlots.push(slotbooking);
                        })
                        listPendingActivities.push(activity)
                    });
                    
                    }
                    return listPendingActivities;
            }), catchError(data => throwError(data))
        )
    }

    rejectActivity(activity_id:string, rejectForm){
        let url = rejectActivityApi.replace(':activityID',activity_id);
        return this.api.put(url, rejectForm);
    }
    approveActivity(activity_id)
    {
        let url = approveActivityApi.replace(':activityID', activity_id);
        return this.api.put(url, '');
    }
}

export class Class{
    id      : number;
    uri     : string;
    title   : string;
    address : string;
    advisor : string;
    day     : string;
    start   : string;
    end     : string;
}

export class AdvisorActivity{
    id: number;
    entityId: number;
    firstName: string;
    lastName: string;
    phoneDialCode: number;
    phoneNumber: string;
    email: string;
    designation: string;
    languageCode: string;
    preferredName:string;
}

export class AddressActivity{
    id: number;
    postalCode: string;
    cityState: string;
    detailAddress:string;
    unitNumber: string;
    countryCode: string;
    createdAt: string;
    updatedAt:string;
}