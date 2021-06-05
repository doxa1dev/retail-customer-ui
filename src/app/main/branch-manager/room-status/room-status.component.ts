import { isNullOrUndefined } from 'util';
import { Component, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { Location , DatePipe} from '@angular/common';
import { DOCUMENT } from '@angular/common'; 
import { RoomStatusService } from 'app/core/service/room-status.service';
import { Room, ActivityActive} from 'app/core/models/room.model'
import { Title } from 'app/core/enum/title'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-room-status',
  templateUrl: './room-status.component.html',
  styleUrls: ['./room-status.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RoomStatusComponent implements OnInit {
  title = Title.LEFT;
  todayDate: Date = new Date();
  minDate: Date = new Date();
  timeSlot = [];
  allRoom : Room[];
  Activities : ActivityActive[];
  htmlString : string;
  matCardString : string;
  colorArray: string[] = ['#FCDFDF', '#9DD696', '#F8F6B2', '#E3F3E2','#DFDFDF'];
  constructor(
    
    private location : Location,
    private elRef: ElementRef,
    private roomStatusService: RoomStatusService,
    private datePipe: DatePipe,
    private activedRoute: ActivatedRoute
  ) { 
    // if(!isNullOrUndefined())
    
  }

  ngOnInit(): void {

    this.activedRoute.queryParams.subscribe( param =>{
      if(!isNullOrUndefined(param.date))
      {
        this.todayDate = new Date(param.date);
      }
    })

    let defaultDate = this.datePipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.roomStatusService.GetAllRoomSlot().subscribe(data =>{
      this.allRoom = data;
 
      this.GetInfo(defaultDate);
    })
    
  }
  
  GetInfo(date: string){
    this.Activities = [];
    this.roomStatusService.GetRoomSlotBooking(date).subscribe(data=>{
      this.Activities = data;
      this.Activities = this.Activities.sort();
      if (this.Activities.length == 0)
      {
        this.Activities = [];

        return this.Activities;
      } else
      {
        for (let i = 0; i < this.Activities.length; i++)
        {
          if (this.Activities[i].activity_room_slots.length == 1)
          {
            document.getElementById('s' + this.Activities[i].activity_room_slots[0]).style.backgroundColor = this.colorArray[i%5];
            document.getElementById('s' + this.Activities[i].activity_room_slots[0]).style.borderRadius = '8px 8px 8px 8px';
            document.getElementById('s' + this.Activities[i].activity_room_slots[0]).innerHTML = 'Booking ' + (i + 1);
            
          }
          else if(this.Activities[i].activity_room_slots.length == 2)
          {
            document.getElementById('s' + this.Activities[i].activity_room_slots[0]).style.backgroundColor = this.colorArray[i%5];
            document.getElementById('s' + this.Activities[i].activity_room_slots[0]).style.borderRadius = '8px 0px 0px 8px';
            document.getElementById('s' + this.Activities[i].activity_room_slots[0]).innerHTML = 'Booking ' + (i + 1);
            document.getElementById('s' + this.Activities[i].activity_room_slots[1]).style.backgroundColor = this.colorArray[i%5];
            document.getElementById('s' + this.Activities[i].activity_room_slots[1]).style.borderRadius = '0px 8px 8px 0px';
          }
          else if (this.Activities[i].activity_room_slots.length == 3)
          {
            document.getElementById('s' + this.Activities[i].activity_room_slots[0]).style.backgroundColor = this.colorArray[i%5];
            document.getElementById('s' + this.Activities[i].activity_room_slots[0]).style.borderRadius = '8px 0px 0px 8px';
            document.getElementById('s' + this.Activities[i].activity_room_slots[0]).innerHTML = 'Booking ' + (i + 1)
            document.getElementById('s' + this.Activities[i].activity_room_slots[1]).style.backgroundColor = this.colorArray[i%5];
            document.getElementById('s' + this.Activities[i].activity_room_slots[2]).style.backgroundColor = this.colorArray[i%5];
            document.getElementById('s' + this.Activities[i].activity_room_slots[2]).style.borderRadius = '0px 8px 8px 0px';
          }
           this.allRoom.forEach((Room,index)=>{
            Room.slots.forEach(slot=>{
              if(slot.id === this.Activities[i].activity_room_slots[0])
              {
                let booking = document.createElement("P");
                booking.innerHTML = `<span style="font-weight: bolder; color: #5a616f}">Booking ${i + 1}: ${this.Activities[i].activity_type} - ${this.Activities[i].actyvity_advisor}</span>`;
                document.getElementById('room'+index).appendChild(booking) 
              }
            })
          })
        }
      }
    });
  }
  onChangeDate(event){
    let datePicker = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.roomStatusService.GetAllRoomSlot().subscribe(data =>
    {
      this.allRoom = data;
      this.GetInfo(datePicker);
    })
  }


  back(){
    this.location.back();
  }

}
