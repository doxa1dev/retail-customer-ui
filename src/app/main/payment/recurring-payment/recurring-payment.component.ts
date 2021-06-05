import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PaymentService } from "app/core/service/payment.service";
import { OrderService } from "app/core/service/order.service";
import { isNullOrUndefined } from 'util';
import { OrderPaymentOption } from 'app/core/enum/order-payment-option.enum';
import { Title } from 'app/core/enum/title';
import { CheckNullOrUndefinedOrEmpty } from "app/core/utils/common-function";
import { CommonDialogComponent } from "app/main/common-dialog/common-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { PaymentCommon } from "../payment-common-function";

@Component({
  selector: "app-recurring-payment",
  templateUrl: "./recurring-payment.component.html",
  styleUrls: ["./recurring-payment.component.scss"],
})
export class RecurringPaymentComponent implements OnInit {
  @Input() pendingVerified: any;
  @Input() verified: any;
  @Input() toPay: any;
  @Input() shipping: any;
  @Input() subTotal: any;
  @Input() total: any;
  @Input() remaining: any;
  @Input() currency: any;


  orderId: any;
  recurringForm: FormGroup;

  refNo: any;
  isDisable: boolean;
  orderData: any;


  submitted: boolean;

  paymentOption: any;

  fixedDeposit: any;
  installmentAmount: any;

  numberOfPaymentsChosenbyCustomer: any;
  frequencyChosenByCustomer: any;

  frequencyTypes = ['Weekly', 'Monthly', 'Quarterly', 'Half-yearly', 'Yearly'];
  numberOfPayments = [6, 12, 18];

  paymentAmountForEachInstallment: any;

  orderUuid: any;
  title = Title.LEFT;
  order_id_tmm: number;
  session: string;
  token: string;
  checkLinkShare: boolean;
  apiShare: boolean;
  constructor(
    private paymentService: PaymentService,
    private orderService: OrderService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private _fb: FormBuilder,
    public dialog: MatDialog,
    private paymentCommon: PaymentCommon
  ) { }

  ngOnInit(): void {

    this.activatedRouter.queryParams.subscribe((data) => {
      this.orderId = data.id;
      this.orderUuid = data.uuid;
      this.session = data.session;
      this.getDataOrder(this.session);
    });

    // this.getOrder(this.orderUuid);
    // this.getRemainingPayment(this.orderId);
    // this.getPendingVerifiedPayment(this.orderId);
    // this.getVerifiedPayment(this.orderId);

    this.recurringForm = this._fb.group({
      "number_of_payments": ['', Validators.required],
      // "frequency": ['', Validators.required],
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
      this.getOrder(this.orderUuid);
    }
  }

  renderShareOrder(data){
    if(data == "expired"){
      this.paymentCommon.dialogExpired()
    }else{
      this.orderUuid = data.uuid;
      this.orderId = data.id;
      this.renderDataOrder(data);
    }
  }

  renderDataOrder(respone){
    if (!CheckNullOrUndefinedOrEmpty(respone)) {
      // console.log(respone)
      this.orderData = respone;
      this.shipping = this.orderData.shippingFee;
      this.subTotal = this.orderData.subtotal;
      this.total = this.orderData.totalAmount;
      this.currency = this.orderData.currency;
      this.fixedDeposit = this.orderData.deposit_amount;
      this.installmentAmount = (this.total - this.fixedDeposit);
      this.order_id_tmm = this.orderData.order_id_tmm;
      // localStorage.setItem('fixedDeposit', this.fixedDeposit);
      // localStorage.setItem('installmentAmount', this.installmentAmount);
    }
  }

  getOrder(orderUuid) {
    return new Promise((resolve) => {
      this.orderService.getOrderByOrderId(orderUuid).subscribe((respone) => {
        this.renderDataOrder(respone)
      });
    });
  }


  getRemainingPayment(orderId) {
    this.paymentService.getRemainingByOrderId(orderId).subscribe((data) => {
      if (!CheckNullOrUndefinedOrEmpty(data)) {
        this.remaining = data.remaining;
        this.toPay = data.remaining;
      }
    });
  }

  getPendingVerifiedPayment(orderId) {
    this.paymentService
      .getPendingVerifiedByOrderId(orderId)
      .subscribe((data) => {
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


  backToPaymentOption() {
    this.router.navigate(["/payment-options-full"], {
      queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? {
        id: this.orderId,
        uuid: this.orderUuid
      }: {session: this.session},
    });
  }



  radioChange(event) {
    this.numberOfPaymentsChosenbyCustomer = event.value;
    this.paymentAmountForEachInstallment = (Number(this.installmentAmount) / Number(this.numberOfPaymentsChosenbyCustomer)).toFixed(2);

  }

  onSubmit() {
    this.orderService.checkOrderHasBeenPaid(this.orderUuid).subscribe(data=>{
      if(data){
        this.changePageAfterCheck();
      }else{
        this.paymentCommon.dialogPaymentHasBeenPaid();
      }
    })
  }

  changePageAfterCheck() {

    let formCreateRecurringPayment = {
      "installment_amount": this.installmentAmount,
      "payment_method": "CREDIT_CARD",
      "payment_gateway": "IPAY88",
      "paymentOption": OrderPaymentOption.DEPOSIT,
      "number_of_payments": Number(this.numberOfPaymentsChosenbyCustomer),
      "frequency": 'Monthly',
      "order_id": this.orderId,
      "host": window.location.host
    };

    this.paymentService.createRecurringPayment(formCreateRecurringPayment , this.apiShare).subscribe(response => {
      if (response.code === 200) {
        this.router.navigate(['../deposit-payment-method'], { queryParams: CheckNullOrUndefinedOrEmpty(this.session) ? 
          { id: this.orderId, uuid: this.orderUuid, id_tmm: this.order_id_tmm } : 
          { session: this.session } });
      }
    });
  }











}
