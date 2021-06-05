import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'paym-pos',
  templateUrl: './pay-m-pos.component.html',
  styleUrls: ['./pay-m-pos.component.scss']
})
export class PayMPOSComponent implements OnInit {

  selected: string;
  isShow = true;
  isShowPin = true;
  isShowComplete = true;
  
  constructor() { }

  ngOnInit(): void {
  }

  onSelect() {
    if (this.selected != "") {
      this.isShow = false;
    }
  }

  onLoadPin() {
    this.isShow = true;
    this.isShowPin = false;
    this.isShowComplete = true;
  }

  onLoadComplete() {
    this.isShow = true;
    this.isShowPin = true;
    this.isShowComplete = false;
  }

  onLoadStore() {
    location.href = 'http://localhost:4200/paym-pos';
  }
}
