import { CustomerInformation, DeliveryAddress } from 'app/core/service/order.service';
import { Component, OnInit, Input, Output } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MyProfileService } from '../../../core/service/my-profile.service';
import { MyProfile } from 'app/core/models/my-profile.model';
import { PaymentService } from '../../../core/service/payment.service';
import { GenerateSignatureDto } from '../../../core/models/payment-signature.model';
import { FormGroup } from '@angular/forms';
import * as ScriptJS from 'scriptjs';
import * as moment from 'moment';
import * as shajs from 'sha.js';
import * as crypto from 'crypto-browserify';
import { wireCardPaymentResponseApi } from 'app/core/service/backend-api';
import { ipay88PaymentResponseUrlApi, ipay88PaymentBackendUrlApi, mpgsResponseApi , wireCardIppResponseApi} from '../../../core/service/backend-api';
import { OrderService } from '../../../core/service/order.service';
import { isNullOrUndefined } from 'util';
import { environment } from 'environments/environment';
import { Location } from '@angular/common';
import { Title } from 'app/core/enum/title';
import { OrderPaymentOption } from 'app/core/enum/order-payment-option.enum';
import { Tracing } from "trace_events";
import Swal from 'sweetalert2';
import { CheckNullOrUndefinedOrEmpty } from "app/core/utils/common-function";
import { v4 as uuid } from 'uuid';
import { MatDialog } from "@angular/material/dialog";
import { CommonDialogComponent } from "app/main/common-dialog/common-dialog.component";
import { MessageService } from "primeng/api";
import { Product } from "app/core/models/product.model";
import { PaymentCommon } from '../payment-common-function';
import { truncate } from 'fs';
import { DialogConfirmComponent } from 'app/main/common-component/dialog-confirm/dialog-confirm.component';
import { LoadingPaymentService } from '@fuse/services/loading-payment.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';


declare var WPP;
declare var Checkout;
declare let ElasticPaymentPage;

@Component({
  selector: "app-select-payment",
  templateUrl: "./select-payment.component.html",
  styleUrls: ["./select-payment.component.scss"],
  providers: [MessageService]
})
export class SelectPaymentComponent implements OnInit {
  @Input() pendingVerified: any;
  @Input() verified: any;
  @Input() toPay: any;
  @Input() shipping: any;
  @Input() subTotal: any;
  @Input() total: any;
  @Input() remaining: any;
  payPatiall: number = 0;
  valueToPay: any;
  orderId: any;
  orderUuid: any;
  toPayPartially: any;
  toPayFull: any;
  valueRadio: any;
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

  entity_id: any;
  isMultiplePayment: any;


  //order payment option
  paymentOption: any;
  title = Title.LEFT;

  //2c2p
  qrImg: string;
  checkQr: boolean;
  payment_option_2c2p;
  ipp_2c2p
  request_3ds : string;
  user_defined_1 : string;
  result_url_2: string;


  hasOnlineBankingGift2: boolean;
  hasValidSinglePaymentGift: boolean;
  hasSinglePaymentGift : boolean = false;
  ipay88OtpUrl = environment.ipay88OtpUrl;
  ipay88FpxUrl = environment.ipay88FpxUrl;
  entity = environment.entity;
  loading: boolean = true;

  //2c2p URL
  SG2c2pUrl = environment.SG2c2pUrl;
  version: string;
  merchant_id: string;
  currency2c2p: number;
  result_url_1: string;
  hash_value: string;
  payment_description: string;
  order_id_2c2p: string;
  amount2c2p: string;
  qrType : string;
  qrOption : string;
  //-------------------------

  checkOffice = environment.checkOffice;
  formPaymentOption: any;
  allow_epp_payment : boolean;
  paymentGifts;

  order_id_tmm: string;
  is_naep_order : boolean = false;
  isRedemptionPrice: boolean = false;
  isCheckSdOnly: boolean = false;

