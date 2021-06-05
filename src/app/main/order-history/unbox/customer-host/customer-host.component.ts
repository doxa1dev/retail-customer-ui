import { Component, OnInit } from '@angular/core';
import { Order, OrderService } from 'app/core/service/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common'
import { Title } from 'app/core/enum/title';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-customer-host',
  templateUrl: './customer-host.component.html',
  styleUrls: ['./customer-host.component.scss']
})
export class CustomerHostComponent implements OnInit {
  title = Title.LEFT;
  qrvalue: string;
  order: Order;
  order_id : number;
  constructor(
    private router: Router,
    private location : Location,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
  ) { }

  ngOnInit()
  {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.order_id = params.id;
    });
    if(!isNullOrUndefined(this.order_id))
    {
      this.orderService.getOrderByOrderIdCustomer(this.order_id).subscribe(data=>{
        this.order = data;
        this.qrvalue = JSON.stringify({
          "order_id": this.order.id,
          "customer_id": this.order.customerId, "advisor_customer_id": this.order.advisorCustomer.id
        });
      })
    }
  }
  back(){
    this.location.back();
  }

}
