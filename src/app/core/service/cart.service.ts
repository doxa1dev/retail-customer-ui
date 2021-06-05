import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Injectable } from "@angular/core";
import {
  HttpErrorResponse, HttpParams, HttpClient
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { cartApi, listProductsApi, deleteCartItemApi, addCartApi, createCartApi, updateCartItemApi, deleteCartApi, checkMaximumProductApi, deleteNaepApi, updateCartItemDescreaseApi, checkCartHasInActiveProductApi, remarkAdvisorApi, getNewContactInfo, updateCartByAdvisor, updateDeliveryAddress, shippingCostByWeightApi } from "./backend-api";
import { Cart, CartItem, RemarkAdvisorInformation } from "../models/cart.model";
import { Product } from "../models/product.model";
import { Observable, throwError } from "rxjs";
import { ApiService } from './api.service';
import { isNullOrUndefined } from 'util';
import { TranslationProduct } from '../models/cart.model';
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';

@Injectable({
  providedIn: "root"
})
export class CartService {
  constructor(
    private api: ApiService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
    ) {}

  //Function get Cart By Customer Id
  getCartByCustomerId(): Observable<any> {
    let cartData = new Cart();
    let cart_items = [];
    let listSdPrice = [];

    return this.api.get(cartApi).pipe(
      map(
        (data: any) => {
          if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
          cartData.id = data.data.id;
          cartData.customer_id = data.data.customer_id;
          cartData.cart_delivery_address = data.data.delivery_address;
          cartData.customer_information = data.data.customer_information;
          cartData.customer_buy = data.data.CustomerBought;
          cartData.is_buying_for_customer = data.data.is_buying_for_customer;
          cartData.is_has_account = data.data.is_have_account;
          if(!CheckNullOrUndefinedOrEmpty(data.data.remark_advisor_id))
          { 
            let remarkAdvisorInformation = new RemarkAdvisorInformation();
            remarkAdvisorInformation.id = data.data.remark_advisor_id;
            remarkAdvisorInformation.name = data.data.remark_advisor_name;
            remarkAdvisorInformation.phone_number = data.data.remark_phone_number;
            cartData.remark_advisor = remarkAdvisorInformation;
          }
          if(!isNullOrUndefined(data.data.advisor_customer)){
            cartData.cart_advisor_customer_id =data.data.advisor_customer!=null ? data.data.advisor_customer.advisor_id_number: null ;
            cartData.cart_advisor_customer_name = data.data.advisor_customer.last_name + ' ' + data.data.advisor_customer.firt_name;
            cartData.profile_photo_key = data.data.advisor_customer.profile_photo_key;
            cartData.preferred_name = data.data.advisor_customer.preferred_name;
          }
          cartData.shipping = data.data.shipping;
          cartData.is_need_advisor = false;
          cartData.is_naep_cart = false;
          cartData.is_redemption_cart = false;
          data.data.cart_items.forEach(product => {

            let cart_item = new CartItem();
            cart_item.id = product.id;
            cart_item.product_id = product.product.id;
            cart_item.product_name = product.product.product_name;
            cart_item.quantity = product.quantity;
            cart_item.properties = product.properties;
            cart_item.listed_price = product.product.listed_price;
            cart_item.promotional_price = product.product.promotional_price;
            cart_item.has_advisor = product.product.has_advisor;
            cart_item.shipping_fee = product.product.shipping_fee;
            cart_item.has_special_payment = product.product.has_special_payment;
            cart_item.product_uri = product.product.product_uri;
            cart_item.max_order_number = product.product.max_order_number;
            cart_item.cover_photo_key = this.renderAttachment(product.product.attachments);
            cart_item.currency_code = product.product.currency_code;
            cart_item.internal_discount_for = product.product.internal_discount_for;
            cart_item.internal_discount_price = product.product.internal_discount_price;
            cart_item.internal_discount_start_time = product.product.internal_discount_start_time;
            cart_item.max_total_discount =  product.product.max_total_discount;
            cart_item.total = product.total;
            cart_item.is_naep_discount = product.is_naep_discount;
            cart_item.naep_discount_price = product.product.naep_discount_price === null ? 0 : product.product.naep_discount_price;
            cart_item.translations = this.renderTranslation(product.product.translations);
            cart_item.is_deposit = product.is_deposit;
            cart_item.is_fee = product.is_fee;
            cart_item.is_kit = product.is_kit;
            cart_item.redemption_price = product.redemption_price;
            cart_item.is_redemption_price = product.is_redemption_price;
            cart_item.is_sd_only = product.product.is_sd_only;
            cart_item.is_sd_before = product.product.is_sd_before;
            cart_item.is_sd_after = product.product.is_sd_after;
            cart_item.sd_price = product.product.sd_price;
            cart_item.product_weight = ![null, undefined, ''].includes(product.product.product_weight) ? Number(product.product.product_weight) : 0;
            cart_item.host_gift_id = product.host_gift_id;
            cart_item.naep_advisor_kit = product.naep_advisor_kit;
            cartData.is_need_advisor = cartData.is_need_advisor || product.product.has_advisor
            cartData.is_naep_cart = cartData.is_naep_cart || product.is_naep_discount;
            cartData.is_redemption_cart = cartData.is_redemption_cart || product.is_redemption_price;

            if (product.product.is_sd_after && product.product.is_sd_before) {
              cartData.sd_price = Math.max(cartData.sd_price, product.product.sd_price);
            }

            cart_items.push(cart_item);
          });

          cartData.isCheckSpecialOnly = cart_items.filter(e => e.is_sd_only == false).length === 0 ? true : false;
          cartData.isCheckSpecialBefore = cart_items.filter(e => e.is_sd_before == false).length === 0 ? true : false;
          cartData.isCheckSpecialAfter = cart_items.filter(e => e.is_sd_after == false).length === 0 ? true : false;

          cartData.cartItems = cart_items;
          return cartData;
          }
          }, (err: HttpErrorResponse) => 
          {
            if (err.error instanceof Error) {
              console.log("An error occurred:", err.error.message);
            } else {
              console.log(
                `Backend returned code ${err.status}, body was: ${err.error}`
              );
            }
          
        }
      )
    );
  }

  renderTranslation(listTranslation) {
    let translations: any[] = [];
    listTranslation.forEach(translate => {
      let translation = new TranslationProduct();
      translation.language_code = translate.language.language_code;
      translation.translated_title = translate.translated_title;
      translation.product_id = translate.product_id;
      translations.push(translation);
    })
    return translations;
  }

  /**
   * get product by product Id
   * @param productId 
   */
  getProductByProductId(productId): Observable<any> {
    let productData = new Product();
    let url = listProductsApi.replace(":id", productId);
    
    return this.api.get(url).pipe(
      map((data: any) => {
        productData.id = data.data.id;
        productData.productName = data.data.product_name;
        productData.listedPrice = data.data.listed_price;
        productData.promotionalPrice = data.data.promotional_price;
        
        return productData;
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("An error occurred:", err.error.message);
        } else {
          console.log(
            `Backend returned code ${err.status}, body was: ${err.error}`
          );
        }
      }
      )
    );
  }

  /**
   * remove product in CartItem
   * @param id 
   */  
  removeCartItemById(id){
    let url = deleteCartItemApi.replace(":id", id);
    return this.api
      .delete(url)
  }

  updateCartItemByQuantity(id, quantityCartItem){
    let url = updateCartItemApi.replace(":id", id);
    let cartQuantity = {
      quantity: quantityCartItem
    }
    return this.api.put(url, cartQuantity);
  }

  updateCartItemByQuantityDescrease(id, quantityCartItem){
    let url = updateCartItemDescreaseApi.replace(":id", id);
    let cartQuantity = {
      quantity: quantityCartItem
    }
    return this.api.put(url, cartQuantity);
  }

  /**
   * add to cart
   */
  addToCart(formCart) {
    return this.api.post(createCartApi, formCart);
  }

  /**
   * delete Cart By Cart Id
   * @param id 
   */
  deleteCartByCartId(id) {
    let url = deleteCartApi.replace(":id", id);
    return this.api.delete(url);
  }


  renderAttachment(data): string{
    let coverPhotoKey = '';
    if(!isNullOrUndefined(data) && data.length > 0)
    {
      data.forEach(element => {
        if (element.is_cover_photo === true)
        {
          coverPhotoKey = element.storage_key
      
        }
      });
    }
    return coverPhotoKey;
  }

  checkMaximumProduct(productUuid : string){
    let param = new HttpParams();
    param = param.append('productUuid', productUuid);
    return this.http.get<any>(checkMaximumProductApi, { headers: this.api.headers, params: param }).pipe(
      map((value) => {
        return value
      }), catchError(value => throwError(value))
    )
  }

  deleteNaep(cart_id){
    let param = new HttpParams();
    param = param.append('cart_id', cart_id);
    return this.http.delete<any>(deleteNaepApi, { headers: this.api.headers, params: param }).pipe(
    map((value) => {
        return value
    }), catchError(value => throwError(value))
    )
  }

  checkCartHasInActiveProduct(cart_id,total_product)
  {
    let param = new HttpParams();
    param = param.append('cart_id', cart_id);
    param = param.append('total_quantity', total_product);
    return this.http.get<any>(checkCartHasInActiveProductApi, { headers: this.api.headers, params: param }).pipe(
    map((data) => {  
      return data;
    }), catchError(data => throwError(data))
    )
  }

  remarkAdvisor(cart_id : string, remark_advisor_id : string, remark_advisor_name : string, remark_phone: string) {
    let param = new HttpParams();
    param = param.append('cart_id',cart_id)
    param = param.append('remark_advisor_id',remark_advisor_id)
    param = param.append('remark_advisor_name', remark_advisor_name)
    param = param.append('remark_phone', remark_phone)
    return this.http.post<any>(remarkAdvisorApi, '',{ headers: this.api.headers, params: param} ).pipe(
      map(data => {
        return data;
      }), catchError(data => throwError(data)) 
    )
  }

  getNewContactInfor(email : string)
  {
    let param = new HttpParams();
    param = param.append('email',email);
    return this.http.get<any>(getNewContactInfo,{headers : this.api.headers, params : param}).pipe(
      map(data =>{
        return data;
      }),catchError((error)=>{
        // let errorMessage = '';
        // if (error.error instanceof ErrorEvent) {
        //   // client-side error
        //   errorMessage = `Error: ${error.error.message}`;
        // } else {
        //   // server-side error
        //   errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        // }

        localStorage.removeItem('token')
        this.api.isEnable()
        return throwError("Error when call api.");
          }) 
        )
  }


  handleError(error) {
    
  }

  // updateCartAdvisorBuyForCustomer(data : any) : Observable<any>{
  //   if(this.api.isEnable())
  //   {
  //     return this.http.post(updateCartByAdvisor,data,{headers: this.api.headers}).pipe(
  //       map(data =>{
  //         return data;
  //       })
  //     ),catchError(data => throwError(data)) 
  //   }
  // }

  updateCartAdvisorBuyForCustomer(data : any): Observable<any>{
    
    if(this.api.isEnable())
    {
        return this.http.post(updateCartByAdvisor, data,{headers: this.api.headers}).pipe(
            map(data=>{
            return data;
            }), catchError(value => throwError(value)) 
        )
    }
  }

  updateDeliveryAddressByAdvisor(customer_id,delivery_address_id, cart_id):  Observable<any>{
    if(this.api.isEnable())
    {
      let param = new HttpParams();
      param = param.append('customer_id',customer_id)
      param = param.append('delivery_address_id',delivery_address_id)
      param = param.append('cart_id',cart_id)

        return this.http.post(updateDeliveryAddress,'',{headers: this.api.headers, params : param}).pipe(
            map(data=>{
            return data;
            }), catchError(value => throwError(value)) 
        )
    }
  }

  shippingCostByWeight(body: any): Observable<any> {
    return this.api.post(shippingCostByWeightApi, body);
  }
}



