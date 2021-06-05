
import { Component, OnInit, Input } from '@angular/core';
import { ipay88RecurringPaymentResponseApi, ipay88RecurringSubscribeResponseApi } from 'app/core/service/backend-api';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'app/core/service/order.service';
import { MyProfileService } from 'app/core/service/my-profile.service';
import { PaymentService } from 'app/core/service/payment.service';
import { MyProfile } from 'app/core/models/my-profile.model';
import { isNullOrUndefined } from 'util';
import { environment } from 'environments/environment';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PaymentCommon } from '../payment-common-function';

@Component({
  selector: 'app-installment-confirm',
  templateUrl: './installment-confirm.component.html',
  styleUrls: ['./installment-confirm.component.scss']
})
export class InstallmentConfirmComponent implements OnInit {

  @Input() toPay: any;
  @Input() shipping: any;
  @Input() subTotal: any;
  @Input() total: any;
  @Input() remaining: any;
  @Input() currency: any;
  @Input() pendingVerified: any;
  @Input() verified: any;

  orderData: any;
  orderId: any;
  paymentOption: any;
  orderUuid: any;

  //intallment
  installmentData: any;
  displayFrequency: any;
  displayNumberOfPayments: any;
  installmentAmount: any;
  paymentAmountForEachInstallment: any;



  //recurring payment fields

  merchant_code: any;
  ref_No: any;
  first_payment_date: any;
  amount: any;
  number_of_payments: number;
  frequency: number;
  desc = 'Thermomix';
  cc_holder_ic = 'TMM2020';
  cc_holder_email: any;
  cc_holder_phone: any;
  subscriber_name: any;
  subscriber_email: any;
  subscriber_phone: any;
  subscriber_add1: any;
  subscriber_add2: any;
  subscriber_city: any;
  subscriber_state: any;
  subscriber_zip: any;
  subscriber_country: any;
  backend_url = ipay88RecurringPaymentResponseApi;
  signature: any;
  response_url = ipay88RecurringSubscribeResponseApi;



