import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingPaymentService } from '@fuse/services/loading-payment.service';
import { OrderPaymentOption } from 'app/core/enum/order-payment-option.enum';
import { Title } from 'app/core/enum/title';
import { MyProfile } from 'app/core/models/my-profile.model';
import { ipay88PaymentBackendUrlApi, ipay88PaymentResponseUrlApi } from 'app/core/service/backend-api';
import { MyProfileService } from 'app/core/service/my-profile.service';
import { OrderService } from 'app/core/service/order.service';
import { PaymentService } from 'app/core/service/payment.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { environment } from 'environments/environment';
import { PaymentCommon } from '../payment-common-function';

@Component({
  selector: 'app-pay-epp',
  templateUrl: './pay-epp.component.html',
  styleUrls: ['./pay-epp.component.scss']
})
export class PayEppComponent implements OnInit {
  @Input() pendingVerified: any;
  @Input() verified: any;
  @Input() toPay: any;
  @Input() shipping: any;
  @Input() subTotal: any;
  @Input() total: any;
  @Input() remaining: any;
  @Input() currency: any;
  orderId: any;
  paymentOption: any;
  orderUuid: any;
  loading: boolean = true;
  title = Title.LEFT;
  allow_epp_payment: boolean = false;
  is_naep_order: boolean = false;
  order_id_tmm: string;
  // variable ipay88
  responseUrl = ipay88PaymentResponseUrlApi;
  backendUrl = ipay88PaymentBackendUrlApi;
  ipay88OtpUrl = environment.ipay88OtpUrl;

  one_time_merchantCode: string;
  paymentId: string;
  refNo: string;
  amount: string;
  prodDesc: string = '';
  userName: string = '';
  userEmail: string = '';
  userContact: string = '';
  remark: string ;
  lang: string ;
  signatureType: string =  "SHA256" ;
  signature: string;
  session: string;
  token: string;
  apiShare: boolean ;
  constructor( private router: Router,
    private activedRoute: ActivatedRoute,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private myProfileService: MyProfileService,
    public dialog: MatDialog,
    private paymentCommon: PaymentCommon,
    private loadingPaymentService: LoadingPaymentService
    ) { }

  ngOnInit(): void {
    this.activedRoute.queryParams.subscribe((param) => {
      this.orderId = param.id;
      this.orderUuid = param.uuid;
      this.session = param.session;
      this.getDataOrder(this.session);
    });

    // this.getOrderByUuid(this.orderUuid);
    // this.getRemainingPayment(this.orderId);
    // this.getPendingVerifiedPayment(this.orderId);
    // this.getVerifiedPayment(this.orderId);

  }
  
