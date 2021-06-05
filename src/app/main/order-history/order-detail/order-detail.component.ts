import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { AdvisorCustomer } from './../../../core/service/order.service';
import { element } from 'protractor';
import { Component, OnInit, OnChanges } from "@angular/core";
import { Order, OrderService } from "app/core/service/order.service";
import { Location } from "@angular/common";
import * as jwt_decode from "jwt-decode";

import { Router, ActivatedRoute } from "@angular/router";
import { isNullOrUndefined } from "util";
import { environment } from 'environments/environment';
import { Product } from 'app/core/models/product.model';
import { ShippingAgent } from 'app/core/enum/shipping-agent.enum';
import { Title } from 'app/core/enum/title';
import { OrderPaymentOption } from '../../../core/enum/order-payment-option.enum';
import { forEach, isUndefined } from 'lodash';
import { SharedService } from "app/core/service/commom/shared.service";
import { PaymentService } from 'app/core/service/payment.service';
import { wireCardIppResponseApi } from 'app/core/service/backend-api';
import * as ScriptJS from 'scriptjs';
import * as _ from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DialogSpecialComponent } from '../dialog-special/dialog-special.component';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
declare let ElasticPaymentPage;

@Component({
  selector: "app-order-detail",
  templateUrl: "./order-detail.component.html",
  styleUrls: ["./order-detail.component.scss"],
})
export class OrderDetailComponent implements OnInit {
  title = Title.LEFT_LINK;
  trackingHosts = environment.trackingHosts;

  /** listOrder */
  listOrders: Array<Order> = [];
  /** order */
  order: Order;
  isAdvisor: boolean;
  /** orderId */
  orderId: number;
  /** image advisor */
  imageAdvisor: string;
  /** method payment */
  methodPaymentList = new Array<String>();
  methodPayment: string;
  /** flag Advisor */
  flagAdvisor: boolean = false;
  isShow: boolean = false;
  //Info advisor
  cart_advisor_id: number;
  cart_advisor_name: string;
  //isShowAdvisorInfo: boolean = true;
  //shipping
  // shipping_method: string;
  // shipping_date: string;
  listProduct: Array<Product> = [];
  shipping: any;
  productIdToNameMap: any;
  shippingStatusTableData: ProductShippingStatus[];
  displayedColumns: string[];

  //payment option 
  paymentOption: any;
  depositAmount: any;
  isDepositPaid: boolean;
  orderUuid: any;
  id: number;
  isShowInfo: boolean;

  hasSinglePaymentGift: boolean;
  hasOnlineBankingGift: boolean;

  offLineEppPaymentOption = environment.paymentOptionList.find(element => element.name === 'OFFLINE-EPP');
  onLineEppPaymentOption = environment.paymentOptionList.find(element => element.name === 'ONLINE-EPP');
  total: any;

  //loading
  loading: boolean = true;
  is_manual_shipping : boolean = false;
  manual_shipping_time : string;
  manual_shipping_note
  isShowShipping: boolean;

  is_need_advisor : boolean = false;
  remark_advisor_name : string;
  remark_advisor_id : string;
  remark_advisor_phone_number: string;
  shipStatus: string;
  is_naep : boolean = false;
  is_buying_for_customer : boolean = false;
  is_customer_pay : boolean = false;
  //reason
  noHostedReasons: string;
  noUnBoxedReasons: string;
  isCheckSpecialShipping: boolean = false;
  invoicePdf: string;