  ipay88ReccuringUrl = environment.ipay88RecurringUrl;
  session: string;
  token: string;
  checkLinkShare: boolean;
  fixedDeposit: number;
  apiShare: boolean;
  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private myProfileService: MyProfileService,
    public dialog: MatDialog,
    private paymentCommon: PaymentCommon,
    private paymentService: PaymentService) { }



  ngOnInit(): void {
    this.activedRoute.queryParams.subscribe((param) => {
      this.orderId = param.id;
      this.orderUuid = param.uuid;
      this.session = param.session;
      this.getDataOrder(this.session);
    });

    // this.getOrderByUuid(this.orderUuid);
    // this.getOrder(this.orderId);
    // this.getRemainingPayment(this.orderId);

  }

  getDataOrder(session){
    this.checkLinkShare = this.paymentCommon.checkLinkShare(session);
    this.apiShare = this.paymentCommon.isApiShare(session);
    if(this.paymentCommon.shareForNotCustomer(session)){
      this.orderService.getDateShareOrder(session).subscribe(data=>{
        this.renderShareOrder(data)
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
      this.paymentCommon.dialogExpired()
    }else{
      this.orderUuid = data.uuid
      this.renderDataOrder(data);
    }
  }

  getOrderByUuid(uuid) {
    return new Promise((resolve) => {
      this.orderService.getOrderByOrderUuid(uuid).subscribe((response) => {
        this.renderDataOrder(response)
      });
    });
  }

  renderDataOrder(response){
    if (!CheckNullOrUndefinedOrEmpty(response)) {
      this.shipping = response.shippingFee;
      this.subTotal = response.subtotal;
      this.total = response.totalAmount;
      this.currency = response.currency;
      this.paymentOption = response.paymentOption;
      this.fixedDeposit = response.deposit_amount;
      this.installmentAmount = (this.total - this.fixedDeposit);
      this.toPay = 0;
      this.remaining = this.installmentAmount;
      this.orderId = response.id;
      this.getPendingVerifiedPayment(response.id);
      this.getVerifiedPayment(response.id);
      this.getInstallmentByOrderId(response.id);
      if(CheckNullOrUndefinedOrEmpty(this.session)){
        this.myProfileService.getProfile().subscribe(response => {
          if (response.code === 200) {
            const myProfile: MyProfile = response.userProfileData;
            this.cc_holder_email =    myProfile.email;
            this.cc_holder_phone =    myProfile.phone_dial_code + '-' + myProfile.phone_number;
            this.subscriber_email =   myProfile.email;
            this.subscriber_phone =   myProfile.phone_dial_code + '-' + myProfile.phone_number;
            this.subscriber_name =    !myProfile.last_name ? myProfile.firt_name : myProfile.firt_name + " " + myProfile.last_name;
            this.subscriber_add1 =    !myProfile.address_line1 ? "TMM headquarter" : myProfile.address_line1;
            this.subscriber_add2 =    !myProfile.address_line2 ? '' : myProfile.address_line2;
            this.subscriber_country = !myProfile.country_code ? 'MY' : myProfile.country_code;
            this.subscriber_city =    !myProfile.state_code ? 'Selangor' : environment.countryCodeToStates[this.subscriber_country][myProfile.state_code];
            this.subscriber_state =   !myProfile.state_code ? 'Selangor' : environment.countryCodeToStates[this.subscriber_country][myProfile.state_code];
            this.subscriber_zip =     !myProfile.postal_code ? '79250' : myProfile.postal_code;
          }
        });
      }else{
        this.cc_holder_email =    response.customerInformation?.email;
        this.cc_holder_phone =    response.customerInformation?.phoneDialCode + '-' + response.customerInformation?.phoneNumber;
        this.subscriber_email =   response.customerInformation?.email;
        this.subscriber_phone =   response.customerInformation?.phoneDialCode + '-' + response.customerInformation?.phoneNumber;
        this.subscriber_name =    CheckNullOrUndefinedOrEmpty(response.customerInformation?.lastName) ? response.customerInformation?.firstName : response.customerInformation?.firstName + " " + response.customerInformation?.lastName;
        this.subscriber_add1 =    CheckNullOrUndefinedOrEmpty(response.customerInformation?.address_line1) ? "TMM headquarter" : response.customerInformation?.address_line1;
        this.subscriber_add2 =    CheckNullOrUndefinedOrEmpty(response.customerInformation?.address_line2) ? '' : response.customerInformation?.address_line2;
        this.subscriber_country = CheckNullOrUndefinedOrEmpty(response.customerInformation?.country_code) ? 'MY' : response.customerInformation?.country_code;
        this.subscriber_city =    CheckNullOrUndefinedOrEmpty(response.customerInformation?.state_code) ? 'Selangor' : environment.countryCodeToStates[this.subscriber_country][response.customerInformation?.state_code];
        this.subscriber_state =   CheckNullOrUndefinedOrEmpty(response.customerInformation?.state_code) ? 'Selangor' : environment.countryCodeToStates[this.subscriber_country][response.customerInformation?.state_code];
        this.subscriber_zip =     CheckNullOrUndefinedOrEmpty(response.customerInformation?.postal_code) ? '79250' : response.customerInformation?.postal_code;
      }
    }
  }

  getInstallmentByOrderId(orderId) {
    this.paymentService.getInstallmentByOrderId(orderId , this.apiShare).subscribe((response) => {
      if (response.code === 200 && !CheckNullOrUndefinedOrEmpty(response.data)) {
        this.installmentData = response.data;
        this.displayFrequency = this.installmentData.frequency;
        this.displayNumberOfPayments = this.installmentData.number_of_payments;
        this.installmentAmount = this.installmentData.installment_amount;
        this.paymentAmountForEachInstallment = Number(this.installmentAmount) / Number(this.displayNumberOfPayments);
      }
    });
  }

  nextToIpay88RecurringPayment() {

    this.paymentService.subscribeRecurringPayment(this.orderId , this.apiShare).subscribe(res => {
      if (res.code === 200) {
        this.amount = res.data.subscription_request['recurringAmountForEachTime'];
        this.ref_No = res.data.subscription_request['refNo'];
        this.frequency = Number(res.data.subscription_request['frequency']);
        this.number_of_payments = res.data.subscription_request['number_of_payments'];
        this.first_payment_date = res.data.subscription_request['firstPaymentDate'];
        this.signature = res.data.subscription_request['signature'];
        this.merchant_code = res.iPay88MerchantCode;
        this.desc = res.desc;

        const form = document.getElementById('ipay88-recurring-form') as HTMLFormElement;
        form.elements['Desc'].value = this.desc;
        form.elements['Amount'].value = this.amount;
        form.elements['RefNo'].value = this.ref_No;
        form.elements['Frequency'].value = this.frequency;
        form.elements['NumberofPayments'].value = this.number_of_payments;
        form.elements['FirstPaymentDate'].value = this.first_payment_date;
        form.elements['Signature'].value = this.signature;

        form.submit();
      }
    });
  }


  backToOrderDetail() {
    this.router.navigate(["/order-detail" + "/" + this.orderId]);
  }

  cancel() {
    this.router.navigate(["/order-detail" + "/" + this.orderId]);
  }

  getPendingVerifiedPayment(orderId) {
    this.paymentService
      .getPendingVerifiedByOrderId(orderId , this.apiShare)
      .subscribe((data) => {
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

  //Not use

  // getOrder(orderId) {
  //   return new Promise((resolve) => {
  //     this.orderService.getOrderByOrderId(orderId).subscribe((respone) => {
  //       if (!isNullOrUndefined(respone)) {
  //         this.orderData = respone;
  //         this.shipping = this.orderData.shippingFee;
  //         this.subTotal = this.orderData.subtotal;
  //         this.total = this.orderData.totalAmount;
  //         this.currency = this.orderData.currency;
  //         this.toPay = 0;
  //       }
  //     });
  //   });
  // }

  //  getRemainingPayment(orderId) {
  //   this.paymentService.getRemainingByOrderId(orderId).subscribe((data) => {
  //     if (!isNullOrUndefined(data)) {
  //       this.remaining = data.remaining;
  //     }
  //   });
  // }


}
