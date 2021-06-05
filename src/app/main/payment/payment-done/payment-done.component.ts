import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/service/order.service';
import { isNullOrUndefined } from 'util';
import { PaymentService } from 'app/core/service/payment.service';
import { Title } from 'app/core/enum/title';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { PaymentCommon } from '../payment-common-function';
import { DialogConfirmComponent } from 'app/main/common-component/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogImageComponent } from 'app/main/common-component/dialog-image/dialog-image.component';
import { DialogCommonNaepComponent } from 'app/main/common-component/dialog-common-naep/dialog-common-naep.component';

@Component({
  selector: 'app-payment-done',
  templateUrl: './payment-done.component.html',
  styleUrls: ['./payment-done.component.scss']
})
export class PaymentDoneComponent implements OnInit {

  @Input() pendingVerified: any;
  @Input() verified: any;
  @Input() toPay: any;
  @Input() shipping: any;
  @Input() subTotal: any;
  @Input() total: any;
  @Input() remaining: any;
  @Input() currency: any;
  orderId: any;
  orderUuid: any;
  title = Title.LEFT_LINK;
  is_anomynous_customer : boolean = false;

  session: string;
  token: string;
  customer_uuid : string;
  is_buy_for_customer : boolean = false;
  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router, 
    private orderService: OrderService,
    private paymentCommon: PaymentCommon,
    private payment: PaymentService,
    public  dialog    : MatDialog,
    
    ) { }

  ngOnInit(): void {
    // this.toPay = localStorage.getItem('toPay')
    // this.remaining = localStorage.getItem('remaining') 
    localStorage.removeItem('formOrderLineSinglePaymentGiftArr');
    localStorage.removeItem('hasOnlineBankingGift');
    localStorage.removeItem('hasSinglePaymentGift');
    localStorage.removeItem('hasValidSinglePaymentGift');

    this.activedRoute.queryParams.subscribe(param => {
      this.orderId = param.orderId;
      this.orderUuid = param.uuid;
      this.session = param.session;
      this.getDataIfHaveSession(this.session)
    })

    // this.getPendingVerifiedPayment(this.orderId)
    // this.getVerifiedPayment(this.orderId)
    // this.getOrderByUuid(this.orderUuid)
    // this.getRemainingPayment(this.orderId)
  }


  getOrderByUuid(uuid) {
    return new Promise((resolve) => {
      this.orderService.getOrderByOrderUuid(uuid).subscribe((respone) => {
        this.renderData(respone)
      });
    });
  }

  getDataIfHaveSession(session){
    if(this.paymentCommon.shareForNotCustomer(session)){
      this.orderService.renderDataOrderAfterPayment(session).subscribe(respone=>{
        this.renderData(respone)
      })
    }else{
      this.getOrderByUuid(this.orderUuid);
    }
  }

  gotoStore(){
    if((this.is_anomynous_customer && this.paymentCommon.shareForNotCustomer(this.session)) || (this.is_anomynous_customer && !this.is_buy_for_customer))
      {
        const dialogRef = this.dialog.open(DialogConfirmComponent, {
          width: '500px',
          data: { 
            message: "Do you want to become a club member? Let's create a club account now.", 
            type : "COMMON",
            titleDialog : "Thanks for coming to us!",
            btnYes : "Yes, please.",
            btnNo : "No, later.",
            classSuccess : true
          }
        });
        dialogRef.afterClosed().subscribe(result =>
        {
          if (result === true)
          {
            localStorage.removeItem('token')
            this.router.navigate(['register'], { queryParams: { customer_uuid:  this.customer_uuid} })
          } else
          {
            localStorage.removeItem('token')
            this.router.navigate(['store'])
          }
        })
      }
      else{
        this.router.navigate(['store'])
      }
  }

  renderData(response){
    console.log(response,'thach')
    if (!CheckNullOrUndefinedOrEmpty(response)) {

      this.shipping = response.shippingFee;
      this.subTotal = response.subtotal;
      this.total = response.totalAmount;
      this.currency = response.currency;
      this.toPay = response.totalAmount;
      this.is_anomynous_customer  = response.customer_order.is_anomynous_account;
      this.is_buy_for_customer = response.is_buying_for_customer;
      if(this.is_anomynous_customer)
      {
        this.customer_uuid = response.customer_order.uuid
      }
      if(response.is_naep_order)
      {
        this.showDialogNaep()
      }
    }
  }



  showRegister(){

  }

  getPendingVerifiedPayment(orderId) {
    this.payment.getPendingVerifiedByOrderId(orderId).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.pendingVerified = data.pending;
      }
    });
  }

  getVerifiedPayment(orderId) {
    this.payment.getVerifiedByOrderId(orderId).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.verified = data.verified;
      }
    });
  }

  getRemainingPayment(orderId) {
    this.payment.getRemainingByOrderId(orderId).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.remaining = data.remaining;

      }
    });
  }


  showDialogNaep() { 
    // const dialogRef = this.dialog.open(DialogImageComponent, {
    //   width: '500px',
    //   data: { 
    //     image: 'assets/images_doxa/naep_done.jpg',
    //     title: "Congratulations!", 
    //     message1 : "Only last few steps to start your NAEP.",
    //     message2 : "Let's access 'New Advisor Earning Program' on Left Menu to process.",
    //   }
    // });
    const dialogNotifi = this.dialog.open(DialogCommonNaepComponent, {
      disableClose: true,
      width: "500px",
      data: {
        title: "THANK YOU!",
        buttonText: "OK",
        message: "Please progress your payment at Office to continue next step of New Partner Earning Program.",
        buttonColor: true
      },
    });
    dialogNotifi.afterClosed().subscribe()
  }
}
