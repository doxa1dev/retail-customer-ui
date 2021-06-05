import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'app/core/service/payment.service';
import { OrderService } from 'app/core/service/order.service';
import { isNullOrUndefined } from 'util';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { OrderPaymentOption } from 'app/core/enum/order-payment-option.enum';
import { Title } from 'app/core/enum/title';
import { SharedService } from 'app/core/service/commom/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { isEmptyOrNullOrUndefined } from 'app/main/account/profile/_helper/helper-fn';

@Component({
  selector: 'pay-by-cheque',
  templateUrl: './pay-by-cheque.component.html',
  styleUrls: ['./pay-by-cheque.component.scss'],
})
export class PayByChequeComponent implements OnInit {
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
  disabled = false;
  methodRadio: any;
  TTPaymentInfoForm: FormGroup;
  TTPaymentRefNo: any;
  paymentRefImgUrl: any;
  storageUrl = environment.storageUrl;
  paymentRefPhotoKey: any;
  uenNumber  = environment.Uen.SG;
  CheckNullOrUndefinedOrEmpty
  // //

  paymentOption: any;
  title = Title.LEFT;
  paymentGifts: any;

  hasValidSinglePaymentGift: boolean;
  bankTransferGiftForm: FormGroup;

  //button loading
  buttonName = "Click here to complete payment";
  active: boolean = false;
  isShow: boolean = false;

  //
  bankAccountNumber= environment.companyInfo.bank_account_number;
  bankName = environment.companyInfo.bank_name; 
  payeeName = environment.companyInfo.payee_name;

  //

