import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { cartegoryListApi } from './backend-api';
import { ApiService } from './api.service'
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { allOfficeRoomApi, getTimeTableRoomBookingsApi} from './backend-api';
import { Room, AllRoom, Slot , ActivityActive} from '../models/room.model'
import { element } from 'protractor';
import { isNullOrUndefined } from 'util';
@Injectable({
    providedIn: 'root'
})
export class RoomStatusService
{
    constructor(
        private api: ApiService,
        private http: HttpClient,
    ) { }

    GetAllRoomSlot(){
        return this.api.get(allOfficeRoomApi).pipe(map(data=>{
            if(data.code === 200){
                let slots: Slot[] = [];
                data.data.forEach(slot => {
                    let newSlot = new Slot();
                    newSlot.id = slot.id;
                    newSlot.slot_description = slot.slot_description;
                    newSlot.room_name = slot.office_room_id.room_name;
                    slots.push(newSlot);
                });
                let allRoom: Room[] = [] ;
                slots.forEach(slot=>{
                    if (allRoom.length === 0)
                    {
                        let newroom = new Room();
                        newroom.slots = [];
                        newroom.room_name = slot.room_name;
                        newroom.slots.push(slot);
                        allRoom.push(newroom);
                    }
                    else{
                        let index = allRoom.findIndex(room => room.room_name == slot.room_name);
                        if(index == -1){
                            let newroom = new Room();
                            newroom.slots = [];
                            newroom.room_name = slot.room_name;
                            newroom.slots.push(slot);
                            allRoom.push(newroom);
                        }else{
                            allRoom[index].slots.push(slot);
                        }
                    }
                })
                return allRoom;
            }
        }))
    }

    GetRoomSlotBooking(date: string){
        let url = getTimeTableRoomBookingsApi.replace(':timetabledate',date);
        return this.api.get(url).pipe(map(data=>{
            if(data.code === 200){
                let Activities : ActivityActive[] = [];
                if(data.data.length === 0){
                    return Activities;
                }else{
                    data.data.forEach(activity => {
                        let Activity = new ActivityActive();
                        Activity.activity_id = activity.id;
                        Activity.activity_type = activity.activity_type;
                        Activity.actyvity_advisor = !isNullOrUndefined(activity.advisor.preferred_name) ? activity.advisor.preferred_name : activity.advisor.firt_name;
                        Activity.activity_room_slots = [];
                        activity.offices.forEach(slot=>{
                            Activity.activity_room_slots.push(slot.office_room_slot_id);
                        })
                        Activity.activity_room_slots.sort();
                        Activities.push(Activity)
                    });
                    return Activities
                }
            }
        }))
    }

}
