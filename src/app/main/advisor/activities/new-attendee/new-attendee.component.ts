import { Component, OnInit } from '@angular/core';
import { Title } from 'app/core/enum/title';

@Component({
  selector: 'app-new-attendee',
  templateUrl: './new-attendee.component.html',
  styleUrls: ['./new-attendee.component.scss']
})
export class NewAttendeeComponent implements OnInit {
  title = Title.LEFT;
  attendees = []
  constructor() { }

  ngOnInit(): void {
  }

}
