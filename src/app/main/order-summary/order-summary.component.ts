import { shippingLocationAPI } from './../../core/service/backend-api';
import { Component, OnInit, Input } from "@angular/core";
import { CartService } from "../../core/service/cart.service";
import { OrderService, Order } from "../../core/service/order.service";
import { isNullOrUndefined } from "util";
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SharedService } from 'app/core/service/commom/shared.service';
import { CartItem } from 'app/core/models/cart.model';
import { environment } from 'environments/environment';
import { Title } from 'app/core/enum/title';
import * as jwt_decode from 'jwt-decode';
import * as moment from "moment";
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { DialogConfirmComponent } from 'app/main/common-component/dialog-confirm/dialog-confirm.component'
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pattern } from 'app/core/enum/pattern';
import { isEmpty } from 'lodash';
import { RecruitmentService } from 'app/core/service/recruitment.service';
import { CustomerInformationService } from "app/core/service/customer-information.service";

@Component({
  selector: "app-product-detail",
  templateUrl: "./order-summary.component.html",
  styleUrls: ["./order-summary.component.scss"]
})
export class OrderSummaryComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  showErrorMessage: string;
  storageUrl = environment.storageUrl;
  entity = environment.entity;
  orderId: any;
  orderUuid: any;
  subTotal = 0;
  shipping: any;
  sumTotal = 0;
  Total = 0;
  currency: string = "";
  // arrShipping = new Array();
  carArr = new Array();
  cartShop: any;
  total_product: number = 0;
  // shipping_id: number;
  cartCustomerInformation: number;
  delivery_address_id: number;
  listOrders: Array<Order> = [];
  //Info advisor
  cart_advisor_id: number;
  cart_advisor_name: string;
  profile_photo_key: string;
  //Info Delivery Address
  delivery_address_first_name: string;
  delivery_address_last_name: string;
  delivery_address_email: string;

  delivery_address_phone_dial_code: string;
  delivery_address_phone: string;
  delivery_address_line1: string;
  delivery_address_line2: string;
  delivery_address_line3: string;
  delivery_address_postal_code: string;
  delivery_address_state_code: string;
  delivery_address_country_code: string;

  //Info Customer
  info_customer_first_name: string;
  info_customer_last_name: string;
  info_customer_email: string;
  info_customer_phone_number: string;
  info_customer_phone_dial_code: string;
  // //Shipping
  // shipping_method: string;
  // shipping_date: string;
  // note_shipping: string;
  // isShowShipping: boolean;
  cartShipping: any;
  isShow: boolean = false;
  title = Title.LEFT;
  //button loading
  buttonName = "PAY";
  isSubmitRemark: boolean = true;
  active: boolean = false;
  decoded
  roleArray: [];
  token: string;

  loading: boolean = true;
  isShowBtnSubmit : boolean = false;
  isDisplayConfirmtext: boolean = false;
   isDisplayError: boolean = false;
  isSubmitSuccessfull: boolean = false;
  
  // cartId
  cartId: string;
  // translation
  lstEnTranslation: any[] = [];
  lstZhTranslation: any[] = [];
  lstMyTranslation: any[] = [];

  number_pattern = /^[0-9_\.\-\+]$/;
  shipping_location_name: string;
  is_need_advisor: boolean = false;
  is_submit_successfull : boolean = false;
  

  //naep
  productFee: any;
  productKit: any;
  naepArr = [];
  naepShipping: number = 0;
  naepSubTotal: number = 0;
  naepTotal: number = 0;
  isCheckNaep: boolean = false;
  isCheckKit: boolean;
  priceFee: number = 0;
  is_buy_for_customer : boolean = false;
  order_tmm;
  is_redemption_cart : boolean;

  //Search Advisor
  advisorName: string='';
  advisorImg: string = "assets/icons/doxa-icons/UserMenu.svg";
  advisor_name: string='';
  phoneNumberFull: string='';
  isSearchAvisor: boolean = false;
  

  constructor(private cart: CartService,
    private order: OrderService,
    private router: Router,
    private sharedService: SharedService,
    private recruitmentService : RecruitmentService,
    private activedRoute: ActivatedRoute,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private customerService: CustomerInformationService,
  ) { }

  ngOnInit(): void {

    this.token = localStorage.getItem('token');
    this.currency = localStorage.getItem('currency');
    if (!isNullOrUndefined(this.token)) {
      this.decoded = jwt_decode(this.token);
      this.roleArray = this.decoded.role;
    }
    this.shipping = localStorage.getItem('shipping')
    this.getListCart();

    this.registerForm = this.formBuilder.group({
      advisor_name: ['', Validators.required],
      advisor_id: ['', [Validators.required, Validators.pattern(pattern.phone_number)]],
      remark_phone: ['', ],
    });  
     

  }

  /**
   * get cart
   * @param cartPrice 
   */
  getListCart(): Promise<any> {
    this.subTotal = 0;
    this.sumTotal = 0;
    this.Total = 0;
    this.total_product = 0;
    this.listOrders = [];
    this.carArr = [];
    return new Promise(resolve => {
      this.cart.getCartByCustomerId().subscribe(
        respone => {
          if (!isNullOrUndefined(respone)) {

            let cartInfo = respone;
            // console.log("Thach", cartInfo)
            this.cartId = cartInfo.id;
            this.cartCustomerInformation = cartInfo.customer_information.id;
            this.is_redemption_cart = cartInfo.is_redemption_cart;
            //Advisor
            this.is_need_advisor = cartInfo.is_need_advisor;
            // console.log("TA",this.is_need_advisor)
            if (cartInfo.cart_advisor_customer_id == undefined) {
              this.isShow = true;
              this.cart_advisor_id = null;
            }
            else {
              this.cart_advisor_id = cartInfo.cart_advisor_customer_id;
              this.cart_advisor_name = !CheckNullOrUndefinedOrEmpty(cartInfo.preferred_name) ? cartInfo.preferred_name : cartInfo.cart_advisor_customer_name;
              this.profile_photo_key = isNullOrUndefined(cartInfo.profile_photo_key) ? 'assets/icons/ICON/UserMenu.svg' : environment.storageUrl + cartInfo.profile_photo_key;
            }
            //Delivery Address
            this.delivery_address_id = cartInfo.cart_delivery_address.id;
            this.delivery_address_first_name = cartInfo.cart_delivery_address.first_name;
            this.delivery_address_last_name = cartInfo.cart_delivery_address.last_name;
            this.delivery_address_email = cartInfo.cart_delivery_address.email;
            this.delivery_address_phone_dial_code = cartInfo.cart_delivery_address.phone_dial_code;
            this.delivery_address_phone = cartInfo.cart_delivery_address.phone_number;
            this.delivery_address_line1 = cartInfo.cart_delivery_address.address_line1;
            this.delivery_address_line2 = cartInfo.cart_delivery_address.address_line2;
            this.delivery_address_line3 = cartInfo.cart_delivery_address.address_line3;
            this.delivery_address_postal_code = cartInfo.cart_delivery_address.postal_code;
            this.delivery_address_state_code = cartInfo.cart_delivery_address.state_code;
            this.delivery_address_country_code = cartInfo.cart_delivery_address.country_code;

            //Info Customer
            this.info_customer_first_name = cartInfo.customer_information.first_name;
            this.info_customer_last_name = cartInfo.customer_information.last_name;
            this.info_customer_email = cartInfo.customer_information.email;
            this.info_customer_phone_dial_code = cartInfo.customer_information.phone_dial_code;
            this.info_customer_phone_number = cartInfo.customer_information.phone_number;

            //Shipping
            this.cartShipping = cartInfo.shipping;
            this.cartShop = cartInfo;

            this.productFee = cartInfo.cartItems.filter(product => product.is_fee == true);

            if (this.productFee.length != 0) {
              this.priceFee = Number(this.getPrice2(this.productFee[0]));
            }

            this.productKit = cartInfo.cartItems.filter(product => product.is_kit == true);
            this.isCheckKit = true;
         
            cartInfo.cartItems.forEach(element => {
              let cartitem = new CartItem;

              //naep
              if (element.is_naep_discount) {

                if (element.is_deposit) {

                  cartitem.id = element.id;
                  cartitem.quantity = element.quantity;
                  cartitem.has_advisor = element.has_advisor;
                  cartitem.currency_code = element.currency_code;
                  cartitem.is_naep_discount = element.is_naep_discount;
                  cartitem.is_deposit = element.is_deposit;
                  cartitem.is_fee = element.is_fee;
                  cartitem.is_kit = element.is_kit;
                  cartitem.naep_advisor_kit = element.naep_advisor_kit; 
                  cartitem.naep_discount_price = element.naep_discount_price;
                  cartitem.properties = [];
                  Object.keys(element.properties).forEach(function (key) {
                    cartitem.properties.push({ name: key, value: element.properties[key] });
                  });


                  cartitem.product_name = element.product_name;
                  cartitem.listed_price = element.listed_price;
                  cartitem.promotional_price = element.promotional_price;
                  cartitem.cover_photo_key = this.storageUrl + element.cover_photo_key;
                  cartitem.internal_discount_for = element.internal_discount_for;
                  cartitem.internal_discount_price = element.internal_discount_price
                  cartitem.internal_discount_start_time = element.internal_discount_start_time;
                  cartitem.total = element.total;
                  cartitem.max_total_discount = element.max_total_discount;
                } 
                else if (element.is_kit) {

                  if (this.isCheckKit) {
                    
                    this.isCheckKit = false;

                    cartitem.id = element.id;
                    cartitem.quantity = element.quantity;
                    cartitem.has_advisor = element.has_advisor;
                    cartitem.currency_code = element.currency_code;
                    cartitem.is_naep_discount = element.is_naep_discount;
                    cartitem.is_deposit = element.is_deposit;
                    cartitem.is_fee = element.is_fee;
                    cartitem.is_kit = element.is_kit;
                    cartitem.naep_advisor_kit = element.naep_advisor_kit; 
                    cartitem.naep_discount_price = element.naep_discount_price;
                    cartitem.properties = [];
                    Object.keys(element.properties).forEach(function (key) {
                      cartitem.properties.push({ name: key, value: element.properties[key] });
                    });
                  
                    cartitem.id = element.id;
                    cartitem.product_name = element.naep_advisor_kit.name;
                    cartitem.listed_price = this.productFee[0].listed_price;
                    cartitem.promotional_price = this.productFee[0].promotional_price;
                    cartitem.cover_photo_key = this.storageUrl + this.productFee[0].cover_photo_key;
                    cartitem.internal_discount_for = this.productFee[0].internal_discount_for;
                    cartitem.internal_discount_price = this.productFee[0].internal_discount_price
                    cartitem.internal_discount_start_time = this.productFee[0].internal_discount_start_time;
                    cartitem.total = this.productFee[0].total;
                    cartitem.max_total_discount = this.productFee[0].max_total_discount;
                  }
                } 
                else if (element.is_fee) {
                  return;
                } 

                //check naep
                this.isCheckNaep = true;

                if (!isEmpty(cartitem)) {
                  this.naepSubTotal = this.naepSubTotal + (element.quantity * Number(this.getPrice2(cartitem)));
                  this.naepTotal = this.naepSubTotal + this.naepShipping;
                }               
              } 
              //product 
              else {

                cartitem.id = element.id;
                cartitem.product_name = element.product_name;
                cartitem.quantity = element.quantity;
                this.total_product += element.quantity;
                cartitem.properties = [];
                Object.keys(element.properties).forEach(function (key) {
                  cartitem.properties.push({ name: key, value: element.properties[key] });
                });
                cartitem.listed_price = element.listed_price;
                cartitem.promotional_price = element.promotional_price;
                cartitem.has_advisor = element.has_advisor;
                cartitem.currency_code = element.currency_code;
                cartitem.cover_photo_key = this.storageUrl + element.cover_photo_key;
                cartitem.internal_discount_for = element.internal_discount_for;
                cartitem.internal_discount_price = element.internal_discount_price
                cartitem.internal_discount_start_time = element.internal_discount_start_time;
                cartitem.total = element.total;
                cartitem.max_total_discount = element.max_total_discount;
                cartitem.is_naep_discount = element.is_naep_discount;
                cartitem.is_deposit = element.is_deposit;
                cartitem.is_fee = element.is_fee;
                cartitem.is_kit = element.is_kit;
                cartitem.naep_advisor_kit = element.naep_advisor_kit; 
                cartitem.naep_discount_price = element.naep_discount_price;
                cartitem.redemption_price = element.redemption_price;
                
                // this.arrShipping.push(Number(element.shipping_fee));
                //check naep
                this.isCheckNaep = false;
              }
              
              this.carArr.push(
                cartitem
              );

              if (cartInfo.is_redemption_cart) {
                this.subTotal = this.subTotal + element.quantity * Number(cartitem.redemption_price)
                this.sumTotal = this.sumTotal + element.quantity *  Number(cartitem.redemption_price)
                this.Total = this.sumTotal;
  
              } else {
                this.subTotal = this.subTotal + element.quantity * Number(this.getPrice2(cartitem))
                this.sumTotal = this.sumTotal + element.quantity *  Number(this.getPrice2(cartitem))
                this.Total = this.sumTotal;
              }

              // get list translation of cartItem
              element.translations.forEach(translation => {
                if (translation.language_code === 'en') {
                  let obj = {};
                  obj["CartItemID"] = cartitem.id;
                  obj["Title"] = translation.translated_title;
                  this.lstEnTranslation.push(obj);
                } else if (translation.language_code === 'en') {
                  let obj = {};
                  obj["CartItemID"] = cartitem.id;
                  obj["Title"] = translation.translated_title;
                  this.lstZhTranslation.push(obj);
                } else if (translation.language_code === 'my') {
                  let obj = {};
                  obj["CartItemID"] = cartitem.id;
                  obj["Title"] = translation.translated_title;
                  this.lstMyTranslation.push(obj);
                }
              })
            });

            if (this.isCheckKit) {
              this.naepSubTotal = this.naepSubTotal + this.priceFee;
              this.naepTotal = this.naepSubTotal;
            }

            // if (this.arrShipping.indexOf(0) != -1){
            //   this.shipping = 0
            // } else {
            //   this.shipping = Math.max.apply(Math, this.arrShipping);
            // }
            this.Total = this.Total + Number(this.shipping);
            // this.currency = this.carArr[0].currency_code;

            this.loading = false;

            // object translation
            /**
              "CART": {
                "CART_ID": {
                  "CART_ITEM": {
                    "CART_ITEM_ID": {
                      "PRODUCT_TITLE": "Product Title"
                    }
                  }
                "PAY": "PAY/TR_PAY"
                }
              }
            */
          
            // set translation language
            this.translateService.getTranslation('en').subscribe(() => {
              let objEnTranslation = {
                "CART": {}
              }
              objEnTranslation["CART"][this.cartId] = {};
              objEnTranslation["CART"]["PAY"] = {};
              objEnTranslation["CART"]["PAY"] = "PAY";
              objEnTranslation["CART"][this.cartId]["CART_ITEM"] = {};
              this.lstEnTranslation.forEach(translate => {
                objEnTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]] = {};
                objEnTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]]["PRODUCT_TITLE"] = translate["Title"];
              });
              // set english langugae
              this.translateService.setTranslation('en', objEnTranslation, true);
              // console.log(objEnTranslation);

              /** --------------- */
              this.translateService.getTranslation('en').subscribe(() => {
                let objZhTranslation = {
                  "CART": {}
                }
                objZhTranslation["CART"][this.cartId] = {};
                objZhTranslation["CART"]["PAY"] = {};
                objZhTranslation["CART"]["PAY"] = "TR_PAY";
                objZhTranslation["CART"][this.cartId]["CART_ITEM"] = {};
                this.lstZhTranslation.forEach(translate => {
                  objZhTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]] = {};
                  objZhTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]]["PRODUCT_TITLE"] = translate["Title"];
                });
                // set chinese langugae
                this.translateService.setTranslation('en', objZhTranslation, true);
                // console.log(objZhTranslation);

                /** --------------- */
                this.translateService.getTranslation('my').subscribe(() => {
                  let objMyTranslation = {
                    "CART": {}
                  }
                  objMyTranslation["CART"][this.cartId] = {};
                  objMyTranslation["CART"]["PAY"] = {};
                  objMyTranslation["CART"]["PAY"] = "MY_PAY";
                  objMyTranslation["CART"][this.cartId]["CART_ITEM"] = {};
                  this.lstMyTranslation.forEach(translate => {
                    objMyTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]] = {};
                    objMyTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]]["PRODUCT_TITLE"] = translate["Title"];
                  });
                  // set malay langugae
                  this.translateService.setTranslation('my', objMyTranslation, true);
                  // console.log(objMyTranslation);
                })
              })
            })
          }
        }
      );
    });
  }
  // shipping location remain data



  // get translation
  getTranslation(cartId: string, cartItemId: string) {
    let key = 'CART.' + cartId + '.CART_ITEM.' + cartItemId + '.PRODUCT_TITLE';
    return this.translateService.getStreamOnTranslationChange(key);
  }

  // get static translation
  getStaticTranslation(key: string) {
    return this.translateService.getStreamOnTranslationChange(key);
  }

  getPrice2(cartitem: CartItem) {
    return this.checkiIsHaveInternalDiscount(cartitem) === 1 ? cartitem.naep_discount_price :
      this.checkiIsHaveInternalDiscount(cartitem) === 2 ? cartitem.internal_discount_price :
        isNullOrUndefined(cartitem.promotional_price) ? Number(cartitem.listed_price) : Number(cartitem.promotional_price)
  }
  // SubTotal() {
  //   this.carArr.forEach(cartItem => {
  //     if (cartItem.id != null) {
  //       this.subTotal = this.subTotal + Number(cartItem.promotionalPrice);
  //     }
  //   });
  // }

  // SumToTalPrice() {
  //   this.sumTotal = this.subTotal;
  // }

  get f() { return this.registerForm.controls; }

  submitRemark() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      this.isDisplayError = true;
      return;
    }
    this.cart.remarkAdvisor(this.cartId,this.registerForm.value.advisor_id,
      this.registerForm.value.advisor_name, this.registerForm.value.remark_phone).subscribe(data=>{
     
      if(data.code === 200)
      {
        this.isDisplayError = false;
        this.isShowBtnSubmit = true;
        this.isDisplayConfirmtext = true;
        this.isSubmitSuccessfull = false;
        this.is_submit_successfull = true;
      }
    })
  }

  createOrder() {
    this.submitted = true;
    // stop here if form is invalid

    if ( this.isShow && !this.isCheckNaep  && this.is_need_advisor
      && !this.isShowBtnSubmit && !this.is_submit_successfull && !this.is_redemption_cart){
       this.isSubmitSuccessfull = true;
      return 
    } 

   
    this.active = true;
    this.buttonName = "Processing...";

    if(this.isCheckNaep)
    {
      this.recruitmentService.checkInvalidPackage(this.cartId).subscribe(data=>{
        if(data.code === 200)
        { 
          this.active = true;
          this.buttonName = "PAY";

          if(data.data.is_active == true)
          {
            this.CreateOrderProcess()
          }else{
            this.buttonName = "PAY";
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'The package in your cart is no longer available and cannot be ordered. Please choose other package.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(data => {
              if (data == true) {
                this.sharedService.nextCart(0);
                this.router.navigate(['/store']);
              }
            })
          }
        }
      })
    }else{
      this.CreateOrderProcess()
    }

    

  }


  CreateOrderProcess()
  {
    this.cart.checkCartHasInActiveProduct(this.cartId, this.total_product).subscribe(data => {
      this.active = false;

      if (data.code === 200) {        
        this.createOrderAfterCheck()
      } 
      else if(data.code === 201)
      {
        this.buttonName = "PAY";
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              'The package in your cart contain inactive product. Please choose other package.',
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data => {
          if (data == true) {
            this.sharedService.nextCart(0);
            this.router.navigate(['/store']);
          }
        })
      }
      else if(data.code === 204)
      {
        this.buttonName = "PAY";
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              'We removed this product in your cart This product no longer available. Please contact admin TMM.',
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data => {
          if (data == true) {
            this.sharedService.nextCart(0);
            this.router.navigate(['/store']);
          }
        })
      }
      else if(data.code === 205)
      {
        this.buttonName = "PAY";
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
            'The product in your cart is no longer available and cannot be ordered. Please choose other products.',
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data => {
          if (data == true) {
            this.sharedService.nextCart(0);
            this.router.navigate(['/store']);
          }
        })
      }
      else if (data.code === 207) {
        this.buttonName = "PAY";
        this.getListCart();
        let listNameRemoveProduct = "";
        data.data.forEach(element => {
          listNameRemoveProduct += element.product_product_name + " ";
        })
        // Show message 
        const dialogRef = this.dialog.open(DialogConfirmComponent, {
          width: '500px',
          data: {
            message: `We removed the product ${listNameRemoveProduct} in your cart because 
          it is no longer active on store. Do you want to proceed to payment?`, type: "APPROVED"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.sharedService.nextCart(this.total_product);
            this.createOrderAfterCheck();
          } else {
            this.sharedService.nextCart(this.total_product);
            this.router.navigate(['/store']);

            // dialogRef.close();
          }
        })
        // Call Api to update cart
      } 
      else {
        this.buttonName = "PAY";

        //Show message
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              'An error occurred. Please try again later.',
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data => {
          return;
        })

      }
    })
  }



  createOrderAfterCheck() {
    let formCreateOrder = {
      advisor_customer_id: this.cart_advisor_id,
      delivery_address_id: Number(this.delivery_address_id),
      customer_information_id: Number(this.cartCustomerInformation),
      shipping_fee: this.isCheckNaep ? this.naepShipping : this.shipping,
      subtotal: this.isCheckNaep ? this.naepSubTotal : this.subTotal,
      total_amount: this.isCheckNaep ? this.naepTotal : this.Total,
      shipping_id: Number(this.cartShipping.id)
    };
    this.order.createOrder(formCreateOrder,this.is_redemption_cart).subscribe(data => {
      // console.log(data);
      if (data.code === 200) {
        // console.log(data.data);
        this.orderId = data.data.id;
        this.orderUuid = data.data.uuid;
        this.is_buy_for_customer = data.data.is_buy_for_customer;
        this.order_tmm = data.data.order_tmm;
        if(this.is_buy_for_customer == true)
        {
          this.moveToSuccess()
        }else{
          this.MoveToPaymentOption();
        }
        this.sharedService.nextCart(0);
        
      }

    });
  }

  MoveToPaymentOption() {
    if (this.entity === 'MY') {
      this.router.navigate(['/payment-options-full'], { queryParams: { id: this.orderId, uuid: this.orderUuid } });
    } else {
      this.router.navigate(['/select-payment'], { queryParams: { orderId: this.orderId, uuid: this.orderUuid} });
    }
  }

  moveToSuccess() {
    this.router.navigate(['/order-summary/checkout-success'], { queryParams: { order_tmm:  this.order_tmm  } });
  }

  checkiIsHaveInternalDiscount(product) {
    if (isNullOrUndefined(this.decoded)) {
      //Not Login
      return null;
    } else {
      if (product.is_naep_discount && product.is_deposit && !isNullOrUndefined(product.naep_discount_price)) {
        //Customer NAEP
        return 1
      } else if (isNullOrUndefined(product.internal_discount_for)) {
        //Not Has Internal Discount Product
        return 3;
      } else {
        //Check Internal Discount Product
        let isDiscount: boolean = false;
        this.roleArray.forEach(role => {
          if (product.internal_discount_for.includes(role) && (moment(new Date()).format("YYYY-MM-DD") >= moment(product.internal_discount_start_time).format("YYYY-MM-DD")) && product.total <= product.max_total_discount) {
            isDiscount = true;
          }
        })
        //3-has internal-discount
        return isDiscount ? 2 : 3;
      }
    }
  }

  searchAdvisorId(value) {
    this.isSearchAvisor = false
    if (value === '') {
      this.advisorName = '';
      this.phoneNumberFull = '';
      this.advisorImg = "./../../../assets/icons/UserMenu.svg";
      return;
    }
    this.customerService.searchAdvisorByAdvisorId(value).subscribe((data) => {
      if (!isNullOrUndefined(data)) {
        this.isSearchAvisor = true
        this.advisorName = data.advisorName;
        this.phoneNumberFull = data.phoneNumberFull
        if (!isNullOrUndefined(data.advisorPhotoKey)) {
          this.advisorImg = this.storageUrl + data.advisorPhotoKey;
        }
        else {
          this.advisorImg = "./../../../assets/icons/UserMenu.svg";
        }
      } else {
        this.advisorName = '';
        this.phoneNumberFull = '';
        this.advisorImg = "";
      }
    });
  }
}
