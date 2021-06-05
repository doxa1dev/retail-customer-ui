import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PaymentService } from "app/core/service/payment.service";
import { OrderService } from "app/core/service/order.service";
import { isNullOrUndefined } from "util";
import { OrderPaymentOption } from "../../../core/enum/order-payment-option.enum";
import { SharedService } from 'app/core/service/commom/shared.service';
import { Title } from 'app/core/enum/title';
import { environment } from 'environments/environment';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CheckNullOrUndefinedOrEmpty } from "app/core/utils/common-function";
import { PaymentCommon } from "../payment-common-function";
// import { environment } from '../../../../environments/environment.uat-thermomix-sg';

@Component({
  selector: "app-pay-at-office",
  templateUrl: "./pay-at-office.component.html",
  styleUrls: ["./pay-at-office.component.scss"],
})
export class PayAtOfficeComponent implements OnInit {
  @Input() toPay: any;
  @Input() shipping: any;
  @Input() subTotal: any;
  @Input() toTal: any;
  @Input() remaining: any;
  @Input() currency: any;
  orderId: any;
  orderUuid: any;
  toPayPartially: any;
  toPayFull: any;
  valueRadio: any;
  @Input() pendingVerified: any;
  @Input() verified: any;
  paymentMethod: any;
  disabled = false;
  methodRadio: any;
  buttonName = "Click here to complete payment";
  active: boolean = false;
  disabledBtn;

  paymentOption: any;
  title = Title.LEFT;

  hasValidSinglePaymentGift: boolean;
  companyAddr = environment.companyInfo.company_address;
  companyName = environment.companyInfo.id;

  loading: boolean= true;
  entity = environment.entity
  paymentGifts: any;
  order_id_tmm: number;
  session: string;
  token: string;
  apiShare: boolean;
  constructor(
    private router: Router,
    private payment: PaymentService,
    private activedRoute: ActivatedRoute,
    private order: OrderService,
    private sharedService: SharedService,
    private orderService: OrderService,
    public dialog: MatDialog,
    private paymentCommon: PaymentCommon
  ) { }

  ngOnInit(): void {
    // this.toPay = localStorage.getItem('toPay');
    // this.remaining = localStorage.getItem('remaining');
    this.valueRadio = localStorage.getItem('selectPay');
    this.hasValidSinglePaymentGift = localStorage.getItem('hasValidSinglePaymentGift') === 'true';

    if (localStorage.getItem('formOrderLineSinglePaymentGiftArr')) {
      this.paymentGifts = JSON.parse(localStorage.getItem('formOrderLineSinglePaymentGiftArr')).formOrderLineSinglePaymentGiftArr;
    }

    this.activedRoute.queryParams.subscribe((param) => {
      this.session = param.session;
      this.methodRadio = param.methodRadio;
      this.orderUuid = param.uuid;
      this.getdataShare(this.session)
    });
  }

  getOrderByUuid(uuid) {
    return new Promise((resolve) => {
      this.order.getOrderByOrderUuid(uuid).subscribe((respone) => {
        this.renderData(respone);
      });
    });
  }

  getdataShare(session){
    this.apiShare = this.paymentCommon.isApiShare(session);
    if(this.paymentCommon.shareForNotCustomer(session)){
      this.orderService.getDateShareOrder(session).subscribe(data=>{
        this.renderShareOrder(data);
      })
    }else if(this.paymentCommon.shareForCustomer(session)){
      this.orderService.getDataForShareOrderCustomer(session).subscribe(data=>{
        this.renderShareOrder(data)
      })
    }else{
      this.getOrderByUuid(this.orderUuid);
    }
  }

  renderShareOrder(data){
    if(data == "expired"){
      this.paymentCommon.dialogExpired();
    }else{
      this.renderData(data);
    }
  }

  renderData(respone){
    if (!CheckNullOrUndefinedOrEmpty(respone)) {
      // console.log(respone)
      this.orderUuid = respone.uuid;
      this.shipping = respone.shippingFee;
      this.subTotal = respone.subtotal;
      this.toTal = respone.totalAmount;
      this.currency = respone.currency;
      this.order_id_tmm = this.order_id_tmm || respone.order_id_tmm;
      this.orderId = this.orderId || respone.id;
      this.methodRadio = this.methodRadio || 'OFFICE';
      this.paymentOption = respone.paymentOption;
      this.toPay = (this.paymentOption != OrderPaymentOption.DEPOSIT) ? this.toTal : respone.deposit_amount ;
      this.remaining = (this.paymentOption != OrderPaymentOption.DEPOSIT) ? 0 :(this.toTal - respone.deposit_amount) ;
      this.pendingVerified = (this.paymentOption == OrderPaymentOption.DEPOSIT) ? 0 : "";
      this.verified = (this.paymentOption == OrderPaymentOption.DEPOSIT) ? 0 : "";
      this.orderId = respone.id;
      this.loading = false; 
    }
  }

