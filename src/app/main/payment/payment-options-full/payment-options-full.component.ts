import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from 'app/core/service/payment.service';
import { OrderService } from 'app/core/service/order.service';
import { isNullOrUndefined } from 'util';
import { formatCurrency } from '@angular/common';

import { MyProfileService } from '../../../core/service/my-profile.service';
import { MyProfile } from 'app/core/models/my-profile.model';

import { OrderPaymentOption } from 'app/core/enum/order-payment-option.enum';
import { environment } from 'environments/environment';
import { wireCardIppResponseApi } from '../../../core/service/backend-api';
import * as ScriptJS from 'scriptjs';
import { Title } from 'app/core/enum/title';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api'
import { FooterPaymentComponent } from '../footer-payment/footer-payment.component'
import { PaymentCommon } from '../payment-common-function';
import { DialogConfirmComponent } from 'app/main/common-component/dialog-confirm/dialog-confirm.component';

declare let ElasticPaymentPage;

@Component({
  selector: 'payment-options-full',
  templateUrl: './payment-options-full.component.html',
  styleUrls: ['./payment-options-full.component.scss'],
  providers: [MessageService]
})
export class PaymentOptionsFullComponent implements OnInit {
  @ViewChild('copy_link') footerPaymentComponent: FooterPaymentComponent;
  
  shipping: any;
  subtotal: any;
  total: any;
  pendingVerified: any;
  verified: any;
  remaining: any;
  orderID: any;
  orderUuid: any;
  orderData: any;
  toPayFull: any;
  hasSpecialPayment: boolean;
  isDisabled: boolean;
  currency: any;
  // loading: boolean = true;

  entity_id: any;



  //payment Option
  paymentOption = '1';
  isEppDisabled: boolean;
  isRecurringDisabled: boolean;
  allow_epp_payment: boolean;
  allow_recurring_payment: boolean;

  formPaymentOption: any;

  //single payment gift
  listProduct: any;
  singlePaymentGiftProducts: any;
  onlineBankingPaymentGiftProducts: any;
  hasSinglePaymentGift: boolean;
  hasOnlineBankingGift: boolean;
  //button loading
  buttonName = "NEXT";
  active: boolean = false;

  loading: boolean=true; 
  title = Title.DOT;
  env = environment.entity
  is_naep_order : boolean = false;
  order_id_tmm: number;
  session: string;
  token: string;
  checkLinkShare: boolean;
  apiShare: boolean;
  panelOpenStateSummary = false;
  is_buying_for_customer: boolean;
  is_show_confirm_dialog : boolean = false;

  dataOrderSummary : any;
  constructor(
    private order: OrderService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private payment: PaymentService,
    private myProfileService: MyProfileService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private paymentCommon: PaymentCommon
  ) { }

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe((data) => {
      this.orderID = data.id;
      this.orderUuid = data.uuid;
      this.session = data.session;
      this.getDataOrder(this.session);
    });
    localStorage.removeItem('formOrderLineSinglePaymentGiftArr');

