import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from 'app/core/service/payment.service';
import { OrderService } from 'app/core/service/order.service';
import { SharedService } from 'app/core/service/commom/shared.service';
import { OrderPaymentOption } from 'app/core/enum/order-payment-option.enum';
import { isNullOrUndefined } from 'util';
import { ProductService } from '../../../core/service/product.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Title } from 'app/core/enum/title';
import { environment } from 'environments/environment';
import { mpgsResponseApi} from '../../../core/service/backend-api';
import * as ScriptJS from 'scriptjs';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { PaymentCommon } from '../payment-common-function';
import { LoadingPaymentService } from '@fuse/services/loading-payment.service';

declare var Checkout;
@Component({
  selector: 'app-extra-gift',
  templateUrl: './extra-gift.component.html',
  styleUrls: ['./extra-gift.component.scss']
})
export class ExtraGiftComponent implements OnInit {

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
  methodRadio: any;
  paymentOption: any;

  listProduct: any;
  get_bank_transfer_gift: boolean;

  listProductAndBankGifts = [];
  listProductAndSinglePaymentGifts = [];

  bankTransferGiftForm: FormGroup;
  productIds = [];

  title = Title.LEFT;
  subtotal;
   loading: boolean = false
  entity = environment.entity;
  order_id_tmm: number;

  //check gitf
  hasSinglePaymentGift: boolean;
  hasOnlineBankingGift: boolean;
  hasValidSinglePaymentGift: boolean;
  hasValidOnlineBankingGift: boolean;

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
  formPaymentOption: any;
  allow_epp_payment : boolean;
  paymentGifts;
  payment_option_2c2p;
  ipp_2c2p
  request_3ds : string;
  user_defined_1 : string;
  result_url_2: string;