  constructor(
    private _location: Location,
    private router: Router,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private paymentService: PaymentService,
    public dialog: MatDialog
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.orderId = params.uuid;
    });

  }

  ngOnInit(): void {
    this.getOrder(this.orderId);
  }

  checkPayment: boolean = false;
  getOrder(orderId) {
    return new Promise((resolve) => {
      this.orderService
        .getOrderByOrderIdCustomer(orderId)
        .subscribe((respone) => {
          // Handle Advisor Of Order
          this.is_need_advisor = respone.is_need_advisor;
          this.remark_advisor_name = respone.remark_advisor_name;
          this.remark_advisor_id = respone.remark_advisor_id;
          this.remark_advisor_phone_number = respone.remark_advisor_phone_number;
          this.shipStatus = respone.status;
          this.id = respone.id;
          this.is_buying_for_customer = respone.is_buying_for_customer;
          this.is_customer_pay = respone.is_customer_pay;
          // check method payment
          this.orderUuid = respone.uuid;
          this.paymentOption = respone.paymentOption;
          this.depositAmount = respone.deposit_amount;
          this.total = respone.totalAmount;

          //reason
          this.noHostedReasons = respone.noHostedReasons;
          this.noUnBoxedReasons = respone.noUnBoxedReasons;

          if (respone.payment != undefined) {

            if (respone.paymentOption === OrderPaymentOption.DEPOSIT) {
              respone.payment.forEach(pay => {
                if (pay.paymentStatus === 'success' && Number(pay.paymentAmount) === this.depositAmount) {
                  this.isDepositPaid = true;
                }
              });
            }

            let methodList = [];

            respone.payment.forEach(element => {
              if (!methodList.includes(element.paymentMethod) && element.paymentStatus === 'success') {
                methodList.push(element.paymentMethod);
              }
            });

            methodList.forEach(element => {

              if (element === "TT") {
                this.methodPaymentList.push("Pay by Telegraphic Transfer (TT)");
              } else if (element === "OFFICE") {
                this.methodPaymentList.push("Pay at Thermomix Office");
              } else if (element === "CREDIT_CARD") {
                this.methodPaymentList.push("Pay at Credit Card");
              } else if (element === "ONLINE_BANKING") {
                this.methodPaymentList.push("Pay at Online Banking");
              }
            });

          }
          this.listProduct = respone.listProduct;
          this.listProduct.forEach(element=>{
            this.is_naep = this.is_naep || element.is_naep_discount;
          })
 
          const productWithSinglePaymentGifts = this.listProduct.find(product => !CheckNullOrUndefinedOrEmpty(product.singlePaymentGiftProducts));
          const productWithOnlineBankingGifts = this.listProduct.find(product => !CheckNullOrUndefinedOrEmpty(product.onlineBankingPaymentGiftProducts));
          this.hasSinglePaymentGift = (productWithSinglePaymentGifts) ? true : false;
          this.hasOnlineBankingGift = (productWithOnlineBankingGifts) ? true : false;

          this.shipping = respone.shipping;
          
          if (!CheckNullOrUndefinedOrEmpty(this.shipping.specialShipping)) {
            if (!CheckNullOrUndefinedOrEmpty(this.shipping.specialShipping.sd_id)) {
              this.isCheckSpecialShipping = true;
            }
          }

          if (this.shipping.shippingAgentId && !CheckNullOrUndefinedOrEmpty(this.shipping.shippingStatus)) {
            this.shippingStatusTableData = this.createShippingStatusTableRows(this.shipping.shippingStatus.shippingStatuses);
            this.displayedColumns = ['groupNum','trackingId'];
          }

          // // check shipping method
          // if (respone.shipping.shippingMethod === "SELF_COLLECT") {
          //   this.shipping_method = "By SELF COLLECTION";
          // } else {
          //   this.shipping_method = "By COURIER";
          // }

          //check shipping note
          // if(respone.shipping.shippingMethod === '')
          // this.note_shipping = respone.shipping.customerNotes;
          
          // if (!CheckNullOrUndefinedOrEmpty(this.note_shipping)) {
          //   this.isShowShipping = true;
          // } else {
          //   this.isShowShipping = false;
          // }

          //check advisor
          if (CheckNullOrUndefinedOrEmpty(respone.advisorCustomer) ) {
            this.isShow = true;
          } else {
          
            this.cart_advisor_id = respone.advisorCustomer.advisorIdNumber;
            // this.cart_advisor_name = respone.advisorCustomer.firtName + " " + respone.advisorCustomer.lastName;
            this.cart_advisor_name = isNullOrUndefined(respone.advisorCustomer.preferredName) ? respone.advisorCustomer.firtName : respone.advisorCustomer.preferredName;
            this.imageAdvisor = isNullOrUndefined(respone.advisorCustomer.profilePhotoKey) ? 'assets/icons/ICON/UserMenu.svg' :environment.storageUrl + respone.advisorCustomer.profilePhotoKey;

          } 
              
         
          this.order = respone;

          this.order.history.forEach(element=>{
          
            if(element.shipping_method === "Manual Shipping")
            {
              this.manual_shipping_time = _(element.createdAt).format("DD-MM-YYYY hh:mm")
              this.manual_shipping_note =  element.shipping_note ;
               if (!CheckNullOrUndefinedOrEmpty(this.manual_shipping_note)) {
                  this.isShowShipping = true;
                } else {
                  this.isShowShipping = false;
                }
            }
          })
         
          this.listOrders.push(this.order);

          this.loading = false;

        });
    });

  

  }

  /**
   * back to order history
   */
  back() {
    this.router.navigate(["/order-history"]);
  }
  UpdateStatus() {
    return this.orderService
      .updateStatus(this.order.id, "TO_UNBOX")
      .subscribe((data) => {
        this.router.navigate(["/order-history"], { state: { selectTab: 4 } });
      });
  }
  /**
   * copy To Clipboard
   * @param item
   */
  copyToClipboard(item) {
    document.addEventListener("copy", (e: ClipboardEvent) => {
      e.clipboardData.setData("text/plain", item);
      e.preventDefault();
      document.removeEventListener("copy", null);
    });
    document.execCommand("copy");
  }

  DeliveryBy(delivery: string) {
    var deliveryTem = delivery.replace("_", " ");
    var deliveryResult = deliveryTem.toLowerCase();
    return deliveryResult;
  }
  GoCustomerHost() {
    this.router.navigate(["/customer-host"], { queryParams: { id: this.orderId } });
  }
  GoCustomerNoHost() {
    this.router.navigate(["/customer-no-host"], { queryParams: { uuid: this.orderUuid } });
  }
  GoCustomerUnbox() {
    // this.router.navigate(["/customer-unbox"], { state: { data: this.order } });
    this.router.navigate(["/customer-unbox"], { queryParams: { uuid: this.orderId } });
  }
  GoCustomerNoUnbox() {
    this.router.navigate(["/customer-no-unbox"], { queryParams: { uuid: this.orderUuid } });
  }

  nextToInvoice(){
    this.router.navigate(["/order-detail/invoice"], { queryParams: { uuid: this.orderUuid } });
  }

  nextToPaymentContinue() {
    let id = this.id;

    if(environment.entity === "MY")
    {
      if (this.paymentOption === OrderPaymentOption.FULL) {
        localStorage.setItem('hasSinglePaymentGift', this.hasSinglePaymentGift.toString());
        localStorage.setItem('hasOnlineBankingGift', this.hasOnlineBankingGift.toString());
        // this.router.navigate(["/payment-options"], {
        //   queryParams: {
        //     id: id,
        //     uuid: this.orderUuid
        //   },
        // });

        if (this.hasSinglePaymentGift && !this.is_naep) {
          this.router.navigate(["../extra-gift"], {
            queryParams: {
              methodRadio: 'TT',
              orderId: id,
              paymentOption: OrderPaymentOption.FULL,
              uuid: this.orderUuid
            },
          });

        } else {
          this.router.navigate(["/select-payment"], {
            queryParams: {
              orderId: id,
              uuid: this.orderUuid,
              paymentOption: OrderPaymentOption.FULL
            },
          });
        }
      }
      // else if (this.paymentOption === OrderPaymentOption.EPP && this.offLineEppPaymentOption && !this.onLineEppPaymentOption) {
      else if (this.paymentOption === OrderPaymentOption.EPP) {
        // this.router.navigate(["/offline-epp"], {
        //   queryParams: {
        //     id: id,
        //     paymentOption: this.paymentOption,
        //     uuid: this.orderUuid
        //   },
        // });


        // this.router.navigate(["/pay-epp"], {
        //   queryParams: {
        //     id: id,
        //     paymentOption: this.paymentOption,
        //     uuid: this.orderUuid
        //   },
        // });

        this.router.navigate(["/payment-options-full"], {
          queryParams: {
            id: id,
            uuid: this.orderUuid
          },
        });

      }
  
      // else if (this.paymentOption === OrderPaymentOption.EPP && !this.offLineEppPaymentOption && this.onLineEppPaymentOption) {
  
      //   let formPayment = {
      //     payment_amount: this.total,
      //     payment_method: "CREDIT_CARD",
      //     payment_gateway: "WIRECARD",
      //     verified: "",
      //     paymentOption: OrderPaymentOption.EPP,
      //     host: window.location.host,
      //     order_id: this.id,
  
      //   };
  
      //   this.paymentService.createPayment(formPayment).subscribe(response => {
      //     if (response.code === 200) {
  
      //       let formIPP = {
      //         request_id: response.data.uuid + '+' + String(this.id),
      //         amount: response.data.payment_amount,
      //         currency: response.data.payment_currency,
      //         redirect_url: wireCardIppResponseApi,
      //         cancel_redirect_url: window.location.host.includes('local') ? `http://${window.location.host}/order-detail?uuid=${this.orderUuid}` : `https://${window.location.host}/order-detail?uuid=${this.orderUuid}`
      //         // cancel_redirect_url: window.location.host.includes('local') ? `http://${window.location.host}/order-detail/${this.id}` : `https://${window.location.host}/order-detail/${this.orderId}`
      //       };
  
      //       let requestedData;
  
      //       this.paymentService.getIppData(formIPP).subscribe(res => {
      //         requestedData = res;
  
      //         ScriptJS.get(environment.wireCardIppUrl, () => {
  
      //           ElasticPaymentPage.hostedPay(requestedData);
      //         });
      //       });
      //     }
      //   });
      // }
  
      else if (this.paymentOption === OrderPaymentOption.DEPOSIT) {
  
        if (this.isDepositPaid) {
          this.router.navigate(["/installment-confirm"], {
            queryParams: {
              id: id,
              uuid: this.orderUuid
            },
          });
        }
  
        else {
          this.router.navigate(["/recurring-payment"], {
            queryParams: {
              id: id,
              paymentOption: this.paymentOption,
              uuid: this.orderUuid
            },
          });
        }
      }
  
      else if (isNullOrUndefined(this.paymentOption)) {
        this.router.navigate(["/payment-options-full"], {
          queryParams: {
            id: id,
            uuid: this.orderUuid
          },
        });
      }
    }else{

      if (!CheckNullOrUndefinedOrEmpty(this.shipping.specialShipping.sd_id)) {

        const dialogNotifi = this.dialog.open(DialogSpecialComponent, {
          width: "500px",
          data: {
            order: this.order,
            type: this.shipping.specialShipping.sd_type,
            id: this.shipping.specialShipping.sd_id,
            shipping_id: this.shipping.id
          },
        });

        dialogNotifi.afterClosed().subscribe(isCheck => {
          if (isCheck) {
            this.router.navigate(["/select-payment"], {
              queryParams: {
                orderId: id,
                uuid: this.orderUuid,
                paymentOption:"FUL"
              },
            });

          } else {
            dialogNotifi.close();
          }
        })
      } else {
        this.router.navigate(["/select-payment"], {
          queryParams: {
            orderId: id,
            uuid: this.orderUuid,
            paymentOption:"FUL"
          },
        });
      }
    }
  }


  groupNumber : number = 0;
  private createShippingStatusTableRows(shippingStatuses) {
    this.productIdToNameMap = {};
    this.listProduct.forEach(product => {
      this.productIdToNameMap[product.id] = product.productName;
    });
    const shippingStatusData = [];
    shippingStatuses.forEach(status => {
      this.groupNumber +=1;
      const productIdAndQtyArr = status.productIdAndQty;
      // const shippingLatestEvent = (status.events.length > 0) ? status.events[status.events.length - 1] : null;
      if (productIdAndQtyArr) {
        productIdAndQtyArr.forEach(obj => {
          shippingStatusData.push(new ProductShippingStatus(
            status.shipmentPieceID !== null && !isUndefined(status.shipmentPieceID) ? status.shipmentPieceID : this.groupNumber,
            status.trackingID,
            this.productIdToNameMap[obj.id],
            obj.qty,
            '',
            ''));
        });
      }
      else {
        shippingStatusData.push(new ProductShippingStatus(
          status.shipmentPieceID,
          status.trackingID,
          'N/A',
          'N/A',
          'Non-Integrated',
          'N/A'));
      }
    });

    return shippingStatusData;
  }

  checkTrackingHost() {
    const keys = Object.keys(this.trackingHosts);
    if (keys.indexOf(this.shipping.shippingStatus.shippingAgent) !== -1) {
      return true;
    }

    return false;
  }

  viewTrackingDetails(trackingId) {
    const trackingUrl = this.trackingHosts[this.shipping.shippingStatus.shippingAgent];
    return trackingUrl.replace('<TRACKING_ID>', trackingId);
  }

  changeSpecial() {
    if (!CheckNullOrUndefinedOrEmpty(this.shipping.specialShipping.sd_id)) {

      const dialogNotifi = this.dialog.open(DialogSpecialComponent, {
        width: "500px",
        data: {
          order: this.order,
          type: this.shipping.specialShipping.sd_type,
          id: this.shipping.specialShipping.sd_id,
          shipping_id: this.shipping.id
        },
      });

      dialogNotifi.afterClosed().subscribe(isCheck => {
        if (isCheck) {
          const dialogSuccesss = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: 'Update special delivery successful.',
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });
          
          dialogSuccesss.afterClosed().subscribe(data => {
            if (data) {
              dialogSuccesss.close();
            }
          });

        } else {
          dialogNotifi.close();
        }
      })
    }
  }

  downloadInvoice() {
    this.orderService.downloadInvoice(this.orderUuid).subscribe(data=>{
      if(data){
        this.invoicePdf = data.data
        // window.open(data.data)
        this.downloadDataUrlFromJavascript("invoice-pdf", this.invoicePdf)
      }else{
        return
      }
    })
  }

  downloadDataUrlFromJavascript(filename, dataUrl) {

    // Construct the 'a' element
    var link = document.createElement("a");
    link.download = filename;

    // Construct the URI
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();

    // Cleanup the DOM
    document.body.removeChild(link);
  }
}


export class ProductShippingStatus {
  pieceId: string;
  trackingId: string;
  productName: string;
  quantity: any;
  status: string;
  updatedTime: string;

  constructor(pieceId: string, trackingId: string, productName: string, quantity: any, status: string, updatedTime: string) {
    this.pieceId = pieceId;
    this.trackingId = trackingId;
    this.productName = productName;
    this.quantity = quantity;
    this.status = status;
    this.updatedTime = updatedTime;
  }
}
