import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Order, OrderService } from 'app/core/service/order.service';
import { REASONS_FOR_CUSTOMER_TO_NOT_UNBOX } from '../../../../core/constants/constant';
import { isNullOrUndefined } from 'util';
import { Title } from 'app/core/enum/title';
@Component({
  selector: 'app-nounbox',
  templateUrl: './customer-no-unbox.component.html',
  styleUrls: ['./customer-no-unbox.component.scss']
})
export class CustomerNoUnboxComponent implements OnInit {
  order: Order;
  reason: string;
  reasonInput: string;
  reasonList = REASONS_FOR_CUSTOMER_TO_NOT_UNBOX;
  isError : boolean = false;
  title = Title.LEFT;
  order_id : string;
  active: boolean = false;
  buttonName : string = "CONFIRM"
  constructor(
    private _location : Location,
    private router: Router,
    private orderSevice: OrderService,
    private activatedRoute: ActivatedRoute,

  ) { 
    this.activatedRoute.queryParams.subscribe((params) => {
      this.order_id = params.uuid;
    });
  }

  ngOnInit(): void {
    this.reason = this.reasonList[0].value;
  }

  back()
  {
    this._location.back();
  }
  onKey(event){
    if(this.isError === true && event.target.value !== '')
    {
      this.isError = false;
    }
    if(event.target.value === '')
    {
      this.isError = true;
    }
  }
  noUnbox(){
    if(this.reason === '100')
    {
      if (isNullOrUndefined(this.reasonInput))
      {
        this.isError = true;
        return;
      }
    }
    const rea = this.reasonList.find(el => el.value === this.reason) ? this.reasonList.find(el => el.value === this.reason).label : this.reasonInput;
    this.orderSevice.updateReasonForNoHostNoUnbox(rea, this.order_id, 0).subscribe(data=>{
      this.router.navigate(['/order-history'], { state: { selectTab: 5 } });
    });
    
  }
}
