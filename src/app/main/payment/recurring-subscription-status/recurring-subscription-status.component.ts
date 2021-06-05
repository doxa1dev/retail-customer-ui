import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';

@Component({
  selector: 'app-recurring-subscription-status',
  templateUrl: './recurring-subscription-status.component.html',
  styleUrls: ['./recurring-subscription-status.component.scss']
})
export class RecurringSubscriptionStatusComponent implements OnInit {


  orderId: any;
  paymentSuccess: string;
  paymentSaved:string;

  orderUuid: any;


  remainingIsZero=false;
  session: string;
  token: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token")
    this.activatedRoute.queryParams.subscribe(param =>{

      this.orderId=param.orderId;
      this.orderUuid = param.uuid;
      this.session = param.session;
      if(param.status=='success' && param.saveToDB=='fail')
      {
      this.paymentSaved='fail'; 
      }

      else if(param.status=='success' && param.saveToDB=='success')
      {
        this.paymentSaved='success';
      }

      else if(param.status=='fail') {
        this.paymentSuccess='false';
      }
    });
  }


  backtoStore(){
    this.router.navigate(["/store"]);

}

  toPayRecurringPayment(){
    this.router.navigate(["/installment-confirm"], {
      queryParams: (CheckNullOrUndefinedOrEmpty(this.session) && CheckNullOrUndefinedOrEmpty(this.token)) ? {
        id: this.orderId,
        uuid: this.orderUuid
      }:{session: this.session},
    });
}

}

