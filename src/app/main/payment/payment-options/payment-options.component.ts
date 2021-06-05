import { Component, OnInit } from "@angular/core";
import { OrderService, Order } from "app/core/service/order.service";
import { resolve } from "dns";
import { isNullOrUndefined } from "util";
import { Router, ActivatedRoute } from "@angular/router";
import { formatCurrency } from "@angular/common";
import { PaymentService } from "app/core/service/payment.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { max } from "moment";
import { Title } from 'app/core/enum/title';
import { environment } from 'environments/environment';
import { CheckNullOrUndefinedOrEmpty } from "app/core/utils/common-function";

@Component({
  selector: "app-payment-options",
  templateUrl: "./payment-options.component.html",
  styleUrls: ["./payment-options.component.scss"],
})
export class PaymentOptionsComponent implements OnInit {
  pendingVerified: any;
  verified: any;
  remaining: any;
  orderData: any;
  shipping: any;
  subtotal: any;
  total: any;
  orderID: any;
  orderUuid: any;
  valueToPay: any;
  toPayFull: any;
  isDisable: boolean = true;
  payPatiall: number = 0;
  selectPay: number = 0;
  toPayForm: FormGroup;
  submitted = false;
  currency: string = "";

  valueRadio = '1';

  paymentOption: any;
  title = Title.LEFT;

  // listProduct: any;
  hasSinglePaymentGift: boolean;
  hasOnlineBankingGift: boolean;
  hasValidSinglePaymentGift: boolean;
  hasValidOnlineBankingGift: boolean;

  //button loading
  buttonName = "NEXT";
  active: boolean = false;
  isShow: boolean = false;
  loading: boolean = true;
  env = environment.entity
  constructor(
    private order: OrderService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private payment: PaymentService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    // this.currency = localStorage.getItem('currency');

    this.hasSinglePaymentGift = localStorage.getItem('hasSinglePaymentGift') === 'true';
    this.hasOnlineBankingGift = localStorage.getItem('hasOnlineBankingGift') === 'true';
    // console.log(this.hasSinglePaymentGift);
    // console.log(this.hasOnlineBankingGift);
    this.hasValidSinglePaymentGift = this.hasSinglePaymentGift;
    this.hasValidOnlineBankingGift = this.hasOnlineBankingGift;

    this.activatedRouter.queryParams.subscribe((data) => {
      this.orderID = data.id;
      this.paymentOption = data.paymentOption;
      this.orderUuid = data.uuid;
    });

    this.getOrderByUuid(this.orderUuid);
    this.getRemainingPayment(this.orderID);
    this.getPendingVerifiedPayment(this.orderID);
    this.getVerifiedPayment(this.orderID);

    this.toPayForm = this._formBuilder.group({
      inputToPay: [""],
      toPayFull: [""],
    });
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
        this.toPayForm.controls.toPayFull.setValue(this.toPayFull);
        this.toPayForm.controls.inputToPay.clearValidators();
        this.toPayForm.controls.inputToPay.setValidators([
          Validators.required,
          Validators.min(0.01),
          Validators.max(Number(this.remaining)),
          phoneNumberValidator
        ]);
        this.toPayForm.controls.inputToPay.updateValueAndValidity();

        if (this.hasSinglePaymentGift) {
          this.checkGiftValidity();
        }
      }
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

  // getOrder(orderId) {
  //   return new Promise((resolve) => {
  //     this.order.getOrderByOrderId(orderId).subscribe((response) => {
  //       if (!isNullOrUndefined(response)) {
  //         this.orderData = response;
  //         this.shipping = this.orderData.shippingFee;
  //         this.subtotal = this.orderData.subtotal;
  //         this.total = this.orderData.totalAmount;
  //         this.currency = this.orderData.currency;
  //       }
  //     });
  //   });
  // }