  shareLinkToken: string;
  checkLinkShare: boolean = false;
  token: string;
  apiShare: boolean ;
  panelOpenStateSummary = false;
  is_buying_for_customer: boolean;
  is_show_confirm_dialog : boolean = false;
  dataOrderSummary : any;
  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private myProfileService: MyProfileService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private paymentCommon: PaymentCommon,
    private loadingPaymentService: LoadingPaymentService
  ) { }

  ngOnInit(): void {
    this.activedRoute.queryParams.subscribe((param) => {
      this.paymentOption = OrderPaymentOption.FULL;
      this.orderUuid = param.uuid;
      this.shareLinkToken = param.session;
      this.getDataShare(this.shareLinkToken);
    });
     
    localStorage.removeItem('formOrderLineBankTransferGiftArr');
    this.hasValidSinglePaymentGift = localStorage.getItem('hasValidSinglePaymentGift') === 'true';
    if(this.entity === 'MY'){
      this.hasSinglePaymentGift = localStorage.getItem('hasSinglePaymentGift') === 'true';

    }
    if (localStorage.getItem('formOrderLineSinglePaymentGiftArr')) {
      this.paymentGifts = JSON.parse(localStorage.getItem('formOrderLineSinglePaymentGiftArr')).formOrderLineSinglePaymentGiftArr;
    }
  }


  getDataShare(session){
    // this.title = CheckNullOrUndefinedOrEmpty(session) ? Title.LEFT_LINK : Title.DOT;
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

  getOrderByUuid(uuid) { 
    return new Promise((resolve) => {
      this.orderService.getOrderByOrderUuid(uuid).subscribe((response) => {
        // this.dataOrderSummary = response.dataSummary ;
        this.is_show_confirm_dialog = false;
        this.renderData(response);
      });
    });
  }

  add(){
    this.messageService.add({ summary: 'Link copied to clipboard.', severity: 'success', life: 4000});
  }

  renderShareOrder(data){
    if(data == "expired"){
      this.paymentCommon.dialogExpired();
    }else{
      this.is_show_confirm_dialog = true;
      this.renderData(data);
    }
  }

  renderData(response){
    if (!CheckNullOrUndefinedOrEmpty(response)) {
      this.dataOrderSummary = response 
      this.prodDesc = response.listName;
      this.shipping = response.shippingFee; 
      this.subTotal = response.subtotal;
      this.total = response.totalAmount;
      this.toPay = Number(this.total);
      this.currency = response.currency;
      this.order_id_tmm = response.order_id_tmm;
      this.allow_epp_payment = response.allow_epp_payment;
      this.is_naep_order = response.is_naep_order;
      this.isRedemptionPrice = response.isRedemptionPrice;
      this.is_buying_for_customer = response.is_buying_for_customer || false;
      this.orderId = response.id;
      this.formPaymentOption = {
        order_id: this.orderId,
        payment_option: "" 
      };
      if(response.singlePaymentGiftProducts.length > 0 && this.entity !== 'MY'){
        this.hasSinglePaymentGift = (response.singlePaymentGiftProducts.length > 0) ? true : false;
      }

      this.isCheckSdOnly = response.isCheckSdOnly;
      if(!CheckNullOrUndefinedOrEmpty(this.shareLinkToken)){
        this.orderUuid = response?.uuid
        this.userName = response?.customerInformation?.firstName + " " + response?.customerInformation?.lastName;
        this.userContact = response?.customerInformation?.phoneDialCode + "-" + response?.customerInformation?.phoneNumber
        this.userEmail = response?.customerInformation?.email;
      }
      this.loading = false;
      if(this.is_show_confirm_dialog && this.entity != 'MY')
      {
        this.dialogConfirm()
      }
    }
  }

  
  checkPayment(payment: PaymentEnum){
    this.orderService.checkOrderHasBeenPaid(this.orderUuid).subscribe(data=>{
      if(data){
        switch (payment) {
          case PaymentEnum.OFFICE:
            this.functionPayAtOffice();
            break;
          //SG
          case PaymentEnum.MPGS:
            this.functionPayByMPGS();
            break;
          case PaymentEnum.PAYNOW:
            this.functionPayByPayNow();
            break;
          case PaymentEnum.EPP_2C2P:
            this.functionPayByEpp2C2P();
            break;
          case PaymentEnum.DBS:
            this.functionPayByDBS();
            break;
          case PaymentEnum.EPP_OFFICE:
            this.functionPayEppOfficeSG();
            break;
          //MY
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
  

  payByFPX() {
    this.checkPayment(PaymentEnum.FPX);
  }

  payByIpay88() {
    this.checkPayment(PaymentEnum.IPAY88)
  }

  payByMpgs() {
    this.checkPayment(PaymentEnum.MPGS)
  }

  nextToPayOffice() {
    this.checkPayment(PaymentEnum.OFFICE)
  }

  nextToPayOfficeEPP() {
    this.checkPayment(PaymentEnum.EPP_OFFICE);
  }

  nextToPayByIpp(){
    this.checkPayment(PaymentEnum.DBS);
  }

  nextToPayBy2c2p(){
    this.checkPayment(PaymentEnum.EPP_2C2P)
  }

  sg2c2pPayNow(){
    this.checkPayment(PaymentEnum.PAYNOW)
  }

  checkDisplayPayAtOffice() {
    let payAtOffice = environment.paymentMethodList.find(element => element.name === 'PAY_AT_OFFICE');
    if (payAtOffice && this.checkSpecialShip() && this.checkRemovePayAtOffice() && Number(this.total) != 0) {
      return true;
    }
    else return false;
  }

  checkSpecialShip() {
    if (this.isCheckSdOnly) {
      return true;
    }
    else return false;
  }

  checkRemovePayAtOffice() {
    if (this.entity == 'SG' && environment.production === true) {
      return false;
    } else {
      return true;
    }
  }

  checkPayGiftNAEP() {
    let payAtOffice = environment.paymentMethodList.find(element => element.name === 'PAY_AT_OFFICE');
    if (payAtOffice && Number(this.total) == 0 && this.isRedemptionPrice) {
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
    if (ipay88OTP && this.total > 0) {
      return true;
    }
    else return false;
  }

  checkDisplayFPX() {
    let ipay88FPX = environment.paymentMethodList.find(element => element.name === 'PAY_BY_IPAY88_FPX');
    if (ipay88FPX && this.total > 0) {
      return true; 
    }
    else return false;
  }

  checkDisplayWireCardOTP() {
    let wirecardOTP = environment.paymentMethodList.find(element => element.name === 'PAY_BY_WIRECARD_OTP');
    if (wirecardOTP && this.total > 0) {
      return true;
    }
    else return false;
  }

  checkIppSG(){
    let onLineEppPaymentOption = environment.paymentOptionList.find(element => element.name === 'ONLINE-EPP');
    if(this.entity !== 'MY' && onLineEppPaymentOption 
    && this.allow_epp_payment && Number(this.total) > 500
    ){
      return true;
    }else{
      return false;
    }
  }

  checkDisplay2c2pPayNow() {
    let sg2c2p = environment.paymentMethodList.find(element => element.name === 'PAY_BY_2C2P');
    if (sg2c2p && this.entity !== 'MY' && this.total > 0) {
      return true;
    }
    else return false;
  }

  popUpImage() {
    const swal = Swal.mixin({
      customClass: {
        closeButton: 'btn-close-popup-image-payment-method',
        image: 'image-popup-payment-method'
      },
      buttonsStyling: false
    });
    
    swal.fire({
      imageUrl: 'assets/images/image-instruction-paynow/paynow_instruction.jpg',
      imageWidth: 400,
      imageHeight: 680,
      imageAlt: 'instruction image paynow',
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false
    })
  }

  // All function payment

  functionPayByMPGS(){
    if(!this.hasSinglePaymentGift || this.is_naep_order){
      //show loading
      this.loadingPaymentService.show();
      // this.loading = true;
      // this.formPaymentOption['payment_option'] = OrderPaymentOption.FULL;
      // this.orderService.updatePaymentOption(this.formPaymentOption).subscribe();
      let formPayment = {
        "payment_amount": this.toPay,
        "payment_method": "CREDIT_CARD",
        "payment_gateway": "MPGS",
        "verified": "",
        "paymentOption": this.paymentOption,
        "order_id": this.orderId,
        "is_singlePayment": false,
        "singlePaymentOrderLineGifts": this.paymentGifts,
        "host": window.location.host,
        "session": this.shareLinkToken
      };
  
      this.paymentService.createPayment(formPayment , this.apiShare).subscribe(response => {
        if (response.code === 200) {
          let mpgsRequestBody = {
            "orderId": this.orderId,
            "orderAmount": response.data.payment_amount,
            "orderCurrency": this.currency,
            "orderUuid": this.orderUuid,
            "paymentId": response.data.id,
            "paymentUuid": response.data.uuid,
            "redirectUrl": mpgsResponseApi,
            "orderTmmId": this.order_id_tmm
          };
          this.paymentService.getMpgsCheckoutSession(mpgsRequestBody , this.apiShare).subscribe(data => {
            if (data['result'] === 'SUCCESS') {
              ScriptJS.get(environment.mpgsOtpUrl, () => {
                Checkout.configure(
                  {
                    merchant: data['merchant'],
                    session: {
                      id: data['session']['id']
                    },
                    interaction: {
                      merchant: {
                        name: 'Thermomix Singapore'
                      },
                      operation: 'PURCHASE',
                    },
                    order: {
                      currency: this.currency
                    }
                  });
                Checkout.showPaymentPage();
              });

            } else {
              //hide loading
              this.loadingPaymentService.hide(); 
            }
          });

        } else {
          //hide loading
          this.loadingPaymentService.hide(); 
        }
      });
    }else{
      let methodRadio = "MPGS";
      let paymentOption = OrderPaymentOption.FULL;

      this.router.navigate(["../extra-gift"], {
        queryParams: CheckNullOrUndefinedOrEmpty(this.shareLinkToken) ? {
          methodRadio: methodRadio,
          orderId: this.orderId,
          paymentOption: paymentOption,
          uuid: this.orderUuid
        }: {session: this.shareLinkToken , methodRadio: methodRadio},
      });
    }
  }

  functionPayAtOffice(){
    //show loading
    this.loadingPaymentService.show();

    let methodRadio = "OFFICE";
    this.formPaymentOption['payment_option'] = OrderPaymentOption.FULL;
    this.orderService.updatePaymentOption(this.formPaymentOption , this.apiShare).subscribe(data=>{
      if (this.entity === 'SG') {
        localStorage.setItem('hasValidSinglePaymentGift', this.hasSinglePaymentGift.toString());
  
        if (this.hasSinglePaymentGift && this.is_naep_order == false) {
          //hide loading
          this.loadingPaymentService.hide();

          this.router.navigate(["../extra-gift"], {
            queryParams: CheckNullOrUndefinedOrEmpty(this.shareLinkToken) ? {
              methodRadio: methodRadio,
              orderId: this.orderId,
              paymentOption:  this.paymentOption,
              uuid: this.orderUuid
            } : {session: this.shareLinkToken , methodRadio: methodRadio},
          });
        } else {
          //hide loading
          this.loadingPaymentService.hide();          
    
          this.router.navigate(["/pay-at-office"], {
            queryParams: (CheckNullOrUndefinedOrEmpty(this.shareLinkToken)) ? {
              methodRadio: methodRadio,
              orderId: this.orderId,
              paymentOption: this.paymentOption,
              uuid: this.orderUuid,
              id_tmm : this.order_id_tmm
            } : {session: this.shareLinkToken},
          });
        }
  
      } else {
        //hide loading
        this.loadingPaymentService.hide();
  
        this.router.navigate(["/pay-at-office"], {
          queryParams:  CheckNullOrUndefinedOrEmpty(this.shareLinkToken) ? {
            methodRadio: methodRadio,
            orderId: this.orderId,
            paymentOption: this.paymentOption,
            uuid: this.orderUuid,
            id_tmm : this.order_id_tmm
          }: {session: this.shareLinkToken},
        });
      }
    });
  }

  functionPayByPayNow(){
    //check case gift
    if(!this.hasSinglePaymentGift || this.is_naep_order) {
      //show loading
      this.loadingPaymentService.show();
      // this.formPaymentOption['payment_option'] = OrderPaymentOption.FULL;
      // this.orderService.updatePaymentOption(this.formPaymentOption).subscribe();
      let formPayment = {
        "payment_amount": this.toPay,
        "payment_method": "TT",
        "payment_gateway": "2C2P",
        "verified": "",
        "paymentOption": this.paymentOption,
        "order_id": this.orderId,
        "is_singlePayment": false,
        "singlePaymentOrderLineGifts": this.paymentGifts,
        "host": window.location.host,
        "session": this.shareLinkToken
      };
      
      this.paymentService.createPayment(formPayment , this.apiShare).subscribe(response => {    
        if (response.code === 200) {
          this.version = response.data.payment_request.version;
          this.amount2c2p = response.data.payment_request.amount;
          this.hash_value = response.data.payment_request.signature;
          this.merchant_id = response.data.payment_request.merchantId;
          this.result_url_1 =  response.data.payment_request.resultUrl;
          this.payment_option_2c2p = response.data.payment_request.payment_option;
          this.request_3ds = response.data.payment_request.request_3ds;
          this.payment_description = response.data.payment_request.paymentDescription;
          this.order_id_2c2p = response.data.payment_request.orderId;
          this.currency2c2p = response.data.payment_request.currency;
          this.qrType = response.data.payment_request.qr_type;
          this.qrOption = response.data.payment_request.qr_option
          this.user_defined_1 = response.data.payment_request.user_defined_1;
          // this.result_url_2 = response.data.payment_request.resultUrl2;
          
          const form = document.getElementById('sg2c2p_paynow_form') as HTMLFormElement;
          form.elements['merchant_id'].value = this.merchant_id;
          form.elements['version'].value = this.version;
          form.elements['hash_value'].value = this.hash_value;
          form.elements['result_url_1'].value = this.result_url_1;
          // form.elements['result_url_2'].value = this.result_url_2;
          form.elements['currency'].value = this.currency2c2p;
          form.elements['payment_option'].value = this.payment_option_2c2p;
          form.elements['request_3ds'].value = this.request_3ds;
          form.elements['payment_description'].value = this.payment_description;
          form.elements['order_id'].value = this.order_id_2c2p;
          form.elements['amount'].value = this.amount2c2p;
          form.elements['qr_type'].value = this.qrType;
          // form.elements['qr_option'].value = this.qrOption;
          form.elements['user_defined_1'].value = this.user_defined_1;
          form.submit();

        } else {
          //hide loading
          this.loadingPaymentService.hide();
        }
      })

    } else {
      let methodRadio = "2C2P";
      // let paymentOption = this.entity !== "MY" ? OrderPaymentOption.FULL :this.paymentOption ;
      let paymentOption = OrderPaymentOption.FULL;
      this.router.navigate(["../extra-gift"], {
        queryParams: (CheckNullOrUndefinedOrEmpty(this.shareLinkToken)) ? {
          methodRadio: methodRadio,
          orderId: this.orderId,
          paymentOption: paymentOption,
          uuid: this.orderUuid
        } : {session: this.shareLinkToken, methodRadio: methodRadio},
      });
    }
  }

  functionPayByEpp2C2P(){
    //show loading
    this.loadingPaymentService.show();
    // this.formPaymentOption['payment_option'] = OrderPaymentOption.EPP;
    // this.orderService.updatePaymentOption(this.formPaymentOption).subscribe();
    let formPayment = {
      "payment_amount": this.toPay,
      "payment_method": "CREDIT_CARD",
      "payment_gateway": "2C2P",
      "verified": "",
      "paymentOption": OrderPaymentOption.EPP,
      "order_id": this.orderId,
      "is_singlePayment": false,
      "singlePaymentOrderLineGifts": this.paymentGifts,
      "host": window.location.host ,
      "session": this.shareLinkToken
    };
    this.paymentService.createPayment(formPayment , this.apiShare).subscribe(response => {
      if (response.code === 200) {

        this.version = response.data.payment_request.version;
        this.amount2c2p = response.data.payment_request.amount;
        this.hash_value = response.data.payment_request.signature;
        this.merchant_id = response.data.payment_request.merchantId;
        this.result_url_1 =  response.data.payment_request.resultUrl;
        this.payment_option_2c2p = response.data.payment_request.payment_option;
        this.ipp_2c2p = response.data.payment_request.ipp_interest_type;
        this.request_3ds = response.data.payment_request.request_3ds;
        this.payment_description = response.data.payment_request.paymentDescription;
        this.order_id_2c2p = response.data.payment_request.orderId;
        this.currency2c2p = response.data.payment_request.currency;
        this.user_defined_1 = response.data.payment_request.user_defined_1;

        const form = document.getElementById('sg2c2p_form') as HTMLFormElement;
        form.elements['merchant_id'].value = this.merchant_id;
        form.elements['version'].value = this.version;
        form.elements['hash_value'].value = this.hash_value;
        form.elements['result_url_1'].value = this.result_url_1;
        form.elements['currency'].value = this.currency2c2p;
        form.elements['payment_option'].value = this.payment_option_2c2p;
        form.elements['ipp_interest_type'].value = this.ipp_2c2p;
        form.elements['request_3ds'].value = this.request_3ds;
        form.elements['payment_description'].value = this.payment_description;
        form.elements['order_id'].value = this.order_id_2c2p;
        form.elements['amount'].value = this.amount2c2p;
        form.elements['user_defined_1'].value = this.user_defined_1;

        form.submit();

      } else {
        //hide loading
        this.loadingPaymentService.hide();        
      }
    });
  }

  
  functionPayEppOfficeSG(){
    //show loading
    this.loadingPaymentService.show();
    let orderId = this.orderId;
    let methodRadio = "OFFICE";
    this.formPaymentOption['payment_option'] = OrderPaymentOption.EPP;

    this.orderService.updatePaymentOption(this.formPaymentOption , this.apiShare).subscribe(()=>{   
      //hide loading
      this.loadingPaymentService.hide();

      this.router.navigate(["/pay-at-office"], {
        queryParams: CheckNullOrUndefinedOrEmpty(this.shareLinkToken) ? {
          methodRadio: methodRadio,
          orderId: orderId,
          paymentOption: OrderPaymentOption.EPP,
          uuid: this.orderUuid
         } : {session: this.shareLinkToken},
      });
    });
    
  }

  functionPayByDBS(){
    //show loading
    this.loadingPaymentService.show();
    // this.loading = true;
    // this.formPaymentOption['payment_option'] = OrderPaymentOption.EPP;
    // this.orderService.updatePaymentOption(this.formPaymentOption).subscribe();
    let formPayment = {
      payment_amount: this.total,
      payment_method: "CREDIT_CARD",
      payment_gateway: "WIRECARD",
      verified: "",
      paymentOption: OrderPaymentOption.EPP,
      host: window.location.host,
      order_id: this.orderId,

    };

    this.paymentService.createPayment(formPayment , this.apiShare).subscribe(response => {
      if (response.code === 200) {

        let formIPP = {
          request_id: response.data.uuid + '+' + String(this.order_id_tmm),
          amount: response.data.payment_amount,
          currency: response.data.payment_currency,
          redirect_url: wireCardIppResponseApi,
          cancel_redirect_url: window.location.host.includes('local') ? `http://${window.location.host}/order-detail?uuid=${this.orderUuid}` : `https://${window.location.host}/order-detail?uuid=${this.orderUuid}`
          // cancel_redirect_url: window.location.host.includes('local') ? `http://${window.location.host}/order-detail/${this.orderId}` : `https://${window.location.host}/order-detail/${this.orderId}`
        };

        let requestedData;

        this.paymentService.getIppData(formIPP , this.apiShare).subscribe(res => {
          requestedData = res;
          ScriptJS.get(environment.wireCardIppUrl, () => {

            ElasticPaymentPage.hostedPay(requestedData);
          });
        });
      } else {
        //hide loading
        this.loadingPaymentService.hide();
      }
    });
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
      "is_singlePayment": this.hasValidSinglePaymentGift,
      "singlePaymentOrderLineGifts": this.paymentGifts,
      "host": window.location.host ,
      "session": this.shareLinkToken
    };

    this.paymentService.createPayment(formPayment , this.apiShare).subscribe(response => {

      if (response.code === 200) {
        this.refNo = response.data.uuid + '+' + String(this.order_id_tmm);
        this.amount = response.data.payment_amount.toFixed(2);
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
      "is_singlePayment": this.hasValidSinglePaymentGift,
      "singlePaymentOrderLineGifts": this.paymentGifts,
      "host": window.location.host,
      "session": this.shareLinkToken
    };

    this.paymentService.createPayment(formPayment , this.apiShare).subscribe(response => {

      if (response.code === 200) { 
        this.refNo = response.data.uuid + '+' + String(this.order_id_tmm);
        this.amount = response.data.payment_amount.toFixed(2);
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
        form.submit();
      
      } else {
        //hide loading
        this.loadingPaymentService.hide();       
      }
    });
  }

  //Not use
  payByWirecard() {

    let formPayment = {
      "payment_amount": this.toPay,
      "payment_method": "CREDIT_CARD",
      "payment_gateway": "WIRECARD",
      "verified": "",
      "paymentOption": this.paymentOption,
      "order_id": this.orderId,
      "is_singlePayment": this.hasValidSinglePaymentGift,
      "host": window.location.host
    };

    this.paymentService.createPayment(formPayment).subscribe(response => {

      if (response.code === 200) {

        let wirecardRequestBody = {
          "payment_amount": response.data.payment_amount,
          "currency": this.currency,
          "request_id": response.data.uuid + '+' + String(this.orderId),
          "redirect_url": wireCardPaymentResponseApi,
          "order_id": this.orderId
        };

        this.paymentService.getWirecardPaymentRedirectUrl(wirecardRequestBody).subscribe(response => {

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

  nextToPayByCheque() {
    this.formPaymentOption['payment_option'] = OrderPaymentOption.FULL;
    this.orderService.updatePaymentOption(this.formPaymentOption).subscribe();
    let orderId = this.orderId;
    let methodRadio = "TT";
    // let paymentOption = this.entity !== "MY" ? OrderPaymentOption.FULL :this.paymentOption ;
    let paymentOption = OrderPaymentOption.FULL;
    localStorage.setItem('hasValidSinglePaymentGift', this.hasSinglePaymentGift.toString());



    //change 15-10 gift request
    if (this.hasSinglePaymentGift && this.is_naep_order == false) {
      this.router.navigate(["../extra-gift"], {
        queryParams: {
          methodRadio: methodRadio,
          orderId: orderId,
          paymentOption: paymentOption,
          uuid: this.orderUuid,
          id_tmm : this.order_id_tmm
        },
      });
    }

    else {
      this.router.navigate(["/pay-by-cheque"], {
        queryParams: {
          methodRadio: methodRadio,
          orderId: orderId,
          paymentOption: paymentOption,
          uuid: this.orderUuid,
          id_tmm : this.order_id_tmm
        },
      });
    }
  }

  dialogConfirm(){
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: "500px",
      data: {
        message: `Are you ${this.dataOrderSummary.customerInformation.firstName}?`,
        type : "INFOR",
        btnYes : "YES",
        btnNo : "NO",
        titleDialog : "NOTICE",
        classSuccess : true
      },
    });
  
    dialogRef.afterClosed().subscribe(result =>
    {
      if (result === true)
      {
        this.panelOpenStateSummary = true;
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
            "Kindly check order information carefully before processing with payment. If there is any wrong information, please contact your advisor.",
            title:
            "THANK YOU",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data=>{
          this.panelOpenStateSummary = true;

          return;
        })
      } else
      {
        this.router.navigate(['store'])
      }
    })
  }

  // getRemainingPayment(orderId) {
  //   this.paymentService.getRemainingByOrderId(orderId).subscribe((data) => {
  //     if (!isNullOrUndefined(data)) {
  //       this.remaining = data.remaining;

  //       this.valueRadio = localStorage.getItem('selectPay');
  //       this.toPayPartially = localStorage.getItem('nextValuePayPartially');
  //       this.isMultiplePayment = localStorage.getItem('multiple');

  //       if (this.valueRadio == "2") {
  //         this.toPay = Number(this.toPayPartially);
  //       } else {
  //         this.toPay = this.remaining;
  //       }

  //       localStorage.setItem('toPay', this.toPay);

  //       this.remaining = this.remaining - this.toPay;
  //       localStorage.setItem('remaining', this.remaining);
  //     }
  //   });
  // }

  // getPendingVerifiedPayment(orderId) {
  //   this.paymentService.getPendingVerifiedByOrderId(orderId).subscribe((data) => {
  //     if (!isNullOrUndefined(data)) {
  //       this.pendingVerified = data.pending;
  //     }
  //   });
  // }

  // getVerifiedPayment(orderId) {
  //   this.paymentService.getVerifiedByOrderId(orderId).subscribe((data) => {
  //     if (!isNullOrUndefined(data)) {
  //       this.verified = data.verified;
  //     }
  //   });
  // }
}

export enum PaymentEnum{
  OFFICE = "OFFICE",
  FPX = "FPX",
  IPAY88 = "IPAY88",
  MPGS = "MPGS",
  PAYNOW = "PAYNOW",
  EPP_2C2P = "EPP_2C2P",
  DBS = "DBS",
  EPP_OFFICE = "EPP_OFFICE"
}
