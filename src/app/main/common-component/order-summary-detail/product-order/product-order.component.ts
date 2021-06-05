import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Component, Input, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import * as moment from "moment";
import { environment } from 'environments/environment';
import { isEmpty } from 'lodash';
@Component({
  selector: 'app-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.scss']
})
export class ProductOrderComponent implements OnInit {

  @Input() listProduct : any;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.listProduct,'thach')
  }


}