  order_id_tmm: number;

  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,
    private payment: PaymentService,
    private order: OrderService,
    public dialog: MatDialog,
    private sharedService: SharedService,
    private translateService: TranslateService
  ) { 
    this.activedRoute.queryParams.subscribe((param) => {
      this.orderId = param.orderId;
      this.paymentOption = param.paymentOption;
      this.orderUuid = param.uuid;
      this.order_id_tmm  = param.id_tmm
      if (param.paymentOption === OrderPaymentOption.FULL) {
        this.methodRadio = param.methodRadio;       
      }

      else if (param.paymentOption === OrderPaymentOption.DEPOSIT) {
        this.methodRadio = param.methodRadio
      }
    });

  }

  ngOnInit(): void {
    this.CheckNullOrUndefinedOrEmpty = CheckNullOrUndefinedOrEmpty;
    this.toPay = localStorage.getItem('toPay');
    this.remaining = localStorage.getItem('remaining');
    this.valueRadio = localStorage.getItem('selectPay');
    this.currency = localStorage.getItem('currency');

    this.hasValidSinglePaymentGift = localStorage.getItem('hasValidSinglePaymentGift') === 'true';

    // change 15-10 gift request
    // if (localStorage.getItem('formOrderLineBankTransferGiftArr')) {
    //   this.paymentGifts = JSON.parse(localStorage.getItem('formOrderLineBankTransferGiftArr')).formOrderLineBankTransferGiftArr;
    // }

    if (localStorage.getItem('formOrderLineSinglePaymentGiftArr')) {
      this.paymentGifts = JSON.parse(localStorage.getItem('formOrderLineSinglePaymentGiftArr')).formOrderLineSinglePaymentGiftArr;
    }

    // this.sharedService.sharedSelectPayment.subscribe(
    //   (selectPayment) => (this.valueRadio = selectPayment));

    
    // this.getOrder(this.orderId);
    this.getOrderByUuid(this.orderUuid);
    this.getPendingVerifiedPayment(this.orderId);
    this.getVerifiedPayment(this.orderId);

    this.TTPaymentInfoForm = new FormGroup({
      'payment_ref_number': new FormControl(null, Validators.required),
      // 'payment_ref_doc': new FormControl(null, Validators.required),
    });
  }

  getOrderByUuid(uuid) {
    return new Promise((resolve) => {
      this.order.getOrderByOrderUuid(uuid).subscribe((respone) => {
        if (!isNullOrUndefined(respone)) {
          this.shipping = respone.shippingFee;
          this.subTotal = respone.subtotal;
          this.toTal = respone.totalAmount;
          this.currency = respone.currency;
          if(!isEmptyOrNullOrUndefined(respone.paymentOption))
          {
            this.paymentOption = respone.paymentOption;
          }
        }
      });
    });
  }

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

  copyOrderNumber() {
    let copyText = document.getElementById('order-number');
    let orderNumber = document.createElement('textarea');
    orderNumber.value = copyText.textContent;
    document.body.appendChild(orderNumber);
    orderNumber.select();
    document.execCommand('Copy');
    orderNumber.remove();
  }

  copyAccountNumber() {
    let copyText = document.getElementById('acc-number');
    let orderNumber = document.createElement('textarea');
    orderNumber.value = copyText.textContent;
    document.body.appendChild(orderNumber);
    orderNumber.select();
    document.execCommand('Copy');
    orderNumber.remove();
  }

  copyUENNumber() {
    let copyText = document.getElementById('uen-number');
    let orderNumber = document.createElement('textarea');
    orderNumber.value = copyText.textContent;
    document.body.appendChild(orderNumber);
    orderNumber.select();
    document.execCommand('Copy');
    orderNumber.remove();
  }


  onSelectFile(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type != "image/bmp" && file.type != "image/jpeg" && file.type != "image/jpg" && file.type != "image/png") {
        return;
      }
      if (this.checkFileSize(file.size)) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          let preSignedUrl: string;
          let photoKey: string;
          this.payment.getPreSignedUrl(file.name + this.orderUuid, file.type).subscribe(response => {
            if (response.code === 200) {
              photoKey = response.key;
              preSignedUrl = response.url;
              this.payment.uploadPaymentImage(preSignedUrl, file.type, file).subscribe(
                response => {
                  this.paymentRefImgUrl = this.storageUrl + photoKey;
                }
              );
              this.paymentRefPhotoKey = photoKey;
              // return photoKey;
              // console.log(photoKey);

            }
          });
        };
      }
      else return;
    }
  }


  checkFileSize(bytes) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    if (i == 2 && parseFloat((bytes / Math.pow(k, i)).toFixed(2)) > 4.00) {
      return false;
    }
    else return true;
  }




  createPayment() {
      this.createPaymentforFullPaymentOption();

    // if (this.paymentOption === OrderPaymentOption.FULL) {
    //   this.createPaymentforFullPaymentOption();
    // }
    // else if (this.paymentOption === OrderPaymentOption.DEPOSIT) {
    //   this.createPaymentforDeposit();
    // }
  }


  createPaymentforFullPaymentOption() {
    // console.log(this.TTPaymentInfoForm.value.payment_ref_number == null && this.TTPaymentInfoForm.value.payment_ref_doc == null)
    this.isShow = true;
    if (this.TTPaymentInfoForm.invalid) {
      return;
    } else {
      this.TTPaymentRefNo = this.TTPaymentInfoForm.value.payment_ref_number;
      const formPayment = {
        order_id: this.orderId,
        payment_amount: this.toPay,
        payment_method: this.methodRadio,
        payment_gateway: this.methodRadio,
        paymentOption: this.paymentOption,
        paymentRefNo: this.TTPaymentRefNo,
        paymentPhotoKey: this.paymentRefPhotoKey,
        // bankTransferOrderLineGifts: this.paymentGifts,
        is_singlePayment: this.hasValidSinglePaymentGift,
        singlePaymentOrderLineGifts: this.paymentGifts
      };
      this.payment.checkPaynowReferencePaymentNumber(this.TTPaymentRefNo).subscribe(data=>{
        if(data.code === 200){
          this.active = true;
          this.buttonName = "Processing...";
          
          
          this.payment.createPayment(formPayment).subscribe(
            res => {
              if (res.code === 200) {
                this.payment.getRemainingByOrderId(this.orderId).subscribe(res => {
                  if (res.remaining == 0) {
                    this.updateStatusPayment();
                  }
                  else {
                    this.nextToPayDone();
                  }
                });
              }
              else {
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
            }
          );
        }else{
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message:data.data,
              title:
              "NOTIFICATION",
              colorButton: false
            },
          });
          dialogNotifi.afterClosed().subscribe(data=>{
            return ;
          })
        }
      })
      

      this.disabled = true;
    }
  }


  createPaymentforDeposit() {
    this.isShow = true;
    if (this.TTPaymentInfoForm.invalid) {
      return;
    } else {
      
      this.active = true;
      this.buttonName = "Processing...";
      this.TTPaymentRefNo = this.TTPaymentInfoForm.value.payment_ref_number;
      // console.log(this.TTPaymentRefNo);

      const formPayment = {
        order_id: this.orderId,
        payment_amount: this.toPay,
        payment_method: this.methodRadio,
        payment_gateway: this.methodRadio,
        paymentOption: this.paymentOption,
        paymentRefNo: this.TTPaymentRefNo,
        paymentPhotoKey: this.paymentRefPhotoKey
      };

      this.payment.createPayment(formPayment).subscribe(
        res => {
          // console.log(res);
          if (res.code == 200) {
            this.payment.getRemainingByOrderId(this.orderId).subscribe(res => {
              // console.log(res.remaining);
              this.remaining = res.remaining;
            });
            this.nextToPayContinue();
          }

        }
      );

      this.disabled = true;
    }
  }

  updateStatusPayment() {
    return this.order
      .updateStatus(this.orderId, 'TO_VERIFY')
      .subscribe((data) => {
        if (data.code === 200) {
          this.pendingVerified = Number(this.toPay) + Number(this.pendingVerified);
          this.toPay = 0;
          this.remaining = 0;
          this.nextToPayDone();
        } else {
          this.disabled = false;
        }
      });
  }

  // backToSelectPayment() {

  //   if(this.paymentOption===OrderPaymentOption.FULL){

  //   this.router.navigate(['/select-payment'], {
  //     queryParams: {
  //       orderId: this.orderId,
  //       uuid: this.orderUuid
  //     },
  //   });
  // }

  //   else if(this.paymentOption===OrderPaymentOption.DEPOSIT){
  //     this.router.navigate(['../deposit-payment-method'], {queryParams: {id: this.orderId, paymentOption:OrderPaymentOption.DEPOSIT}});
  //   }
  // }

  nextToPayDone() {
    localStorage.setItem('toPay', '0');

    if (this.remaining - this.toPay == 0 && this.remaining != this.toPay || this.toPay == 0) {
      this.router.navigate(['/payment-done'], {
        queryParams: {
          orderId: this.orderId,
          uuid: this.orderUuid
        },
      });
    } else {
      this.nextToPayContinue();
    }
  }

  nextToPayContinue() {
    localStorage.setItem('toPay', '0');
    this.router.navigate(['/payment-continue'], {
      queryParams: {
        orderId: this.orderId,
        paymentOption: this.paymentOption,
        uuid: this.orderUuid
      },
    });
  }

  // get static translation
  getStaticTranslation(key: string) {
    return this.translateService.getStreamOnTranslationChange(key);
  }
}

export class ProductAndSinglePaymentGifts {
  productId: number;
  orderLineId: number;
  productName: string;
  singlePaymentGifts: any;
  quantity: any;
}
