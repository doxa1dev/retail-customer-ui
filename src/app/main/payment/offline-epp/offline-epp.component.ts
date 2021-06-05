import { Component, OnInit, Input } from "@angular/core";
import { PaymentService } from "../../../core/service/payment.service";
import { OrderService } from "../../../core/service/order.service";
import { Router, ActivatedRoute } from "@angular/router";
import { isNullOrUndefined } from "util";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { formatCurrency } from "@angular/common";
import { SelectItem } from "primeng/api";
import { CreditCardDirectivesModule, CreditCardValidators } from 'angular-cc-library';
import { Title } from 'app/core/enum/title';

@Component({
  selector: "app-offline-epp",
  templateUrl: "./offline-epp.component.html",
  styleUrls: ["./offline-epp.component.scss"],
})
export class OfflineEppComponent implements OnInit {
  @Input() pendingVerified: any;
  @Input() verified: any;
  @Input() toPay: any;
  @Input() shipping: any;
  @Input() subTotal: any;
  @Input() total: any;
  @Input() remaining: any;
  @Input() currency: any;

  orderId: any;
  orderIDContinue: any;

  ccForm: FormGroup;

  refNo: any;
  amount: any;
  isDisable: boolean;
  orderData: any;

  bankTenures: any;

  submitted: boolean;
  title = Title.LEFT;

  banks = [
    { name: "Alliance Bank", tenure: [6, 12, 18] },
    { name: "Citibank", tenure: [6, 12, 18, 24] },
    { name: "Maybank", tenure: [6, 12] },
    { name: "Public Bank", tenure: [6, 12, 24] },
    { name: "CIMB Bank", tenure: [6,12,24] },
    { name: "Hong Leong Bank", tenure: [6, 12, 18, 24] },
    { name: "RHB", tenure: [6, 12, 18, 24] },
    { name: "OCBC", tenure: [6, 12, 18, 24] },
  ];

  isbankSelected: boolean;
  paymentOption: any;
  isTenureSelected: boolean;
  amountNeedToPayPerMonth: any;

  orderUuid: any;

  constructor(
    private paymentService: PaymentService,
    private orderService: OrderService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.currency = localStorage.getItem('currency');

    this.activatedRouter.queryParams.subscribe((data) => {
      this.orderId = data.id;
      this.paymentOption = data.paymentOption;
      this.orderUuid = data.uuid;
    });

    this.getOrder(this.orderUuid);
    this.getRemainingPayment(this.orderId);
    this.getPendingVerifiedPayment(this.orderId);
    this.getVerifiedPayment(this.orderId);

    // this.getOrderCurrency(this.orderId);

    this.ccForm = this._fb.group({
      "bank-name": ['', Validators.required],
      "tenure": ['', Validators.required],
      "card-number": ['', [Validators.required, CreditCardValidators.validateCCNumber]],
      "name-on-card": ['', Validators.required],
      "expiry-date": ['', [Validators.required, CreditCardValidators.validateExpDate]],
      "cvc-number": ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
    });
  }

  getRemainingPayment(orderId) {
    this.paymentService.getRemainingByOrderId(orderId).subscribe((data) => {
      if (!isNullOrUndefined(data)) {
        this.remaining = data.remaining;
        this.toPay = data.remaining;

      }
    });
  }

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

  getOrder(orderId) {
    return new Promise((resolve) => {
      this.orderService.getOrderByOrderId(orderId).subscribe((respone) => {
        if (!isNullOrUndefined(respone)) {
          this.orderData = respone;
          this.shipping = this.orderData.shippingFee;
          this.subTotal = this.orderData.subtotal;
          this.total = this.orderData.totalAmount;
          this.currency = this.orderData.currency;

        }
      });
    });
  }

  onSubmit() {
    console.log(this.ccForm.value);
    this.submitted = true;
    let formPayment = {
      payment_amount: this.toPay,
      payment_method: "CREDIT_CARD",
      payment_gateway: "OFFLINE_EPP",
      verified: "",
      paymentOption: this.paymentOption,
      order_id: this.orderId,
    };

    this.paymentService.createPayment(formPayment).subscribe((response) => {

      if (response.code === 200) {
        this.getOrder(this.orderId);
        this.getRemainingPayment(this.orderId);
        this.getPendingVerifiedPayment(this.orderId);
        this.getVerifiedPayment(this.orderId);
        // this.refNo = response.data.uuid + '+' + String(this.orderId);
        this.amount = response.data.payment_amount.toFixed(2);
        console.log(this.refNo);


        let formSendEmail = {
          bank_name: this.ccForm.get("bank-name").value,
          tenure: this.ccForm.get("tenure").value,
          card_number: this.ccForm.get("card-number").value,
          name_on_card: this.ccForm.get("name-on-card").value,
          expiry_date: this.ccForm.get("expiry-date").value,
          cvc_number: this.ccForm.get("cvc-number").value,
          payment_amount: this.amount,
          order_id: this.orderId,
        };

        this.paymentService
          .sendOffLineEPPEmail(formSendEmail)
          .subscribe((response) => {
            console.log(response);
            if (response.code === 200) {
              if (this.remaining === 0) {
                console.log('toverify');
                this.orderService.updateStatus(this.orderId, 'TO_VERIFY').subscribe();
              }
              this.router.navigate(["/payment-done"], {
                queryParams: {
                  // verified: this.verified,
                  // pendingVerified: this.pendingVerified,
                  // toPay: this.toPay,
                  // shipping: this.shipping,
                  // subTotal: this.subTotal,
                  // toTal: this.total,
                  // remaining: this.remaining,
                  orderId: this.orderId,
                  uuid: this.orderUuid
                },
              });
            }
          });

      }
    });
  }



  filterBank(value) {
    console.log(value);
    Object.keys(this.banks).find((bank) => {
      if (this.banks[bank].name === value) {
        this.bankTenures = this.banks[bank].tenure;
      }
    });
    this.isbankSelected = true;
  }

  filterTenure(event) {
    this.isTenureSelected = true;
    this.amountNeedToPayPerMonth = (this.remaining / Number(event.value)).toFixed(2);
  }

  backToPaymentOption() {
    this.router.navigate(["/payment-options-full"], {
      queryParams: {
        id: this.orderId,
        uuid: this.orderUuid
      },
    });
  }

  cancel() {
    this.router.navigate(["/payment-options-full"], {
      queryParams: {
        id: this.orderId,
        uuid: this.orderUuid
      },
    });
  }
}
