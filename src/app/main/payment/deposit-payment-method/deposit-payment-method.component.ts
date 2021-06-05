import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MyProfileService } from '../../../core/service/my-profile.service';
import { MyProfile } from 'app/core/models/my-profile.model';
import { PaymentService } from '../../../core/service/payment.service';
import { GenerateSignatureDto } from '../../../core/models/payment-signature.model';
import { FormGroup } from '@angular/forms';
import * as ScriptJS from 'scriptjs';
import * as moment from 'moment';
import * as shajs from 'sha.js';
import { wireCardPaymentResponseApi } from 'app/core/service/backend-api';
import { ipay88PaymentResponseUrlApi, ipay88PaymentBackendUrlApi } from '../../../core/service/backend-api';
import { OrderService } from '../../../core/service/order.service';
import { isNullOrUndefined } from 'util';
import { OrderPaymentOption } from 'app/core/enum/order-payment-option.enum';
import { environment } from 'environments/environment';
import { Title } from 'app/core/enum/title';
import { CheckNullOrUndefinedOrEmpty } from "app/core/utils/common-function";
import { CommonDialogComponent } from "app/main/common-dialog/common-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { PaymentCommon } from "../payment-common-function";
import { PaymentEnum } from "../select-payment/select-payment.component";
import { LoadingPaymentService } from "@fuse/services/loading-payment.service";

declare var WPP;
@Component({
  selector: 'app-deposit-payment-method',
  templateUrl: './deposit-payment-method.component.html',
  styleUrls: ['./deposit-payment-method.component.scss']
})
export class DepositPaymentMethodComponent implements OnInit {
  pendingVerified: any = 0;
  verified: any = 0;
  toPay: any;
  shipping: any;
  subTotal: any;
  total: any;
  remaining: any;
  payPatiall: number = 0;
  valueToPay: any;
  orderId: any;
  order_id_tmm: number;

  //ipay88 one-time payment fields
  one_time_merchantCode: any;
  paymentId = "2";
  refNo: any;
  amount: any;
  @Input() currency: any;
  prodDesc : string;
  userName: any;
  userEmail: any;
  userContact: any;
  remark: any;
  lang: any;
  signatureType = "SHA256";
  signature: any;
  responseUrl = ipay88PaymentResponseUrlApi;
  backendUrl = ipay88PaymentBackendUrlApi;

  //wirecard payment field
  requestId: any;

  //ipay88- fpx
  fpx_merchantCode: any;
  fpx_paymentId = "16";


  //order payment option
  paymentOption: any;
  orderData: any;
  title = Title.LEFT;

  entity_id: any;
  orderUuid: any;

  ipay88OtpUrl = environment.ipay88OtpUrl;
  ipay88FpxUrl = environment.ipay88FpxUrl;

