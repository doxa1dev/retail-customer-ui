import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { forEach } from 'lodash';
import { element } from 'protractor';
import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";
import { CartService } from "../../core/service/cart.service";
import { Cart, CartItem } from "app/core/models/cart.model";
import { resolve } from "dns";
import { Product } from "app/core/models/product.model";
import { Observable } from "rxjs";
import { isNullOrUndefined } from "util";
import { Router, NavigationExtras } from "@angular/router";
import { SharedService } from "app/core/service/commom/shared.service";
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { environment} from 'environments/environment'
import { Title } from 'app/core/enum/title';
import * as jwt_decode from 'jwt-decode';
import * as moment from "moment";
import { DialogConfirmComponent } from '../common-component/dialog-confirm/dialog-confirm.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: "shopping-bag",
  templateUrl: "./shopping-bag.component.html",
  styleUrls: ["./shopping-bag.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ShoppingBagComponent implements OnInit {
  title = Title.DOT;
  storeUrl = environment.storageUrl;
  @Input() subTotal = 0;
  arrShipping = new Array();
  @Input() shipping = 0;
  @Input() sumTotal = 0;
  @Input() Total = 0;
  @Input() currency: any;
  carArr = new Array();
  cartShop: any;
  numberProducts: Observable<number>;
  disable = false;
  total_product: number = 0;
  btnCheckOut = "CHECK OUT";
  cartDeliveryAddress: number;
  cartCustomerInformation_id: number;
  shippingID: number;
  cart_advisor_id: number;
  cart_advisor_name: number;
  cartId: number;
  maxOrder: number;
  decoded
  roleArray : [];
  token: string;
  isShowAdvisorInfo: boolean = true;
  //loading 
  loading: boolean = true;
  naepArray: any
  nomalProduct : any

  // translation
  lstEnTranslation: any[] = [];
  lstZhTranslation: any[] = [];
  lstMyTranslation: any[] = [];

  //naep
  naepShipping: number = 0;
  naepSubTotal: number = 0;
  naepTotal: number = 0;
  isCheckNaep: boolean = false;
  productFee: any;
  productKit: any;
  is_redemption_cart: boolean = false;

  constructor(
    private cart: CartService,
    private router: Router,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.token =  localStorage.getItem('token');
    if(!isNullOrUndefined(this.token))
    {
      this.decoded = jwt_decode(this.token);
      this.roleArray = this.decoded.role;
    }
    this.getListCart();
    
  }

  /**
   * get cart
   * @param cartPrice
   */
  getListCart(): Promise<any> {
    return new Promise((resolve) => {
      this.cart.getCartByCustomerId().subscribe((respone) => {
        this.loading= false;
        if (!isNullOrUndefined(respone)) {
          var cartInfo = respone;
          this.cartId = cartInfo.id;
          this.cartDeliveryAddress = cartInfo.cart_delivery_address.id;
          this.cartCustomerInformation_id = cartInfo.customer_information.id;
          this.shippingID = cartInfo.shipping.id;
           this.cart_advisor_id = cartInfo.cart_advisor_customer_id;
          this.cart_advisor_name = !CheckNullOrUndefinedOrEmpty(cartInfo.preferred_name) ? cartInfo.preferred_name : cartInfo.cart_advisor_customer_name;
          if (this.cart_advisor_id == null && this.cart_advisor_name == null) {
            this.isShowAdvisorInfo = false;
          }
          this.cartShop = cartInfo;
          this.is_redemption_cart = respone.is_redemption_cart;

          cartInfo.cartItems.forEach((element) => {
            
            let cartitem = new CartItem();
            cartitem.id = element.id;
            cartitem.product_name = element.product_name;
            cartitem.quantity = element.quantity;
            this.total_product += element.quantity;
            cartitem.properties =[] as any;
            cartitem.currency_code = element.currency_code;
            Object.keys(element.properties).forEach(function (key)
            {
              cartitem.properties.push({ name: key, value: element.properties[key]})
            });
            cartitem.listed_price = element.listed_price;
            cartitem.promotional_price = element.promotional_price;
            cartitem.has_advisor = element.has_advisor;
            cartitem.has_special_payment = element.has_special_payment;
            cartitem.shipping_fee = element.shipping_fee;
            cartitem.cover_photo_key = element.cover_photo_key;
            cartitem.max_order_number = element.max_order_number;
            cartitem.internal_discount_for = element.internal_discount_for;
            cartitem.internal_discount_price = element.internal_discount_price;
            cartitem.internal_discount_start_time = element.internal_discount_start_time;
            cartitem.total = element.total;
            cartitem.max_total_discount = element.max_total_discount;
            cartitem.is_naep_discount = element.is_naep_discount;
            cartitem.naep_discount_price = element.naep_discount_price;
            cartitem.is_deposit = element.is_deposit;
            cartitem.is_fee = element.is_fee;
            cartitem.is_kit = element.is_kit;
            cartitem.naep_advisor_kit = element.naep_advisor_kit;
            
            //naep
            if (element.is_redemption_price) {
              this.disableDecreaseButton = true;
              this.disableButton = true;
            }
            cartitem.redemption_price = element.redemption_price;

            //check naep
            if (cartitem.is_naep_discount) {
              this.isCheckNaep = true;

              if (element.is_fee || element.is_deposit) {
                this.naepSubTotal = this.naepSubTotal + (element.quantity * Number(this.getPrice2(cartitem)));
                this.naepTotal = this.naepSubTotal + this.naepShipping;
              }
            } else {
              this.isCheckNaep = false;
            }

            this.arrShipping.push(Number(element.shipping_fee));
            this.carArr.push(cartitem);

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

          // object translation
          /**
            "CART": {
              "CART_ID": {
                "CART_ITEM": {
                  "CART_ITEM_ID": {
                    "PRODUCT_TITLE": "Product Title"
                  }
            }
              }
            }
           */

          // set translation language
          this.translateService.getTranslation('en').subscribe(() => {
            let objEnTranslation = {
              "CART": {}
            }
            objEnTranslation["CART"][this.cartId] = {};
            objEnTranslation["CART"][this.cartId]["CART_ITEM"] = {};
            this.lstEnTranslation.forEach(translate => {
              objEnTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]] = {};
              objEnTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]]["PRODUCT_TITLE"] = translate["Title"];
            });
            // set english langugae
            this.translateService.setTranslation('en', objEnTranslation, true);

            /** --------------- */
            this.translateService.getTranslation('en').subscribe(() => {
              let objZhTranslation = {
                "CART": {}
              }
              objZhTranslation["CART"][this.cartId] = {};
              objZhTranslation["CART"][this.cartId]["CART_ITEM"] = {};
              this.lstZhTranslation.forEach(translate => {
                objZhTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]] = {};
                objZhTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]]["PRODUCT_TITLE"] = translate["Title"];
              });
              // set chinese langugae
              this.translateService.setTranslation('en', objZhTranslation, true);

              /** --------------- */
              this.translateService.getTranslation('my').subscribe(() => {
                let objMyTranslation = {
                  "CART": {}
                }
                objMyTranslation["CART"][this.cartId] = {};
                objMyTranslation["CART"][this.cartId]["CART_ITEM"] = {};
                this.lstMyTranslation.forEach(translate => {
                  objMyTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]] = {};
                  objMyTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]]["PRODUCT_TITLE"] = translate["Title"];
                });
                // set malay langugae
                this.translateService.setTranslation('my', objMyTranslation, true);
              })
            })
          })
          
          this.naepArray= this.carArr.filter((element)=>{
            return element.is_naep_discount === true;
          })

          this.productFee = this.naepArray.filter(product => product.is_fee === true)
          this.productKit = this.naepArray.filter(product => product.is_kit === true)


          this.nomalProduct = this.carArr.filter(element=>{
            return element.is_naep_discount === false
          })

          // this.shipping = Math.max.apply(Math, this.arrShipping);
          if (this.arrShipping.indexOf(0) != -1) {
            this.shipping = 0;
          } else {
            this.shipping = Math.max.apply(Math, this.arrShipping);
          }
          this.Total = this.Total + Number(this.shipping);
          this.currency = this.carArr[0].currency_code;
        }
      });
    });
  }

  // get translation
  getTranslation(cartId: string, cartItemId: string) {
    let key = 'CART.' + cartId + '.CART_ITEM.' + cartItemId + '.PRODUCT_TITLE';
    return this.translateService.getStreamOnTranslationChange(key);
  }

  // get static translation
  getStaticTranslation(key: string) {
    return this.translateService.getStreamOnTranslationChange(key);
  }

  getPrice(cart)
  {
  //  return isNullOrUndefined(cart.promotional_price) ? cart.listed_price : cart.promotional_price;
    return  this.checkiIsHaveInternalDiscount(cart) == 1 ? Number(cart.internal_discount_price) :  isNullOrUndefined(cart.promotional_price) ? Number(cart.listed_price) : Number(cart.promotional_price)
  }
  getPrice2(cartitem : CartItem){
    return this.checkiIsHaveInternalDiscount(cartitem) === 1 ? cartitem.naep_discount_price : 
    this.checkiIsHaveInternalDiscount(cartitem) === 2 ? cartitem.internal_discount_price :
    isNullOrUndefined(cartitem.promotional_price) ? Number(cartitem.listed_price) : Number(cartitem.promotional_price)
  }
  //delete
  removeProductCart(id) {
    this.cart.removeCartItemById(id).subscribe((respone) => {
      if (respone.code == 200) {
        var carArrRemove = this.carArr.filter(function (e) {
          return e.id === id;
        });
        if (carArrRemove.length > 0) {
          var quantity = carArrRemove[0].quantity;
          this.sharedService.sharedMessage.subscribe(
            (message) => (this.total_product = message)
          );
          this.sharedService.nextCart(this.total_product - quantity);
        }
        this.carArr = this.carArr.filter(function (e) {
          return e.id !== id;
        });
        if (this.carArr.length == 0) {
          this.cart.deleteCartByCartId(this.cartId).subscribe();
        }
        this.UpdateShipping();
        this.SubTotal();
        this.SumToTalPrice();
      }
    });
  }

    //update quantity in CartItem
    updateCartItemByQuantity(id, quantity){
     this.cart.updateCartItemByQuantity(id, quantity).subscribe((data) => {
        
        if (data.code === 200) {
          data.quantity = quantity;
          
        } 
        else if (data.code === 201 && data.message == "Product exceeds max order number.") {
          const dialogRef = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: this.translateService.instant('SHOPPING_BAG.CANNOT_ORDER') + 
                        this.maxOrder + 
                        this.translateService.instant('SHOPPING_BAG.FOR_THIS_PRODUCT'),
              title: this.translateService.instant('SHOPPING_BAG.CONFIRM'),
              colorButton: true
            },
          });
          
         }
      });
    }

  disableButton: boolean = false;
  disableDecreaseButton : boolean = false;
  IncreaseItem(cartPrice, id, quantity) {   
    this.disableButton = true;
    this.carArr.forEach((product) => {
       if(this.checkiIsHaveInternalDiscount(product) !== 2)
       {
        if (product.id == id) {
          this.cart.updateCartItemByQuantity(id, quantity).subscribe(data=>{
            if(data.code === 200)
            {
              product.quantity++
              quantity = product.quantity;
              product.total = product.total + 1;
              this.sharedService.sharedMessage.subscribe(
                (message) => (this.total_product = message)
              );
              this.sharedService.nextCart(this.total_product + 1);
              this.subTotal = this.subTotal + Number(cartPrice);
              this.Total = this.subTotal + Number(this.shipping);
              this.disableButton = false;
            }else{
                const dialogRef = this.dialog.open(CommonDialogComponent, {
                  width: "500px",
                  data: {
                    message:
                    "Cannot order more than " + product.max_order_number + " for this product.",
                    title:
                    "CONFIRM",
                    colorButton: true
                  },
                });
                this.disableButton = false;
            }
          })
        }
       }else{
        if (product.id == id) {
          if(product.total === product.max_total_discount)
          {
            const dialogRef = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: this.translateService.instant('SHOPPING_BAG.REACHED_THE_LIMIT'),
                title: this.translateService.instant('SHOPPING_BAG.CONFIRM'),
                colorButton: false
              },
            });
            this.disableButton = false;
          }else{
            this.cart.updateCartItemByQuantity(id, quantity).subscribe(data=>{
              if(data.code === 200)
              {
                product.quantity++
                quantity = product.quantity;
                product.total = product.total + 1;
                this.sharedService.sharedMessage.subscribe(
                  (message) => (this.total_product = message)
                );
                this.sharedService.nextCart(this.total_product + 1);
                this.subTotal = this.subTotal + Number(cartPrice);
                this.Total = this.subTotal + Number(this.shipping);
                this.disableButton = false;
              }else{
                  const dialogRef = this.dialog.open(CommonDialogComponent, {
                    width: "500px",
                    data: {
                      message:
                      "Cannot order more than " + product.max_order_number + " for this product.",
                      title:
                      "CONFIRM",
                      colorButton: true
                    },
                  });
                  this.disableButton = false;
              }
            })
          }
          
        }
       }
    });

  }

  /**
   * DecreaseItem
   * @param cartPrice
   * @param id
   */
  DecreaseItem(cartPrice, id, quantity) {
    this.disableDecreaseButton = true;
    this.carArr.forEach((product) => {
      if (product.id == id) {
        if (product.quantity <= 1) {
          this.disableDecreaseButton = false;
          return;
        } else {
          this.cart.updateCartItemByQuantityDescrease(product.id, quantity).subscribe(data=>{
            if(data.code === 200){
              product.quantity--;
              quantity = product.quantity;
              product.total = product.total - 1;
              this.subTotal = this.subTotal - Number(cartPrice);
              this.Total = this.subTotal + Number(this.shipping);
              this.sharedService.sharedMessage.subscribe(
                (message) => (this.total_product = message)
              );
              this.sharedService.nextCart(this.total_product - 1);
              this.disableDecreaseButton = false;
            }else{
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: data.data,
                  title:
                  "CONFIRM",
                  colorButton: true
                },
              });
              this.disableDecreaseButton = false;
            }
          })
        }
      }
    });
  }

  UpdateShipping() {
    this.arrShipping = new Array();
    this.carArr.forEach((cartItem) => {
      this.arrShipping.push(Number(cartItem.shipping_fee));
    });
    if (this.arrShipping.indexOf(0) != -1) {
      this.shipping = 0;
    } else {
      this.shipping = Math.max.apply(Math, this.arrShipping);
    }
  }

  /**
   *Remove NAEP Packet  
   */
  removeProductCartNAEP()
  {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: { message: this.translateService.instant('SHOPPING_BAG.REMOVE_NAEP_PACKAGE'), type : "REJECTED" }
      
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result === true){
        return this.cart.deleteNaep(this.cartId).subscribe(data=>{
          if(data.code === 200){ 
            this.naepArray.forEach(element=>{
              this.carArr = this.carArr.filter(product=>{
                return product.id != element.id
              })
            })
            
            let cart_number = this.total_product - this.naepArray.length;
            this.sharedService.nextCart(cart_number);
            if(cart_number === 0)
            {
              this.cart.deleteCartByCartId(this.cartId).subscribe();
            }
            this.naepArray = new Array();
            this.UpdateShipping();
            this.SubTotal();
            this.SumToTalPrice();
          }else{
            return;
          }
        })
      }else{
        dialogRef.close();
      }
    })
  }

  SubTotal() {
    this.subTotal = 0;
    this.carArr.forEach((cartItem) => {
      if (cartItem.id != null) {
        this.subTotal =
          this.subTotal +
        cartItem.quantity * Number(this.getPrice2(cartItem))
      }
    });
  }

  SumToTalPrice() {
    this.Total = this.subTotal + this.shipping;
  }

  goCheckOut() {
    this.router.navigate(["/check-out"]);
  }
  checkiIsHaveInternalDiscount(product)
  {
    if(isNullOrUndefined(this.decoded))
    {
      //Not Login
      return null;
    }else{
      if(product.is_naep_discount && product.is_deposit && !isNullOrUndefined(product.naep_discount_price)){
        //Customer NAEP
        return 1
      }else if(isNullOrUndefined(product.internal_discount_for))
      {
        //Not Has Internal Discount Product
        return 3;
      }else{
        //Check Internal Discount Product
        let isDiscount : boolean = false;
        this.roleArray.forEach(role=>{
          if(product.internal_discount_for.includes(role) && (moment(new Date()).format("YYYY-MM-DD") >= moment(product.internal_discount_start_time).format("YYYY-MM-DD") ) && product.total <= product.max_total_discount){
            isDiscount = true;
          }
        })
        //3-has internal-discount
        return isDiscount ? 2 : 3;
      }
    }

  }
  checkHasPromotionPrice(price: string)
  {
    if (isNullOrUndefined(price) || parseFloat(price) === 0)
    {
      return false
    }
    return true;
  }
}
