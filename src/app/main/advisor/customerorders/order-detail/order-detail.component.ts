import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Component, OnInit, OnChanges } from '@angular/core';
import { Order , OrderService} from 'app/core/service/order.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import * as jwt_decode from 'jwt-decode';
import { environment} from 'environments/environment';
import { Title } from 'app/core/enum/title';
import { ProductShippingStatus } from 'app/main/order-history/order-detail/order-detail.component';
import * as _ from 'moment';
import { OrderPaymentOption } from '../../../../core/enum/order-payment-option.enum';
import { MatDialog } from '@angular/material/dialog';
import { DialogSpecialComponent } from '../../../order-history/dialog-special/dialog-special.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  title = Title.LEFT;
  storageUrl = environment.storageUrl;
  /** listOrder */
  listOrders: Array<Order> = [];
  /** order */
  order: Order;
  /** orderId */
  orderId: number;
  /** flag Advisor */
  flagAdvisor: boolean = false;
  /** payment method */
  methodPaymentList = new Array<String>();
  trackingHosts = environment.trackingHosts;
  shipping_note: string;
  order_uuid : string;
  imageAdvisor : string
  shipping: any;
  //loading
  isManualShip: boolean;
  loading: boolean=true;
  isShowShipping: boolean;
  noHostedReasons: string;
  noUnBoxedReasons: string;
  is_buying_for_customer : boolean = false;
  is_customer_pay : boolean = false;
  shippingStatusTableData;
  displayedColumns;
  listProduct;
  is_manual_shipping : boolean = false;
  manual_shipping_note: string;
  manual_shipping_time;
  invoicePdf: string;

  paymentOption: any;
  offLineEppPaymentOption = environment.paymentOptionList.find(element => element.name === 'OFFLINE-EPP');
  onLineEppPaymentOption = environment.paymentOptionList.find(element => element.name === 'ONLINE-EPP');
  hasSinglePaymentGift: boolean;
  hasOnlineBankingGift: boolean;
  is_naep : boolean = false;
  orderUuid: any;
  id: number;
  isDepositPaid: boolean;
  depositAmount: any;
  
  constructor(
    private _location: Location,
    private router : Router,
    private orderService : OrderService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    
    this.activatedRoute.queryParams.subscribe(params =>{
      this.orderId = params.uuid;
    })
  }

  ngOnInit(): void{
    let token = localStorage.getItem('token');
    let decoded =jwt_decode(token);
    if (!CheckNullOrUndefinedOrEmpty(decoded)){
      if (decoded.role.indexOf("ADVISOR") !== -1){
        this.flagAdvisor = true;
      }
    }
    
    // this.orderId = +this.activatedRoute.snapshot.paramMap.get("id");
    this.getOrder(this.orderId);
  }

  getOrder(orderId) {
      return new Promise (resolve => {
        this.orderService.getOrderByOrderIdCustomer(orderId).subscribe(response => {
          this.order = response;
          this.listOrders.push(this.order);
          this.order_uuid = this.order.uuid;
          let methodList = [];
          this.loading = false;
          this.paymentOption = response.paymentOption;
          if (response.payment != undefined) {

            if (response.paymentOption === OrderPaymentOption.DEPOSIT) {
              response.payment.forEach(pay => {
                if (pay.paymentStatus === 'success' && Number(pay.paymentAmount) === this.depositAmount) {
                  // this.isDepositPaid = true;
                }
              });
            }

            let methodList = [];

            response.payment.forEach(element => {
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
          this.listProduct = response.listProduct;
          this.listProduct.forEach(element=>{
            this.is_naep = this.is_naep || element.is_naep_discount;
          })
          this.orderUuid = response.uuid;
          this.id = response.id;
          this.depositAmount = response.deposit_amount;
          const productWithSinglePaymentGifts = this.listProduct.find(product => !CheckNullOrUndefinedOrEmpty(product.singlePaymentGiftProducts));
          const productWithOnlineBankingGifts = this.listProduct.find(product => !CheckNullOrUndefinedOrEmpty(product.onlineBankingPaymentGiftProducts));
          this.hasSinglePaymentGift = (productWithSinglePaymentGifts) ? true : false;
          this.hasOnlineBankingGift = (productWithOnlineBankingGifts) ? true : false;
          this.is_buying_for_customer = response.is_buying_for_customer;
          this.is_customer_pay = response.is_customer_pay;
          //reason
          this.noHostedReasons = response.noHostedReasons;
          this.noUnBoxedReasons = response.noUnBoxedReasons;   
          this.isManualShip = response.shipping.isManualShipping       
          if(!CheckNullOrUndefinedOrEmpty(response.history)) {
            response.history.forEach(element => {
              if(element.shipping_method === "Manual Shipping")
              {
                this.shipping_note =  element.shipping_note ;
                if (!CheckNullOrUndefinedOrEmpty(this.shipping_note)) {
                  this.isShowShipping = true;
                } else {
                  this.isShowShipping = false;
                }
              }
            })
          }
       
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

          if (response.payment != undefined) {

            if (response.paymentOption === OrderPaymentOption.DEPOSIT) {
              response.payment.forEach(pay => {
                if (pay.paymentStatus === 'success' && Number(pay.paymentAmount) === this.depositAmount) {
                  this.isDepositPaid = true;
                }
              });
            }

            let methodList = [];

            response.payment.forEach(element => {
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

          this.listProduct = response.listProduct;
          this.shipping = response.shipping;
          if (this.shipping.shippingAgentId) {
            this.shippingStatusTableData = this.createShippingStatusTableRows(this.shipping.shippingStatus.shippingStatuses);
            this.displayedColumns = ['groupNum','trackingId'];
          }
          this.imageAdvisor = CheckNullOrUndefinedOrEmpty(this.order.advisorCustomer.profilePhotoKey) ? 'assets/icons/ICON/UserMenu.svg' : this.storageUrl + this.order.advisorCustomer.profilePhotoKey
          
        });
      });
      
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

  groupNumber : number = 0;
  productIdToNameMap
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
            !CheckNullOrUndefinedOrEmpty(status.shipmentPieceID) ? status.shipmentPieceID : this.groupNumber,
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

  /**
   * back to order history
   */
  back(){
    this._location.back();
  }

  UpdateStatus()
  {
    return this.orderService.updateStatus(this.order.id,'TO_UNBOX').subscribe()
  }
  /**
   * copy To Clipboard
   * @param item 
   */
  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  /**
   * moveToHost
   */
  moveToHost(){
    if(this.flagAdvisor){
      this.router.navigate(['/unbox'], { state: { data: this.order } });
    } else {
      this.router.navigate(['/tounbox'], { state: { data: this.order } });
    }
    
  }
  // {{storageUrl}}{{order.advisorCustomer.profilePhotoKey}}
  /**
   * Delivery By
   * @param delivery 
   */
  DeliveryBy(delivery: string){
   
    
    let deliveryTem = delivery.replace('_', ' ').replace('COURRIER', 'COURIER'); 
    // let deliveryResult = deliveryTem.toLowerCase(); 
    let splitStr = deliveryTem.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    if(delivery === 'SELF_COLLECT'){
      return splitStr.join(' ') + 'ion'
    }else{
      return splitStr.join(' '); 
    }
    
    // return deliveryResult;
  }
  moveToUnhost(){
    this.router.navigate(['/nounbox'], { state: { data: this.order } })
  }

  GoAdvisorUnbox(){
    if(this.flagAdvisor)
    {
      this.router.navigate(['/advisor-unbox'], { queryParams: {id: this.orderId} });
    }
  }
  GoAdvisorNoUnbox(){
    if (this.flagAdvisor)
    {
      this.router.navigate(['/advisor-no-unbox'], { queryParams: {uuid: this.order_uuid} })
    }
  }
  GoAdvisorHost()
  {
    if (this.flagAdvisor)
    {
      this.router.navigate(['/advisor-host'], { queryParams: {id: this.orderId} });
    }
  }
  GoAdvisorNoHost(){
    if (this.flagAdvisor)
    {
      this.router.navigate(['/advisor-no-host'], { queryParams: {uuid: this.order_uuid} })
    }
  }

  nextToInvoice(){
    this.router.navigate(["/order-detail/invoice"], { queryParams: { uuid: this.order_uuid } });
  }

  downloadInvoice() {
    this.orderService.downloadInvoice(this.order_uuid).subscribe(data=>{
      if(data){
        this.invoicePdf = data.data
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

  nextToPaymentContinue() {
    let id = this.id;

    if(environment.entity === "MY")
    {
      if (this.paymentOption === OrderPaymentOption.FULL) {
        localStorage.setItem('hasSinglePaymentGift', this.hasSinglePaymentGift.toString());
        localStorage.setItem('hasOnlineBankingGift', this.hasOnlineBankingGift.toString());
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
        this.router.navigate(["/pay-epp"], {
          queryParams: {
            id: id,
            paymentOption: this.paymentOption,
            uuid: this.orderUuid
          },
        });
      }
  
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
}
