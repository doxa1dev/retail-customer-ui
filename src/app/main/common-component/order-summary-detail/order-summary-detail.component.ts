import { CustomerInformation, DeliveryAddress } from 'app/core/service/order.service';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'app/core/models/product.model';

@Component({
  selector: 'app-order-summary-detail',
  templateUrl: './order-summary-detail.component.html',
  styleUrls: ['./order-summary-detail.component.scss']
})
export class OrderSummaryDetailComponent implements OnInit {

  @Input() data: any;
  is_need_advisor : boolean = false;
  is_naep_order : boolean = false;
  isRedemptionPrice : boolean = false;
  constructor() { }

  ngOnInit(): void {
    
    this.data.listProduct.forEach(element => {
      this.is_need_advisor = this.is_need_advisor || element.hasAdvisor;
    });

    this.is_naep_order = this.data.is_naep_order;
    this.isRedemptionPrice  =  this.data.isRedemptionPrice;
  }

}
