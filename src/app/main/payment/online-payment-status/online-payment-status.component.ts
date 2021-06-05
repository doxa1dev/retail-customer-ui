import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/service/order.service';
import { isNullOrUndefined } from 'util';
import { MyProfile } from 'app/core/models/my-profile.model';
import { environment } from 'environments/environment';
import { MyProfileService } from '../../../core/service/my-profile.service';
import { PaymentService } from '../../../core/service/payment.service';
import { OrderPaymentOption } from '../../../core/enum/order-payment-option.enum';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from 'app/main/common-component/dialog-confirm/dialog-confirm.component';
import { DialogImageComponent } from 'app/main/common-component/dialog-image/dialog-image.component';
import { DialogCommonNaepComponent } from 'app/main/common-component/dialog-common-naep/dialog-common-naep.component';

@Component({
  selector: 'app-online-payment-status',
  templateUrl: './online-payment-status.component.html',
  styleUrls: ['./online-payment-status.component.scss']
})
export class OnlinePaymentStatusComponent implements OnInit {
  @Input() pendingVerified: any;
  @Input() verified: any;
  @Input() toPay: any;
  @Input() shipping: any;
  @Input() subTotal: any;
  @Input() total: any;
  @Input() remaining: any;
  @Input() currency: any;
  orderId: any;
  paymentSuccess: string;
  paymentSaved: string;
  remainingIsZero = false;

  paymentOption: any;
  orderData: any;
  fixedDeposit: any;
  installmentAmount: any;