  createPayment() {
    this.orderService.checkOrderHasBeenPaid(this.orderUuid).subscribe(data=>{
      if(data){
        if (this.paymentOption === OrderPaymentOption.FULL || this.paymentOption === OrderPaymentOption.EPP) {
          this.createPaymentforFullPaymentOption();
        } else if (this.paymentOption === OrderPaymentOption.DEPOSIT) {
          this.createPaymentforDeposit();
        }

      }else{
        this.paymentCommon.dialogPaymentHasBeenPaid();
      }
    })
  }

  createPaymentforFullPaymentOption() {
    this.active = true;
    this.buttonName = "Processing...";
    const formPayment = {
      order_id: this.orderId,
      payment_amount: this.toPay,
      payment_method: this.methodRadio,
      payment_gateway: this.methodRadio,
      paymentOption: this.paymentOption,
      is_singlePayment: this.hasValidSinglePaymentGift,
      singlePaymentOrderLineGifts: this.paymentGifts,
      session: this.session
    };
    // console.log(formPayment);

    this.payment.createPayment(formPayment , this.apiShare).subscribe((res) => {
      if (res.code === 200) {
        this.payment.getRemainingByOrderId(this.orderId , this.apiShare).subscribe((res) => {
          if (res.remaining == 0) {
            this.active = false;
            this.updateStatusPayment();
          } else {
            this.active = false;
            this.nextToPayDone();

          }
        });
      } else {
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
            "There is an error with the payment. Please try again.",
            title:
            "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data=>{
          this.buttonName = "Click here to complete payment";
          this.active = false
        })
      }
    });
  }

  createPaymentforDeposit() {
    this.active = true;
    this.buttonName = "Processing...";
    const formPayment = {
      order_id: this.orderId,
      payment_amount: this.toPay,
      payment_method: this.methodRadio,
      payment_gateway: this.methodRadio,
      paymentOption: this.paymentOption,
      session: this.session
    };
    // console.log(formPayment);

    this.payment.createPayment(formPayment , this.apiShare).subscribe((res) => {
      if (res.code == 200) {
        this.payment.getRemainingByOrderId(this.orderId , this.apiShare).subscribe((res) => {
          this.remaining = res.remaining;
        });

        this.active = false;
        this.nextToPayContinue();
        this.buttonName = "Click here to complete payment";
      }
    });
  }

  updateStatusPayment() {
    return this.order
      .updateStatus(this.orderId, "TO_VERIFY" , this.apiShare , this.session)
      .subscribe((data) => {
        if (data.code === 200) {
          this.pendingVerified =
            Number(this.toPay) + Number(this.pendingVerified);
          this.toPay = 0;
          this.remaining = 0;
          this.nextToPayDone();
        } else {
          this.disabled = false;
        }
      });
  }

  // backToSelectPayment() {
  //   if (this.paymentOption === OrderPaymentOption.FULL) {
  //     const orderId = this.orderId;

  //     this.router.navigate(["/select-payment"], {
  //       queryParams: {
  //         orderId: orderId,
  //         uuid: this.orderUuid  
  //       },
  //     });
  //   } else if (this.paymentOption === OrderPaymentOption.DEPOSIT) {
  //     this.router.navigate(["../deposit-payment-method"], {
  //       queryParams: {
  //         id: this.orderId,
  //         paymentOption: OrderPaymentOption.DEPOSIT,
  //       },
  //     });
  //   }
  // }

  nextToPayDone() {
    const orderId = this.orderId;
    localStorage.setItem('toPay', '0');
    this.router.navigate(["/payment-done"], {
      queryParams: (CheckNullOrUndefinedOrEmpty(this.session)) ? {
        orderId: orderId,
        uuid: this.orderUuid
      } : {session: this.session},
    });

    // if ((this.remaining - this.toPay == 0 && this.remaining != this.toPay) || this.toPay == 0) {
    // } else {
    //   this.nextToPayContinue();
    // }
  }

  nextToPayContinue() {
    localStorage.setItem('toPay', '0');

    this.router.navigate(["/payment-continue"], {
      queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? {
        orderId: this.orderId,
        paymentOption: this.paymentOption,
        uuid: this.orderUuid
      }: {session: this.session},
    });
  }

  //Not use
  getPendingVerifiedPayment(orderId) {
    this.payment.getPendingVerifiedByOrderId(orderId).subscribe((data) => {
      if (!isNullOrUndefined(data)) {
        this.pendingVerified = data.pending;
      }
    });
  }

  getVerifiedPayment(orderId) {
    this.payment.getVerifiedByOrderId(orderId).subscribe((data) => {
      if (!isNullOrUndefined(data)) {
        this.verified = data.verified;
      }
    });
  }
}
