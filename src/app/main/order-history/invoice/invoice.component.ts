import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from 'app/core/enum/title';
import { OrderService } from 'app/core/service/order.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
  ) { }
  title = Title.LEFT_LINK;
  uuid: string;
  env = environment.entity;
  page: number = 1;
  informationInvoice = new CustomerInfo();
  checkEaep : boolean = false;
  currency: string;
  listProduct: Array<ProductDetail> = [];
  listPayment: Array<PaymentDetail> = [];
  totalAmount: string;
  arrBank = [];
  totalPaymentSG: number;
  balance: string = '0.00';
  depositCollected : string = '0.00';
  gst: string = '123'
  instalmentRate : string ='0.00';
  handlingCharge : string ='0.00';
  issuedDate: string = '8/9/2020 12:45';
  note: string = '';
  //MY
  noOfInstalments : number = 0;
  monthlyInstalment : number = 0;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.uuid = params.uuid;
    });
    this.currency = (this.env == 'MY') ? 'RM' : 'SGD';
    this.getOrder(this.uuid);
  }

  getOrder(orderId) {
    return new Promise((resolve) => {
      this.orderService
        .getOrderByOrderIdCustomer(orderId)
        .subscribe((respone) => {
          console.log(respone)
          this.arrBank = (this.env == 'MY') ? respone.arrPaymentBank: [];
          this.checkEaep = !CheckNullOrUndefinedOrEmpty(respone.listProduct[0]) ? respone.listProduct[0].is_naep_discount : false;
          if(!CheckNullOrUndefinedOrEmpty(respone)){
            //Information table
            this.informationInvoice.orderNumber = respone.order_id_tmm;
            this.informationInvoice.orderDate = respone.createdAt;
            this.gst = formatCurrency((Number(respone.totalAmount.split(',').join("")) - (Number(respone.totalAmount.split(',').join(""))/1.07)),"en-US", " ", "code", "0.2-2");
            this.informationInvoice.shippingMethod = !CheckNullOrUndefinedOrEmpty(respone.shipping) ? respone.shipping.shippingMethod.replace('_', ' ').replace('R', '') : '';
            this.informationInvoice.advisorId = !CheckNullOrUndefinedOrEmpty(respone.advisorCustomer) ? respone.advisorCustomer.advisorIdNumber : '';
            this.informationInvoice.locationWH = !CheckNullOrUndefinedOrEmpty(respone.shipping) ? respone.shipping.shipping_location_name : '';
            if(!CheckNullOrUndefinedOrEmpty(respone.customerInformation)){
              // this.informationInvoice.name = respone.deliveryAddress.firstName + ' ' + respone.deliveryAddress.lastName;
              this.informationInvoice.name = respone.customerInformation.firstName
              this.informationInvoice.phoneNumber = '('+ respone.customerInformation.phoneDialCode + ') '+ respone.customerInformation.phoneNumber;
              this.informationInvoice.postalCode = respone.customerInformation.postalCode;
              this.informationInvoice.address = [respone.customerInformation.addressLine1,respone.customerInformation.addressLine2,respone.customerInformation.addressLine3,this.stateCode(respone.customerInformation.stateCode)].join(', ')+ ", " + this.countryCode(respone.customerInformation.countryCode);
              this.informationInvoice.email = respone.customerInformation.email;
            }
            if (!CheckNullOrUndefinedOrEmpty(respone.deliveryAddress)){
              this.informationInvoice.delivery_address =[respone.deliveryAddress.addressLine1,respone.deliveryAddress.addressLine2,respone.deliveryAddress.addressLine3,this.stateCode(respone.deliveryAddress.stateCode)].join(', ')+ ", " + this.countryCode(respone.deliveryAddress.countryCode);
              this.informationInvoice.delivery_email = respone.deliveryAddress.email;
              this.informationInvoice.delivery_phone = '('+ respone.deliveryAddress.phoneDialCode + ') '+ respone.deliveryAddress.phoneNumber;
              this.informationInvoice.delivery_name = respone.deliveryAddress.firstName
            }

            //List product table
            this.balance = formatCurrency(respone.totalAmount,"en-US", " ", "code", "0.2-2");
            this.totalAmount =  formatCurrency(respone.totalAmount,"en-US", " ", "code", "0.2-2");
            if(!this.checkEaep && !CheckNullOrUndefinedOrEmpty(respone.listProduct)){
              respone.listProduct.forEach(element => {
                let product = new ProductDetail();
                product.sku = element.sku ;
                product.quantity = element.quantity;
                product.description = element.productName;
                product.unitPrice = formatCurrency(element.price,"en-US", " ", "code", "0.2-2");
                product.amount = formatCurrency(Number(element.quantity) * Number( element.price.split(',').join("")),"en-US", " ", "code", "0.2-2");
                this.listProduct.push(product)
      
                // this.listProduct.push(product)
                if(!CheckNullOrUndefinedOrEmpty(element.orderLineSinglePaymentGifts)){
                  let single_paymt_gifts = [];
                  element.orderLineSinglePaymentGifts.forEach(gift => {
                    if (!single_paymt_gifts.includes(gift.single_paymt_gift_product_id)) {
                      single_paymt_gifts.push(gift.single_paymt_gift_product_id);
                    }
                  });
                  single_paymt_gifts.forEach(e => {
                    let itemGift = element.orderLineSinglePaymentGifts.filter(obj =>{ return obj.single_paymt_gift_product_id === e});
                    let product2 = new ProductDetail();
                    product2.sku = (!CheckNullOrUndefinedOrEmpty(itemGift[0]) && !CheckNullOrUndefinedOrEmpty(itemGift[0].product)) ? itemGift[0].product.sku : " "
                    product2.quantity = itemGift.length;
                    product2.description = (!CheckNullOrUndefinedOrEmpty(itemGift[0])) ? itemGift[0].single_paymt_gift_product_name : " "
                    product2.unitPrice = '0.00';
                    product2.amount = '0.00';
                    this.listProduct.push(product2)
                  });
                }
              });
            }else if(this.checkEaep && !CheckNullOrUndefinedOrEmpty(respone.listProduct)){
              respone.listProduct.forEach(element => {
                if(element.is_deposit || element.is_kit){
                  let product = new ProductDetail();
                  product.sku = element.sku ;
                  product.quantity = element.quantity;
                  product.description = element.productName;
                  product.remarks = (element.is_deposit) ? 'DEPOSIT' : '';
                  product.unitPrice = formatCurrency(element.promotionalListPriceNaep,"en-US", " ", "code", "0.2-2");
                  product.amount = formatCurrency(Number(element.quantity) * Number( element.promotionalPriceNaep.split(',').join("")),"en-US", " ", "code", "0.2-2");
                  this.listProduct.push(product)
      
                }
              });
            }
            //list payment table
            if(!CheckNullOrUndefinedOrEmpty(respone.payment)){
              this.totalPaymentSG = 0;
              respone.payment.forEach(item => {
                if(item.paymentStatus === 'success'){
                  let payment = new PaymentDetail();
                  // payment.type = 'DEPOSIT';
                  this.totalPaymentSG += Number(item.paymentAmount.split(',').join(""))
                  if(item.isDepositPayment === true){
                    payment.type = "DEPOSIT";
                    this.depositCollected = formatCurrency((Number(this.depositCollected.split(',').join(""))+Number(item.paymentAmount.split(',').join(""))),"en-US", " ", "code", "0.2-2");
                    this.balance = formatCurrency(Number(this.totalAmount.split(',').join("")) - Number(this.depositCollected.split(',').join("")),"en-US", " ", "code", "0.2-2") ;
                  }else {
                    payment.type = item.payment_option === 'FUL' ? 'FULL' : 'IPP';
                    this.balance = formatCurrency(Number(this.totalAmount.split(',').join("")) - Number(this.totalPaymentSG),"en-US", " ", "code", "0.2-2")
                  }
                  payment.paymentMethod = (item.paymentMethod === 'CASH') ? 'OFFICE' : payment.paymentMethod = item.paymentMethod.replace('_', ' ');
                  payment.bank = this.bank(item.paymentGateway);
                  payment.paymentReference = item.paymentReference;
                  payment.paymentAmount = formatCurrency(item.paymentAmount,"en-US", " ", "code", "0.2-2");
                  this.listPayment.push(payment);
                }
              });
            }

            if(!CheckNullOrUndefinedOrEmpty(respone.paymentInstallment)){
              this.noOfInstalments = respone.paymentInstallment.number_of_payments;
              this.monthlyInstalment = Number(this.balance)/Number(this.noOfInstalments);
            }
          }

        });
    });

  

  }

  stateCode(key){
    let state = {
      W: 'Kuala Lumpur',
      L: 'Labuan',
      F: 'Putrajaya',
      J: 'Johor',
      K: 'Kedah',
      D: 'Kelantan',
      M: 'Malacca',
      N: 'Negeri Sembilan',
      C: 'Pahang',
      A: 'Perak',
      R: 'Perlis',
      P: 'Penang',
      S: 'Sabah',
      Q: 'Sarawak',
      B: 'Selangor',
      T: 'Terengganu',
      SG: 'Singapore'
    }
    if(key in state){
      return state[key]
    }else{
      return ""
    }
  }

  countryCode(key){
    let country = {
      MY: 'Malaysia',
      SG: 'Singapore',
    }
    if(key in country){
      return country[key]
    }else{
      return ""
    }
  }

  bank(key){
    let bank = {
      IPAY88: 'IPAY88',
      '2C2P': '2C2P',
      MPGS : 'MPGS'
    }
    if(key in bank){
      return bank[key]
    }else{
      return ""
    }
  }

}

export class CustomerInfo{
  name: string;
  address: string
  postalCode: string;
  stateCountry: string;
  phoneNumber: string;
  orderNumber: string;
  orderDate: string;
  advisorId: string;
  locationWH: string;
  shippingMethod: string;
  email: string;
  delivery_address: string;
  delivery_phone: string;
  delivery_email: string;
  delivery_name: string;
}

export class ProductDetail{
  sku: string;
  quantity: number;
  description: string;
  unitPrice: string;
  amount: string;
  remarks: string;
}

export class PaymentDetail{
  type: string;
  bank: string;
  paymentMethod: string;
  paymentReference: string;
  paymentAmount: string;
}