  getDataOrder(session){
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

  getOrderByUuid(uuid) { 
    return new Promise((resolve) => {
      this.orderService.getOrderByOrderUuid(uuid).subscribe((response) => { 
        this.renderDataOrder(response);
      });
    });
  }

  renderDataOrder(response){
    if (!CheckNullOrUndefinedOrEmpty(response)) {
      this.prodDesc = response.listName;
      this.shipping = response.shippingFee; 
      this.subTotal = response.subtotal;
      this.total = response.totalAmount;
      this.toPay = Number(this.total);
      this.currency = response.currency;
      this.order_id_tmm = response.order_id_tmm;
      this.allow_epp_payment = response.allow_epp_payment;
      this.is_naep_order = response.is_naep_order;
      if(!CheckNullOrUndefinedOrEmpty(this.session)){
        this.orderUuid = response?.uuid
        this.userName = response?.customerInformation?.firstName + " " + response?.customerInformation?.lastName;
        this.userContact = response?.customerInformation?.phoneDialCode + "-" + response?.customerInformation?.phoneNumber
        this.userEmail = response?.customerInformation?.email;
      }
      this.loading = false;
    }
  }

  checkPayment(payment: PaymentEppEnum){
    this.orderService.checkOrderHasBeenPaid(this.orderUuid).subscribe(data=>{
      if(data){
        switch (payment) {
          case PaymentEppEnum.PUBLIC_BANK:
            this.functionPublicBank();
            break;
          case PaymentEppEnum.MAY_BANK:
            this.functionMayBank();
            break;
          case PaymentEppEnum.HONG_LEONG_BANK:
            this.functionHongLeongBank();
            break;
          case PaymentEppEnum.CIMB:
            this.functionCIMBBank();
            break;
        }
      }else{
        this.paymentCommon.dialogPaymentHasBeenPaid();
      }
    })
  }

  nextToPayPublicBank() {
    this.checkPayment(PaymentEppEnum.PUBLIC_BANK)
  }

  nextToPayMayBank() {
    this.checkPayment(PaymentEppEnum.MAY_BANK)
  }

  nextToPayHongLeongBank() {
    this.checkPayment(PaymentEppEnum.HONG_LEONG_BANK)
  }

  nextToPayCIMBBank() {
    this.checkPayment(PaymentEppEnum.CIMB)
  }

  functionPublicBank(){
    //show loading
    this.loadingPaymentService.show();

    let formPayment = {
      "payment_amount": this.toPay,
      "payment_method": "CREDIT_CARD",
      "payment_gateway": "IPAY88",
      "verified": "",
      "paymentOption": OrderPaymentOption.EPP,
      "order_id": this.orderId,
      "is_singlePayment": '',
      "singlePaymentOrderLineGifts": '',
      "host": window.location.host,
      "bank": 'PublicBank',
      "session": this.session
    };
    this.paymentService.createPayment(formPayment , this.apiShare).subscribe(response => {

      if (response.code === 200) {
        this.refNo = response.data.uuid + '+' + String(this.order_id_tmm);
        this.amount = response.data.payment_amount.toFixed(2);
        this.signature = response.signature;
        this.one_time_merchantCode = response.ipay88MerchantCode;
        this.paymentId = '111';
        this.userName = response.data?.payment_request?.UserName || this.userName;
        this.userEmail = response.data?.payment_request?.UserEmail || this.userEmail;
        this.userContact = response.data?.payment_request?.UserContact || this.userContact;

        const form = document.getElementById('ipay88-form') as HTMLFormElement;
        form.elements['MerchantCode'].value = this.one_time_merchantCode;
        form.elements['PaymentId'].value = this.paymentId;
        form.elements['RefNo'].value = this.refNo;
        form.elements['Signature'].value = this.signature;
        form.elements['Amount'].value = this.amount;
        form.elements['UserName'].value = this.userName;
        form.elements['UserEmail'].value = this.userEmail;
        form.elements['UserContact'].value = this.userContact;
        form.submit();
      
      } else {
        //hide loading
        this.loadingPaymentService.hide();
      }
    });
  }

  functionMayBank(){
    //show loading
    this.loadingPaymentService.show();

    let formPayment = {
      "payment_amount": this.toPay,
      "payment_method": "CREDIT_CARD",
      "payment_gateway": "IPAY88",
      "verified": "",
      "paymentOption": OrderPaymentOption.EPP,
      "order_id": this.orderId,
      "is_singlePayment": '',
      "singlePaymentOrderLineGifts": '',
      "host": window.location.host,
      "bank": 'MayBank',
      "session": this.session
    };
    this.paymentService.createPayment(formPayment , this.apiShare).subscribe(response => {

      if (response.code === 200) {
        this.refNo = response.data.uuid + '+' + String(this.order_id_tmm);
        this.amount = response.data.payment_amount.toFixed(2);
        this.signature = response.signature;
        this.one_time_merchantCode = response.ipay88MerchantCode;
        this.paymentId = '112';
        this.userName = response.data?.payment_request?.UserName || this.userName;
        this.userEmail = response.data?.payment_request?.UserEmail || this.userEmail;
        this.userContact = response.data?.payment_request?.UserContact || this.userContact;

        const form = document.getElementById('ipay88-form') as HTMLFormElement;
        form.elements['MerchantCode'].value = this.one_time_merchantCode;
        form.elements['PaymentId'].value = this.paymentId;
        form.elements['RefNo'].value = this.refNo;
        form.elements['Signature'].value = this.signature;
        form.elements['Amount'].value = this.amount;
        form.elements['UserName'].value = this.userName;
        form.elements['UserEmail'].value = this.userEmail;
        form.elements['UserContact'].value = this.userContact;

        form.submit();

      } else {
        //hide loading
        this.loadingPaymentService.hide();
      }
    });
  }

  functionHongLeongBank(){
    //show loading
    this.loadingPaymentService.show();

    let formPayment = {
      "payment_amount": this.toPay,
      "payment_method": "CREDIT_CARD",
      "payment_gateway": "IPAY88",
      "verified": "",
      "paymentOption": OrderPaymentOption.EPP,
      "order_id": this.orderId,
      "is_singlePayment": '',
      "singlePaymentOrderLineGifts": '',
      "host": window.location.host,
      "bank": 'HongLeongBank',
      "session": this.session
    };
    this.paymentService.createPayment(formPayment , this.apiShare).subscribe(response => {

      if (response.code === 200) {
        this.refNo = response.data.uuid + '+' + String(this.order_id_tmm);
        this.amount = response.data.payment_amount.toFixed(2);
        this.signature = response.signature;
        this.one_time_merchantCode = response.ipay88MerchantCode;
        this.paymentId = '433';
        this.userName = response.data?.payment_request?.UserName || this.userName;
        this.userEmail = response.data?.payment_request?.UserEmail || this.userEmail;
        this.userContact = response.data?.payment_request?.UserContact || this.userContact;

        const form = document.getElementById('ipay88-form') as HTMLFormElement;
        form.elements['MerchantCode'].value = this.one_time_merchantCode;
        form.elements['PaymentId'].value = this.paymentId;
        form.elements['RefNo'].value = this.refNo;
        form.elements['Signature'].value = this.signature;
        form.elements['Amount'].value = this.amount;
        form.elements['UserName'].value = this.userName;
        form.elements['UserEmail'].value = this.userEmail;
        form.elements['UserContact'].value = this.userContact;
        
        form.submit();

      } else {
        //hide loading
        this.loadingPaymentService.hide();
      }
    });
  }

  functionCIMBBank() {
    //show loading
    this.loadingPaymentService.show();

    let formPayment = {
      "payment_amount": this.toPay,
      "payment_method": "CREDIT_CARD",
      "payment_gateway": "IPAY88",
      "verified": "",
      "paymentOption": OrderPaymentOption.EPP,
      "order_id": this.orderId,
      "is_singlePayment": '',
      "singlePaymentOrderLineGifts": '',
      "host": window.location.host,
      "bank": 'CIMBBank',
      "session": this.session
    };
    this.paymentService.createPayment(formPayment , this.apiShare).subscribe(response => {

      if (response.code === 200) {
        this.refNo = response.data.uuid + '+' + String(this.order_id_tmm);
        this.amount = response.data.payment_amount.toFixed(2);
        this.signature = response.signature;
        this.one_time_merchantCode = response.ipay88MerchantCode;
        this.paymentId = '174';
        this.userName = response.data?.payment_request?.UserName || this.userName;
        this.userEmail = response.data?.payment_request?.UserEmail || this.userEmail;
        this.userContact = response.data?.payment_request?.UserContact || this.userContact;

        const form = document.getElementById('ipay88-form') as HTMLFormElement;
        form.elements['MerchantCode'].value = this.one_time_merchantCode;
        form.elements['PaymentId'].value = this.paymentId;
        form.elements['RefNo'].value = this.refNo;
        form.elements['Signature'].value = this.signature;
        form.elements['Amount'].value = this.amount;
        form.elements['UserName'].value = this.userName;
        form.elements['UserEmail'].value = this.userEmail;
        form.elements['UserContact'].value = this.userContact;
        form.submit();

      } else {
        //hide loading
        this.loadingPaymentService.hide();
      }
    });
  }

  //Not use

  getRemainingPayment(orderId) {
    this.paymentService.getRemainingByOrderId(orderId).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.remaining = data.remaining;
        this.toPay = this.remaining;
      }
    });
  }

  getPendingVerifiedPayment(orderId) {
    this.paymentService.getPendingVerifiedByOrderId(orderId).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.pendingVerified = data.pending;
      }
    });
  }

  getVerifiedPayment(orderId) {
    this.paymentService.getVerifiedByOrderId(orderId).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.verified = data.verified;
      }
    });
  }
}


export enum PaymentEppEnum{
  CIMB = "CIMB",
  MAY_BANK = "MAY_BANK",
  PUBLIC_BANK = "PUBLIC_BANK",
  HONG_LEONG_BANK = "HONG_LEONG_BANK"
}