  orderUuid: any;
  paymentError: string;
  session: string;
  token: string;
  apiShare: boolean;
  customer_uuid : string;
  is_anomynous_customer : boolean = false;
  is_buy_for_customer : boolean = false;
  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private myProfileService: MyProfileService,
    private paymentService: PaymentService,
    public  dialog    : MatDialog,
    
    ) { }

  ngOnInit(): void {
    // this.currency = localStorage.getItem('currency');
    localStorage.removeItem('formOrderLineSinglePaymentGiftArr');
    // localStorage.removeItem('hasOnlineBankingGift');
    // localStorage.removeItem('hasSinglePaymentGift');
    localStorage.removeItem('hasValidSinglePaymentGift');
    localStorage.removeItem('hasValidOnlineBankingGift');
    this.activedRoute.queryParams.subscribe(param => {
      this.orderId = param.orderId;
      this.paymentOption = param.paymentOption;
      this.orderUuid = param.uuid;
      this.session = param.session;
      this.getDataBySession(this.session);

      if (param.status == '1' && param.saveToDB == 'fail') {
        this.paymentSaved = 'fail';
      }
      else if (param.status == '1' && param.saveToDB == 'success') {
        if (Number(param.remaining) == 0) { this.remainingIsZero = true; }

        this.paymentSuccess = 'true';
        this.toPay = 0.00;
        this.shipping = param.shipping;
        this.subTotal = param.subTotal;
        this.total = param.total;
        this.remaining = Number(param.remaining);
        this.verified = param.verified;
        this.pendingVerified = param.pendingVerified;
      }

      else if (param.status == '1' && param.saveToDB == 'success' && this.paymentOption === OrderPaymentOption.EPP) {
        this.paymentSuccess = 'true';

      }
      else if (param.status == '0') {
        this.paymentError = 'true';
      }
      else {
        this.paymentSuccess = 'false';
      }
    });

  }

  // showDialLog()
  // {
  //   this.is_anomynous_customer  = this.orderData.customer_order.is_anomynous_account;
  //   if(this.is_anomynous_customer)
  //   {
  //     const dialogRef = this.dialog.open(DialogConfirmComponent, {
  //       width: '500px',
  //       data: { message: 'Do you want to create account?', type : "APPROVED" }
  //     });
  //     dialogRef.afterClosed().subscribe(result =>
  //     {
  //       if (result === true)
  //       {
          
  //         this.router.navigate(['register'], { queryParams: { customer_uuid:  this.orderData.customer_order.uuid} })
  //       } else
  //       {
  //         dialogRef.close();
  //       }
  //     })
  //   }
  // }

  getDataBySession(session){
    this.token = localStorage.getItem('token');
    this.apiShare = !CheckNullOrUndefinedOrEmpty(session) && CheckNullOrUndefinedOrEmpty(this.token) ? true : false; 
    if(!CheckNullOrUndefinedOrEmpty(session) && CheckNullOrUndefinedOrEmpty(this.token)){
      this.orderService.renderDataOrderAfterPayment(this.session).subscribe(respone=>{
        if (!CheckNullOrUndefinedOrEmpty(respone)) {
          this.orderData = respone;
          this.total = this.orderData.totalAmount;
          this.currency = this.orderData.currency;
          this.fixedDeposit = this.orderData.deposit_amount;
          this.installmentAmount = (this.total - this.fixedDeposit);
          this.is_anomynous_customer  = this.orderData.customer_order.is_anomynous_account;
          if(this.is_anomynous_customer)
          {
            this.customer_uuid = respone.customer_order.uuid
          }
        }
      })
    }else{
      this.getOrder(this.orderUuid);
    }
  }

  getOrder(orderId) {
    return new Promise((resolve) => {
      this.orderService.getOrderByOrderId(orderId).subscribe((respone) => {
        if (!CheckNullOrUndefinedOrEmpty(respone)) {
          this.orderData = respone;
          this.total = this.orderData.totalAmount;
          this.currency = this.orderData.currency;
          this.fixedDeposit = this.orderData.deposit_amount;
          this.installmentAmount = (this.total - this.fixedDeposit);
          this.is_anomynous_customer  = this.orderData.customer_order.is_anomynous_account;
          this.is_buy_for_customer = this.orderData.is_buying_for_customer
          if(this.is_anomynous_customer)
          {
            this.customer_uuid = respone.customer_order.uuid
          }
          if(respone.is_naep_order  &&  this.paymentOption == 'FUL' && this.paymentSuccess == 'true')
          {
            this.showDialogNaep()
          }
        }
      });
    });
  }

  renderDataSession(){

  }

  backtoStore() {
    // localStorage.removeItem('hasOnlineBankingGift');
    // localStorage.removeItem('hasSinglePaymentGift');
    // this.router.navigate(["/store"]);
    if(this.is_anomynous_customer && !this.is_buy_for_customer)
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

  backtoPaymentOption() {
    let orderId = this.orderId;

    if (localStorage.getItem('hasSinglePaymentGift') === 'true' && !this.orderData.is_naep_order) {
      // localStorage.removeItem('hasSinglePaymentGift');

      this.router.navigate(["../extra-gift"], {
        queryParams: {
          methodRadio: 'TT',
          orderId: orderId,
          paymentOption: OrderPaymentOption.FULL,
          uuid: this.orderUuid
        },
      });
      
    } else {
      this.router.navigate(["/select-payment"], {
        queryParams: {
          orderId: orderId,
          uuid: this.orderUuid,
          paymentOption: OrderPaymentOption.FULL
        },
      });
    }
    // this.router.navigate(["/payment-options"], {
    //   queryParams: {
    //     id: orderId,
    //     paymentOption: this.paymentOption,
    //     uuid: this.orderUuid
    //   },
    // });
  }

  toConfirmInstallment() {
    this.router.navigate(["/installment-confirm"], {
      queryParams: {
        id: this.orderId,
        uuid: this.orderUuid
      },
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
        title: "CONGRATULATIONS!",
        buttonText: "OK",
        message: "You’re a New Partner!",
        message2: "Kindly login again to apply changes to your account. Please continue the last few steps of the New Advisor Earning Program.",
        buttonColor: true
      },
    });
    dialogNotifi.afterClosed().subscribe(value=>{
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    })

  }
}
