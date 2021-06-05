import { Component, OnInit } from '@angular/core';
import { Title } from 'app/core/enum/title';

@Component({
  selector: 'app-buy-packet-naep-success',
  templateUrl: './buy-packet-naep-success.component.html',
  styleUrls: ['./buy-packet-naep-success.component.scss']
})
export class BuyPacketNaepSuccessComponent implements OnInit {

  constructor(
  ) { }

  title = Title.LEFT_LINK

  ngOnInit(): void {
  }

}
