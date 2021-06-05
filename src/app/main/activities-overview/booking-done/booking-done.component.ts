import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-done',
  templateUrl: './booking-done.component.html',
  styleUrls: ['./booking-done.component.scss']
})
export class BookingDoneComponent implements OnInit {

  constructor(
    private router:Router,
  ) { }

  ngOnInit(): void {
  }

  navigateToActivity(){
    this.router.navigate(['activity-overview'])
  }
}
