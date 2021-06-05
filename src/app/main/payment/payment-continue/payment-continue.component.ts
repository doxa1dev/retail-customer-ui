import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from '../../../core/service/order.service';
import { isNullOrUndefined } from 'util';
import { MyProfileService } from '../../../core/service/my-profile.service';
import { MyProfile } from 'app/core/models/my-profile.model';
import { environment } from 'environments/environment';
import { PaymentService } from '../../../core/service/payment.service';
import { ipay88RecurringPaymentResponseApi, ipay88RecurringSubscribeResponseApi } from '../../../core/service/backend-api';
import { Title } from 'app/core/enum/title';
import { PaymentCommon } from "../payment-common-function";
import { CheckNullOrUndefinedOrEmpty } from "app/core/utils/common-function";
import { OrderPaymentOption } from "app/core/enum/order-payment-option.enum";

@Component({
  selector: "payment-continue",
  templateUrl: "./payment-continue.component.html",
  styleUrls: ["./payment-continue.component.scss"],
})
export class PaymentContinueComponent implements OnInit {
  @Input() toPay: any;
  @Input() shipping: any;
  @Input() subTotal: any;
  @Input() total: any;
  @Input() remaining: any;
  @Input() currency: any;
  orderId: any;
  orderUuid: any;
  valueRadio: any;
  @Input() pendingVerified: any;
  @Input() verified: any;
  orderIDContinue: any;

  paymentOption: any;
  title = Title.LEFT_LINK;
  session: string;
  apiShare: boolean;
  constructor(private activedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private paymentCommon: PaymentCommon,
    private paymentService: PaymentService) { }

  ngOnInit(): void {

    this.activedRoute.queryParams.subscribe((param) => {
      this.orderId = param.orderId;
      this.orderUuid = param.uuid;
      this.session = param.session;
      this.getDataOrder(this.session);
    });

    // this.getOrderCurrency(this.orderId);
    // this.getOrder(this.orderId);
    // this.getOrderByUuid(this.orderUuid);
    // this.getPendingVerifiedPayment(this.orderId);
    // this.getVerifiedPayment(this.orderId);
  }

  getDataOrder(session){
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
      // this.verified = this.verified || 0 ;
      // this.pendingVerified = this.pendingVerified || 0;
      this.shipping = respone.shippingFee;
      this.subTotal = respone.subtotal;
      this.total = respone.totalAmount;
      this.currency = respone.currency;
      this.paymentOption = respone.paymentOption;
      this.toPay = (this.paymentOption == OrderPaymentOption.DEPOSIT) ? 0 : localStorage.getItem('toPay');
      this.remaining = (this.paymentOption == OrderPaymentOption.DEPOSIT) ? (this.total - respone.deposit_amount) : localStorage.getItem('remaining');
      this.getPendingVerifiedPayment(respone.id);
      this.getVerifiedPayment(respone.id);
    }
  }

  getOrderByUuid(uuid) {
    return new Promise((resolve) => {
      this.orderService.getOrderByOrderUuid(uuid).subscribe((respone) => {
        this.renderData(respone);
      });
    });
  }

  getPendingVerifiedPayment(orderId) {
    this.paymentService.getPendingVerifiedByOrderId(orderId , this.apiShare ).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.pendingVerified = data.pending;
      }
    });
  }

  getVerifiedPayment(orderId) {
    this.paymentService.getVerifiedByOrderId(orderId , this.apiShare).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.verified = data.verified;
      }
    });
  }

  nextToPaymentOption() {
    let orderId = this.orderId;
    this.router.navigate(["/payment-options"], {
      queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? {
        id: orderId,
        uuid: this.orderUuid
      } : {session: this.session},
    });
  }


  nextToConfirm() {

    this.router.navigate(["/installment-confirm"], {
      queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? {
        id: this.orderId,
        uuid: this.orderUuid
      }: {session: this.session},
    });
  }


  // testRecurringPayment(){

  //   const form = document.getElementById('form-test') as HTMLFormElement;
  //   console.log(form);
  //   form.submit(); 
  // }


  // backToOrderDetail() {
  //   this.router.navigate(["/order-detail/" + this.orderId]);
  // }
}