  loading: boolean = true;
  checkLinkShare: boolean;
  session: string;
  token: string;
  fixedDeposit: any;
  apiShare: boolean;
  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private myProfileService: MyProfileService,
    private paymentService: PaymentService,
    public dialog: MatDialog,
    private orderService: OrderService,
    private paymentCommon: PaymentCommon,
    private loadingPaymentService: LoadingPaymentService
    ) { }

  ngOnInit(): void {
    this.activedRoute.queryParams.subscribe((param) => {
      this.orderId = param.id;
      this.paymentOption = OrderPaymentOption.DEPOSIT;
      this.orderUuid = param.uuid;
      this.session = param.session;
      this.getDataOrder(this.session);
    });
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
      this.myProfileService.getProfile().subscribe(response => {

        if (response.code === 200) {

          const myProfile: MyProfile = response.userProfileData;

          if (myProfile.last_name) {
            this.userName = myProfile.firt_name + " " + myProfile.last_name;
          }
          else {
            this.userName = myProfile.firt_name;
          }
          this.userEmail = myProfile.email;
          this.userContact = myProfile.phone_dial_code + '-' + myProfile.phone_number;
        }
      });     
    }
  }

  renderShareOrder(data){
    if(data == "expired"){
      this.paymentCommon.dialogExpired();
    }else{
      this.renderDataOrder(data);
    }
  }

  renderDataOrder(response){
    if (!CheckNullOrUndefinedOrEmpty(response)) {
      this.prodDesc = response.listName;
      this.shipping = response.shippingFee;
      this.subTotal = response.subtotal;
      this.total = response.totalAmount;
      this.currency = response.currency;
      this.order_id_tmm = response.order_id_tmm;
      this.orderId = response.id;
      // this.paymentOption = response.paymentOption;
      this.fixedDeposit = response.deposit_amount;
      this.toPay =  this.fixedDeposit;
      this.remaining = this.total - this.toPay;
      // localStorage.setItem('toPay', this.toPay);
      // localStorage.setItem('remaining', this.remaining);
      this.loading = false;
      if(!CheckNullOrUndefinedOrEmpty(this.session)){
        this.orderUuid = response.uuid;
        this.userName = response.customerInformation?.firstName + " " + response?.customerInformation?.lastName;
        this.userContact = response.customerInformation?.phoneDialCode + "-" + response?.customerInformation?.phoneNumber;
        this.userEmail = response.customerInformation?.email;
      }
    }
  }

  getOrderByUuid(uuid) {
    return new Promise((resolve) => {
      this.orderService.getOrderByOrderUuid(uuid).subscribe((response) => {
        this.renderDataOrder(response)
      });
    });
  }

  
  payByFPX() {
    this.checkPayment(PaymentEnum.FPX)
  }

  payByIpay88() {
    this.checkPayment(PaymentEnum.IPAY88)
  }
  
  nextToPayOffice() {
    this.checkPayment(PaymentEnum.OFFICE)
  }

  checkPayment(payment: PaymentEnum){
    this.orderService.checkOrderHasBeenPaid(this.orderUuid).subscribe(data=>{
      if(data){
        switch (payment) {
          case PaymentEnum.OFFICE:
            this.functionPayAtOffice();
            break;
          case PaymentEnum.IPAY88:
            this.functionPayByIpay88();
            break;
          case PaymentEnum.FPX:
            this.functionPayByFPX();
            break;
        }
      }else{
        this.paymentCommon.dialogPaymentHasBeenPaid();
      }
    })
  }

  functionPayByFPX(){
    //show loading
    this.loadingPaymentService.show();

    let formPayment = {
      "payment_amount": this.toPay,
      "payment_method": "ONLINE_BANKING",
      "payment_gateway": "IPAY88",
      "verified": "",
      "paymentOption": this.paymentOption,
      "order_id": this.orderId,
      "host": window.location.host,
      "session": this.session
    };

    this.paymentService.createPayment(formPayment , this.apiShare).subscribe(response => {

      if (response.code === 200) {
        this.refNo = response.data.uuid + '+' + String(this.order_id_tmm);
        this.amount = (!CheckNullOrUndefinedOrEmpty(response.data) && !CheckNullOrUndefinedOrEmpty(response.data.payment_request) ) ? response.data.payment_request.Amount : response.data.payment_amount.toFixed(2);
        this.signature = response.signature;
        this.fpx_merchantCode = response.ipay88MerchantCode;
        this.userName = response.data?.payment_request?.UserName || this.userName;
        this.userEmail = response.data?.payment_request?.UserEmail || this.userEmail;
        this.userContact = response.data?.payment_request?.UserContact || this.userContact;

        const form = document.getElementById('fpx-form') as HTMLFormElement;
        form.elements['MerchantCode'].value = this.fpx_merchantCode;
        form.elements['RefNo'].value = this.refNo;
        form.elements['Signature'].value = this.signature;
        form.elements['Amount'].value = this.amount;
        form.elements['UserName'].value = this.userName;
        form.elements['UserEmail'].value = this.userEmail;
        form.elements['UserContact'].value = this.userContact;
        // form.elements['Currency'].value = this.currency;
        // console.log(form);
        form.submit();

      } else {
        //hide loading
        this.loadingPaymentService.hide();
      }
    });
  }

  functionPayByIpay88(){
    //show loading
    this.loadingPaymentService.show();

    let formPayment = {
      "payment_amount": this.toPay,
      "payment_method": "CREDIT_CARD",
      "payment_gateway": "IPAY88",
      "verified": "",
      "paymentOption": this.paymentOption,
      "order_id": this.orderId,
      "host": window.location.host,
      "session": this.session
    };

    this.paymentService.createPayment(formPayment, this.apiShare).subscribe(response => {

      if (response.code === 200) {
        this.refNo = response.data.uuid + '+' + String(this.order_id_tmm);
        // this.amount = response.data.payment_amount.toFixed(2);
        this.amount = (!CheckNullOrUndefinedOrEmpty(response.data) && !CheckNullOrUndefinedOrEmpty(response.data.payment_request) ) ? response.data.payment_request.Amount : response.data.payment_amount.toFixed(2);
        this.signature = response.signature;
        this.one_time_merchantCode = response.ipay88MerchantCode;
        this.userName = response.data?.payment_request?.UserName || this.userName;
        this.userEmail = response.data?.payment_request?.UserEmail || this.userEmail;
        this.userContact = response.data?.payment_request?.UserContact || this.userContact;
 
        const form = document.getElementById('ipay88-form') as HTMLFormElement;
        form.elements['MerchantCode'].value = this.one_time_merchantCode;
        form.elements['RefNo'].value = this.refNo;
        form.elements['Signature'].value = this.signature;
        form.elements['Amount'].value = this.amount;
        form.elements['UserName'].value = this.userName;
        form.elements['UserEmail'].value = this.userEmail;
        form.elements['UserContact'].value = this.userContact;
        // console.log(form)
        form.submit();
      
      } else {
        //hide loading
        this.loadingPaymentService.hide();
      }
    });
  }

  functionPayAtOffice(){   
    let orderId = this.orderId;
    let methodRadio = "OFFICE";
    let paymentOption = this.paymentOption;
    let uuid = this.orderUuid;

    this.router.navigate(["/pay-at-office"], {
      queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? {
        methodRadio: methodRadio,
        orderId: orderId,
        paymentOption: paymentOption,
        uuid: uuid
      }: {session: this.session},
    });
  }

  payByWirecard() {

    let formPayment = {
      "payment_amount": this.toPay,
      "payment_method": "CREDIT_CARD",
      "payment_gateway": "WIRECARD",
      "verified": "",
      "paymentOption": this.paymentOption,
      "order_id": this.orderId,
      "host": window.location.host
    };

    this.paymentService.createPayment(formPayment).subscribe(response => {
      // console.log(response);

      if (response.code === 200) {

        let wirecardRequestBody = {
          "payment_amount": response.data.payment_amount,
          "currency": this.currency,
          "request_id": response.data.uuid + '+' + String(this.orderId),
          "redirect_url": wireCardPaymentResponseApi,
          "order_id": this.orderId
        };

        this.paymentService.getWirecardPaymentRedirectUrl(wirecardRequestBody).subscribe(response => {
          // console.log(response);

          if (response['errors'] == null) {
            const redirectURL = response['payment-redirect-url'];

            ScriptJS.get(environment.wireCardOtpUrl, () => {
              WPP.hostedPayUrl(redirectURL);
            });
          }
        });
      }
    });
  }


  backToRecurringPaymentPage() {
    this.router.navigate(['../recurring-payment'], { queryParams: { id: this.orderId, paymentOption: OrderPaymentOption.DEPOSIT } });
  }

  nextToPayByCheque() {
    let orderId = this.orderId;
    let methodRadio = "TT";
    let paymentOption = this.paymentOption;

    this.router.navigate(["/pay-by-cheque"], {
      queryParams: {

        methodRadio: methodRadio,
        orderId: orderId,
        paymentOption: paymentOption,
        uuid: this.orderUuid

      },
    });
  }

  checkDisplayPayAtOffice() {

    let payAtOffice = environment.paymentMethodList.find(element => element.name === 'PAY_AT_OFFICE');
    if (payAtOffice) {
      return true;
    }
    else return false;
  }

  checkDisplayPayOnLineTT() {

    let payByTT = environment.paymentMethodList.find(element => element.name === 'PAY_ONLINE_TT');
    if (payByTT) {
      return true;
    }
    else return false;
  }

  checkDisplayIpay88OTP() {
    let ipay88OTP = environment.paymentMethodList.find(element => element.name === 'PAY_BY_IPAY88_OTP');
    if (ipay88OTP) {
      return true;
    }
    else return false;
  }

  checkDisplayFPX() {
    let ipay88FPX = environment.paymentMethodList.find(element => element.name === 'PAY_BY_IPAY88_FPX');
    if (ipay88FPX) {
      return true; 
    }
    else return false;
  }

  checkDisplayWireCardOTP() {
    let wirecardOTP = environment.paymentMethodList.find(element => element.name === 'PAY_BY_WIRECARD_OTP');
    if (wirecardOTP) {
      return true;
    }
    else return false;
  }

  //Not use

  getPendingVerifiedPayment(orderId) {
    this.paymentService
      .getPendingVerifiedByOrderId(orderId)
      .subscribe((data) => {
        if (!isNullOrUndefined(data)) {
          this.pendingVerified = data.pending;
        }
      });
  }

  getVerifiedPayment(orderId) {
    this.paymentService.getVerifiedByOrderId(orderId).subscribe((data) => {
      if (!isNullOrUndefined(data)) {
        this.verified = data.verified;
      }
    });
  }

}