  getOrderByUuid(uuid) {
    return new Promise((resolve) => {
      this.order.getOrderByOrderUuid(uuid).subscribe((response) => {
        if (!isNullOrUndefined(response)) {
          this.orderData = response;
          this.shipping = response.shippingFee;
          this.subtotal = response.subtotal;
          this.total = response.totalAmount;
          this.currency = response.currency;
          // this.paymentOption = response.paymentOption;

          if (this.hasSinglePaymentGift) {
            this.checkGiftValidity();
          }
          this.loading = false
        }
      });
    });
  }

  checkGiftValidity() {
    if (Number(this.total) === Number(this.remaining)) {
      this.hasValidSinglePaymentGift = true;
      this.hasValidOnlineBankingGift = true;
    }
    else {
      this.hasValidSinglePaymentGift = false;
      this.hasValidOnlineBankingGift = false;
    }
    localStorage.setItem('hasValidSinglePaymentGift', this.hasValidSinglePaymentGift.toString());
    localStorage.setItem('hasValidOnlineBankingGift', this.hasValidOnlineBankingGift.toString());
  }

  nextToSelectPayment() {

    // if (this.valueRadio==='1') {
    //   this.sharedService.nextPayment(1);
    // else {
    //   this.sharedService.nextPayment(2);
    // }
    if (this.valueRadio === '1') {
      this.active = true;
      this.buttonName = "Processing...";

      localStorage.setItem('selectPay', '1');
      localStorage.setItem('hasOnlineBankingGift2', this.hasValidOnlineBankingGift.toString());
      localStorage.setItem('nextValuePayPartially', this.toPayForm.value.inputToPay);
      let orderId = this.orderID;

      this.router.navigate(["/select-payment"], {
        queryParams: {
          orderId: orderId,
          paymentOption: this.paymentOption,
          uuid: this.orderUuid
        },
      });
    }

    else if (this.valueRadio === '2') {

      this.isShow = true;
      if (this.toPayForm.invalid) {
        return;
      } else {
        this.active = true;
        this.buttonName = "Processing...";
        this.isShow = false;
        localStorage.setItem('multiple', 'true');
        localStorage.setItem('hasOnlineBankingGift2', false.toString());
        localStorage.setItem('nextValuePayPartially', this.toPayForm.value.inputToPay);

        let orderId = this.orderID;
    
        this.router.navigate(["/select-payment"], {
          queryParams: {
            orderId: orderId,
            paymentOption: this.paymentOption,
            uuid: this.orderUuid
          },
        });
      }
    }
  }

  // backToPaymentOption() {
  //   this.router.navigate(["/payment-options-full"], {
  //     queryParams: {
  //       id: this.orderID,
  //       paymentOption: this.paymentOption,
  //       uuid: this.orderUuid
  //     },
  //   });
  // }

  radioChangePaymentFull(value) {
    //check change Radio
    this.valueRadio = value;
    this.isDisable = true;
    this.selectPay = value;
    this.isShow = false;

    localStorage.setItem('selectPay', value.toString());

    this.toPayForm.controls.inputToPay.clearValidators();
    this.toPayForm.controls.inputToPay.updateValueAndValidity();
  }

  radioChangePaymentPartially(value) {
    //check change Radio
    this.valueRadio = value;
    this.isDisable = false;
    this.selectPay = value;
    this.isShow = false;
    this.toPayForm.controls.inputToPay.setValue('');

    localStorage.setItem('selectPay', value.toString());

    this.toPayForm.controls.inputToPay.clearValidators();
    this.toPayForm.controls.inputToPay.setValidators([
      Validators.required,
      Validators.min(0.01),
      Validators.max(Number(this.remaining)),
      phoneNumberValidator
    ]);
    this.toPayForm.controls.inputToPay.updateValueAndValidity();
  }
}

function phoneNumberValidator(paymentForm: FormControl) {
  if (
    isNaN(paymentForm.value) === false &&
    !paymentForm.value.includes(" ")
  ) {
    return null;
  }
  return { changePrice: true };
}