    // this.getOrder(this.orderUuid);
    // this.getRemainingPayment(this.orderID);
    // this.getPendingVerifiedPayment(this.orderID);
    // this.getVerifiedPayment(this.orderID);
  }

  getDataOrder(session){
    this.checkLinkShare = this.paymentCommon.checkLinkShare(session);
    this.apiShare = this.paymentCommon.isApiShare(session);
    if(this.paymentCommon.shareForNotCustomer(session)){
      this.order.getDateShareOrder(session).subscribe(data=>{
        this.renderShareOrder(data)
      })
    }else if(this.paymentCommon.shareForCustomer(session)){
      this.order.getDataForShareOrderCustomer(session).subscribe(data=>{
        this.renderShareOrder(data)
      })
    }else{
      this.getOrder(this.orderUuid);
    }
  }

  getOrder(orderUuid) {
    return new Promise((resolve) => {
      this.order.getOrderByOrderId(orderUuid).subscribe((respone) => {
        this.renderDataOrder(respone)
      });
    });
  }

  renderShareOrder(data){
    if(data == "expired"){
      this.paymentCommon.dialogExpired();
    }else if(!CheckNullOrUndefinedOrEmpty(data?.payment)){
      this.router.navigate(["/installment-confirm"], {
        queryParams: {session: this.session},
      });
    }else{
      this.orderUuid = data?.uuid
      this.is_show_confirm_dialog = true;
      this.renderDataOrder(data);
    }
  }

  renderDataOrder(respone){
    if (!CheckNullOrUndefinedOrEmpty(respone)) {
      this.orderData = respone;
      
      this.shipping = this.orderData.shippingFee;
      this.subtotal = this.orderData.subtotal;
      this.total = this.orderData.totalAmount;
      this.hasSpecialPayment = this.orderData.hasSpecialPayment;
      this.allow_epp_payment = this.orderData.allow_epp_payment;
      this.allow_recurring_payment = this.orderData.allow_recurring_payment;
      this.order_id_tmm = this.orderData.order_id_tmm;
      this.entity_id = Number(this.orderData.entityId);
      this.is_naep_order = respone.is_naep_order;
      this.dataOrderSummary = respone.dataSummary;
      this.dataOrderSummary["is_naep_order"] = respone.is_naep_order;
      this.currency = this.orderData.currency;
      this.is_buying_for_customer = this.orderData.is_buying_for_customer || false;
      this.formPaymentOption = {
        order_id: this.orderData.id,
        payment_option: ""
      };

      if (!this.hasSpecialPayment) {
        this.isEppDisabled = true;
        this.isRecurringDisabled = true;
      }
      else if (this.hasSpecialPayment == true && this.allow_epp_payment == true) {
        this.isEppDisabled = false;
      }
      else if (this.hasSpecialPayment == true && this.allow_recurring_payment == true) {
        this.isRecurringDisabled = false;
      }

      this.listProduct = this.orderData.listProduct;
      const productWithSinglePaymentGifts = this.listProduct.find(product => !CheckNullOrUndefinedOrEmpty(product.singlePaymentGiftProducts));
      this.hasSinglePaymentGift = (productWithSinglePaymentGifts) ? true : false;
      // const productWithOnlineBankingGifts = this.listProduct.find(product => !CheckNullOrUndefinedOrEmpty(product.onlineBankingPaymentGiftProducts));
      // this.hasOnlineBankingGift = (productWithOnlineBankingGifts) ? true : false;

      // this.dataOrderSummary = respone.dataSummary;
      this.loading = false;
      if(this.is_show_confirm_dialog && this.env === 'MY')
      {
        this.dialogConfirm()
      }
    }
  }

  add(){
    this.messageService.add({ summary: 'Link copied to clipboard.', severity: 'success', life: 4000});
  }

  checkDisplayFullPayment() {

    let fullPaymentOption = environment.paymentOptionList.find(element => element.name === 'FULL');
    if (fullPaymentOption) {
      return true;
    }
    else return false;
  }

  checkDisplayOffLineEPP() {

    let offLineEppPaymentOption = environment.paymentOptionList.find(element => element.name === 'OFFLINE-EPP');
    if (offLineEppPaymentOption && this.allow_epp_payment && this.env !='SG') {
      return true;
    }
    else return false;
  }

  checkDisplayRecurring() {
    let recurringPaymentOption = environment.paymentOptionList.find(element => element.name === 'RECURRING');
    if (recurringPaymentOption && this.allow_recurring_payment && this.env !='SG') {
      return true;
    }
    else return false;
  }

  checkDisplayOnlineIPP() {
    let onLineEppPaymentOption = environment.paymentOptionList.find(element => element.name === 'ONLINE-EPP');
    if (onLineEppPaymentOption && this.allow_epp_payment && this.env !='MY') {
      return true;
    }
    else return false;
  }

  checkDisplayOnlineIPPMY() {

    // let onLineEppPaymentOption = environment.paymentOptionList.find(element => element.name === 'ONLINE-EPP');
    let onLineEppPaymentOption = environment.paymentOptionList.find(element => element.name === 'OFFLINE-EPP');

    if (onLineEppPaymentOption && this.allow_epp_payment && this.env != 'SG' && this.total > 500) {
      return true;
    }
    else return false;
  }

  getRemainingPayment(orderId) {
    this.payment.getRemainingByOrderId(orderId).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.remaining = data.remaining;
        this.toPayFull = formatCurrency(
          this.remaining,
          "en-US",
          "",
          "code",
          "0.2-2"
        );
      }
    });
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

  radioPayFully(value) {
    this.paymentOption = value;
  }

  radioPayOffLineEPP(value) {
    this.paymentOption = value;
  }

  radioPayOnlineEPPMY(value) {
    this.paymentOption = value;
  }

  radioPayRecurring(value) {
    this.paymentOption = value;
  }

  radioPayOnlineEPP(value) {
    this.paymentOption = value;
  }

  nextToPaymentOption() {
    this.order.checkOrderHasBeenPaid(this.orderUuid).subscribe(data=>{
      if(data){
        this.changePageAfterCheck();
      }else{
        this.paymentCommon.dialogPaymentHasBeenPaid();
      }
    })
  }

  changePageAfterCheck(){
    if (this.paymentOption == '1' ) {
      this.active = true;
      this.buttonName = "Processing...";

      localStorage.setItem('hasSinglePaymentGift', this.hasSinglePaymentGift.toString());
      // localStorage.setItem('hasOnlineBankingGift', this.hasOnlineBankingGift.toString());
      // this.formPaymentOption['payment_option'] = OrderPaymentOption.FULL;
      // this.order.updatePaymentOption(this.formPaymentOption).subscribe(response => {});
      if(this.hasSinglePaymentGift && this.is_naep_order == false){
  
        this.router.navigate(["../extra-gift"], {
          queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? {
            uuid: this.orderUuid
          } : {session: this.session},
        });

      }else{
        this.router.navigate(["../select-payment"], {
          queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? {
            orderId: this.orderID,
            paymentOption: OrderPaymentOption.FULL,
            uuid: this.orderUuid
          }: {session: this.session},
        });
      }

      // Change Gift 15-10
      // this.router.navigate(['../payment-options'], { queryParams: { id: this.orderID, paymentOption: OrderPaymentOption.FULL, uuid: this.orderUuid } });
      // console.log(this.formPaymentOption['payment_option']);
    } else if (this.paymentOption == '3') {
      this.active = true;
      this.buttonName = "Processing...";

      this.formPaymentOption['payment_option'] = OrderPaymentOption.DEPOSIT;
      this.order.updatePaymentOption(this.formPaymentOption , this.apiShare).subscribe();
      this.router.navigate(['../recurring-payment'], { queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? 
        { id: this.orderID, uuid: this.orderUuid } : 
        { session: this.session }});

    } else if (this.paymentOption == '5') {
      this.active = true;
      this.buttonName = "Processing...";
      this.router.navigate(['../pay-epp'], { queryParams: CheckNullOrUndefinedOrEmpty(this.session) ?{ id: this.orderID, uuid: this.orderUuid } : {session:this.session} });
    }

    // else if (this.paymentOption == '2') {
    //   this.active = true;
    //   this.buttonName = "Processing...";

    //   this.formPaymentOption['payment_option'] = OrderPaymentOption.EPP;
    //   this.order.updatePaymentOption(this.formPaymentOption).subscribe();
    //   this.router.navigate(['../offline-epp'], { queryParams: { id: this.orderID, paymentOption: OrderPaymentOption.EPP, uuid: this.orderUuid } });
    //   // console.log('epp');
    // }
    // else if (this.paymentOption == '4') {
    //   this.active = true;
    //   this.buttonName = "Processing...";

    //   this.formPaymentOption['payment_option'] = OrderPaymentOption.EPP;
    //   this.order.updatePaymentOption(this.formPaymentOption).subscribe();

    //   let formPayment = {
    //     payment_amount: this.total,
    //     payment_method: "CREDIT_CARD",
    //     payment_gateway: "WIRECARD",
    //     verified: "",
    //     paymentOption: OrderPaymentOption.EPP,
    //     host: window.location.host,
    //     order_id: this.orderID,
    //   };
    //   this.payment.createPayment(formPayment).subscribe(response => {
    //     if (response.code === 200) {
    //       let formIPP = {
    //         request_id: response.data.uuid + '+' + String(this.orderID),
    //         amount: response.data.payment_amount,
    //         currency: response.data.payment_currency,
    //         redirect_url: wireCardIppResponseApi,
    //         // cancel_redirect_url: window.location.host.includes('local') ? `http://${window.location.host}/order-detail/${this.orderID}` : `https://${window.location.host}/order-detail/${this.orderID}`
    //         cancel_redirect_url: window.location.host.includes('local') ? `http://${window.location.host}/order-detail?uuid=${this.orderUuid}` : `https://${window.location.host}/order-detail?uuid=${this.orderUuid}`
    //       };

    //       let requestedData;

    //       this.payment.getIppData(formIPP).subscribe(res => {
    //         // console.log(res);
    //         requestedData = res;

    //         ScriptJS.get(environment.wireCardIppUrl, () => {

    //           ElasticPaymentPage.hostedPay(requestedData);
    //         });
    //       });
    //     }
    //   });
    // } 
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

}