  session: string;
  token: string;
  apiShare: boolean;
  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,
    private payment: PaymentService,
    private order: OrderService,
    private sharedService: SharedService,
    private productService: ProductService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private paymentCommon: PaymentCommon,
    private loadingPaymentService: LoadingPaymentService
  ) { }

  ngOnInit(): void {

    // chang 15-10 gift request-------------------------
    // this.toPay = localStorage.getItem('toPay');
    // this.remaining = localStorage.getItem('remaining');
    this.activedRoute.queryParams.subscribe((param) => {
      this.orderId = param.orderId;
      this.methodRadio = param.methodRadio;
      this.paymentOption = param.paymentOption;
      this.orderUuid = param.uuid;
      this.session = param.session;
      this.getDataShareOrder(this.session)
    });

    this.hasSinglePaymentGift = localStorage.getItem('hasSinglePaymentGift') === 'true';
    this.hasValidSinglePaymentGift = this.hasSinglePaymentGift;
    this.bankTransferGiftForm = this._formBuilder.group({});
    // this.hasOnlineBankingGift = localStorage.getItem('hasOnlineBankingGift') === 'true';
    // this.hasValidOnlineBankingGift = this.hasOnlineBankingGift;


    // this.getOrder(this.orderUuid);
    // this.getPendingVerifiedPayment(this.orderId);
    // this.getVerifiedPayment(this.orderId);
    // this.getRemainingPayment(this.orderId);

  }

  getDataShareOrder(session){
    this.apiShare = this.paymentCommon.isApiShare(session);
    if(this.paymentCommon.shareForNotCustomer(session)){
      this.order.getDateShareOrder(session).subscribe(data=>{
        this.getDataApi(data)
      })
    }else if(this.paymentCommon.shareForCustomer(session)){
      this.order.getDataForShareOrderCustomer(session).subscribe(data=>{
        this.getDataApi(data)
      })
    }else{
      this.getOrder(this.orderUuid);
    }
  }

  getOrder(orderId) {
    return new Promise((resolve) => {
      this.order.getOrderByOrderId(orderId).subscribe((response) => {
        this.renderData(response)
      });
    });
  }

  getDataApi(data){
    if(data == "expired"){
      this.paymentCommon.dialogExpired();
    }else{
      this.orderUuid = data.uuid;
      this.renderData(data);
    }
  }

  nextToTTPayment() {
    this.order.checkOrderHasBeenPaid(this.orderUuid).subscribe(data=>{
      if(data){
        this.changePageAfterCheck();
      }else{
        this.paymentCommon.dialogPaymentHasBeenPaid();
      }
    })
  }

  renderData(response){
    if (!CheckNullOrUndefinedOrEmpty(response)) {
      this.currency = response.currency;
      this.shipping = response.shippingFee;
      this.subTotal = response.subtotal;
      this.total = response.totalAmount;
      this.orderId = response.id;
      // console.log(response)
      this.order_id_tmm = response.order_id_tmm;
      this.listProduct = response.listProduct;
      this.listProduct.forEach(pro => {
        // 15-10 change gift
        // this.productService.getBankTransferGiftByProdcutId(Number(pro.id)).subscribe(res => { 
        this.productService.getSinglePaymentGiftByProdcutId(Number(pro.id) , this.apiShare).subscribe(res => { 
          if (res.code === 200 && !CheckNullOrUndefinedOrEmpty(res.data)) {
            // console.log(res.data)
            let productAndGifts = new ProductAndBankTransferGifts();
            productAndGifts.productId = pro.id;
            productAndGifts.orderLineId = pro.orderLineId;
            productAndGifts.productName = pro.productName;
            productAndGifts.bankTransferGifts = res.data;
            productAndGifts.quantity = pro.quantity;
            productAndGifts.formName = pro.productName.split(".").join("") + " "+ pro.orderLineId;
            this.listProductAndBankGifts.push(productAndGifts);
            let productWithGiftsArr = new FormArray([]);
            for (let i = 1; i <= productAndGifts.quantity; i++) {
              productWithGiftsArr.push(new FormControl('', Validators.required));
            }
            this.bankTransferGiftForm.addControl(productAndGifts.formName, productWithGiftsArr);
            
          }
        });
      });

      if (this.hasSinglePaymentGift) {
        this.checkGiftValidity();
      }

      this.formPaymentOption = {
        order_id: this.orderId,
        payment_option: "" 
      };
    }
  }

  backToPaymentOption() {
    if(this.entity === 'SG'){
      this.router.navigate(["/select-payment"], {
        queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? {
          orderId: this.orderId,
          uuid: this.orderUuid,
          paymentOption: OrderPaymentOption.FULL
        } : {session: this.session},
      });
    }else if(this.entity === 'MY'){
      this.router.navigate(["/payment-options-full"], {
        queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? {
          id: this.orderId,
          uuid: this.orderUuid
        }: {session: this.session},
      });

    }
  }

  changePageAfterCheck(){
    //show loading
    this.loadingPaymentService.show();

        // const formOrderLineBankTransferGiftArr = [];
        const formOrderLineSinglePaymentGiftArr = [];
        this.listProductAndBankGifts.forEach(item => {
          let giftProductIds = this.bankTransferGiftForm.controls[item.formName].value;
          giftProductIds.forEach(giftProductId => {
            const giftProductName = item.bankTransferGifts.find(gift => gift.id === giftProductId).product_name;
            let formOrderLineSinglePaymentGift = {
              order_line_item_id: item.orderLineId,
              single_paymt_gift_product_id : Number(giftProductId),
              single_paymt_gift_product_name: giftProductName,
            }
            formOrderLineSinglePaymentGiftArr.push(formOrderLineSinglePaymentGift);
          });
        });
        localStorage.setItem('formOrderLineSinglePaymentGiftArr', JSON.stringify({ formOrderLineSinglePaymentGiftArr: formOrderLineSinglePaymentGiftArr }));
        if(this.entity === 'SG' && this.methodRadio == "TT"){
          //hide loading
          this.loadingPaymentService.hide();

          this.router.navigate(["/pay-by-cheque"], {
            queryParams: {
              methodRadio: this.methodRadio,
              orderId: this.orderId,
              paymentOption: this.paymentOption,
              uuid: this.orderUuid,
              id_tmm : this.order_id_tmm
            },
          });
    
        } else if (this.entity === 'SG' && this.methodRadio == "OFFICE") {
          //hide loading
          this.loadingPaymentService.hide();

          this.router.navigate(["/pay-at-office"], {
            queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? {
              methodRadio: this.methodRadio,
              orderId: this.orderId,
              paymentOption: this.paymentOption,
              uuid: this.orderUuid,
              id_tmm : this.order_id_tmm
            }: {session: this.session},
          });
    
        } else if (this.entity === 'SG' && this.methodRadio == "2C2P") {
          
          // this.formPaymentOption['payment_option'] = OrderPaymentOption.FULL;
          // this.order.updatePaymentOption(this.formPaymentOption).subscribe();
          let formPayment = {
            "payment_amount": Number(this.total),
            "payment_method": "TT",
            "payment_gateway": "2C2P",
            "verified": "",
            "paymentOption": OrderPaymentOption.FULL,
            "order_id": this.orderId,
            "is_singlePayment": true,
            "singlePaymentOrderLineGifts": formOrderLineSinglePaymentGiftArr,
            "host": window.location.host,
            "session": this.session
          };
    
          this.payment.createPayment(formPayment , this.apiShare).subscribe(response => {
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
      
            const form = document.getElementById('sg2c2p_paynow_form') as HTMLFormElement;
            form.elements['merchant_id'].value = this.merchant_id;
            form.elements['version'].value = this.version;
            form.elements['hash_value'].value = this.hash_value;
            form.elements['result_url_1'].value = this.result_url_1;
            form.elements['currency'].value = this.currency2c2p;
            form.elements['payment_option'].value = this.payment_option_2c2p;
            form.elements['request_3ds'].value = this.request_3ds;
            form.elements['payment_description'].value = this.payment_description;
            form.elements['order_id'].value = this.order_id_2c2p;
            form.elements['amount'].value = this.amount2c2p;
            form.elements['qr_type'].value = this.qrType;
            form.elements['user_defined_1'].value = this.user_defined_1;
            form.submit();

          } else {
              //hide loading
              this.loadingPaymentService.hide();   
          }
        })
        }else if(this.entity === 'SG' && this.methodRadio == "MPGS"){
          // this.loading = true;
          // let formPaymentOption = {
          //   order_id: this.orderId,
          //   payment_option: OrderPaymentOption.FULL 
          // };
          // this.order.updatePaymentOption(formPaymentOption).subscribe();
          let formPayment = {
            "payment_amount": this.total,
            "payment_method": "CREDIT_CARD",
            "payment_gateway": "MPGS",
            "verified": "",
            "paymentOption": OrderPaymentOption.FULL ,
            "order_id": this.orderId,
            "is_singlePayment": true,
            "singlePaymentOrderLineGifts": formOrderLineSinglePaymentGiftArr,
            "host": window.location.host,
            "session": this.session
          };
    
      
          this.payment.createPayment(formPayment , this.apiShare).subscribe(response => {
            if (response.code === 200) {
              let mpgsRequestBody = {
                "orderId": this.orderId,
                "orderAmount": Number(response.data.payment_amount),
                "orderCurrency": this.currency,
                "orderUuid": this.orderUuid,
                "paymentId": response.data.id,
                "paymentUuid": response.data.uuid,
                "redirectUrl": mpgsResponseApi,
                "orderTmmId": this.order_id_tmm
              };
              this.payment.getMpgsCheckoutSession(mpgsRequestBody , this.apiShare).subscribe(data => {
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
                          operation: 'PURCHASE'
                        },
                        order: {
                          currency: this.currency
                        }
                      });
                    Checkout.showPaymentPage();
                  });
                }
              });
            
            } else {
              //hide loading
              this.loadingPaymentService.hide();
            }
          });
        }
        else{
          //hide loading
          this.loadingPaymentService.hide();

          localStorage.setItem('selectPay', '1');
          // localStorage.setItem('hasOnlineBankingGift2', this.hasValidOnlineBankingGift.toString());
          localStorage.setItem('nextValuePayPartially', '');

          this.router.navigate(["../select-payment"], {
            queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? {
              orderId: this.orderId,
              paymentOption: this.paymentOption,
              uuid: this.orderUuid
            }: {session: this.session},
          });
        }
  }

  counter(i: number) {
    return new Array(i);
  }

  checkGiftValidity() {
    // if (Number(this.total) === Number(this.remaining)) {
      this.hasValidSinglePaymentGift = true;
      this.hasValidOnlineBankingGift = true;
    // }
    // else {
    //   this.hasValidSinglePaymentGift = false;
    //   this.hasValidOnlineBankingGift = false;
    // }
    localStorage.setItem('hasValidSinglePaymentGift', this.hasValidSinglePaymentGift.toString());
    // localStorage.setItem('hasValidOnlineBankingGift', this.hasValidOnlineBankingGift.toString());
  }

  goSharePaymentLink() {

    
  }

  filterGift(){}

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
        // console.log(data);
        this.verified = data.verified;
      }
    });
  }

  getRemainingPayment(orderId) {
    this.payment.getRemainingByOrderId(orderId).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.remaining = data.remaining;

        if (this.hasSinglePaymentGift) {
          this.checkGiftValidity();
        }
      }
    });
  }
}

export class ProductAndBankTransferGifts {
  productId: number;
  orderLineId: number;
  productName: string;
  bankTransferGifts: any;
  quantity: number;
  formName: string;
}
