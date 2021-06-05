import { isNullOrUndefined } from 'util';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Order, OrderService } from 'app/core/service/order.service';
import { Location} from '@angular/common';
import { Title } from 'app/core/enum/title';
@Component({
  selector: 'app-to-unbox',
  templateUrl: './customer-unbox.component.html',
  styleUrls: ['./customer-unbox.component.scss']
})
export class CustomerUnboxComponent implements OnInit {
  qrvalue : string;
  order: Order;
  title = Title.LEFT;
  order_id : number;
  constructor(
    private router   : Router,
    private location : Location,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
  ) { }
  
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.order_id = params.uuid;
    });
    if(!isNullOrUndefined(this.order_id))
    {
      this.orderService.getOrderByOrderIdCustomer(this.order_id).subscribe(data=>{
        this.order = data;
        this.qrvalue = JSON.stringify({
          "order_id": this.order.id,"customer_id": this.order.customerId, "advisor_customer_id": this.order.advisorCustomer.id
        });
      })
    }
    

  }
  back(){
    this.location.back();
  }
}
