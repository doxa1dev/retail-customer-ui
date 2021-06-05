import { element } from 'protractor';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Injectable } from '@angular/core';
import { map, catchError, tap } from 'rxjs/operators';
import {
    ordersApi, createOrderApi, getOrderByIdApi, updateOrderStatus,
    updateReasonUnboxApi, updateReasonHostApi, ordersAdvisorApi, updateOrderPaymentOptionApi,
    getOrderByUuid , countOrderAdvisor , countOrderCustomer,
    updateNoUnboxNoHostReasonApi,
    updateUnboxHostQRApi, DownloadInvoiceApi,
    createOrderRedemptionApi, updateSpecialShippingApi, shareLinkApi, CreateshareLinkApi, UpdateStatusShareLinkApi, UpdatePaymentOptionShareLinkApi, CheckOrderPaymentApi, GetOrderAfterPaymentApi, DataShareForCustomerTMMApi, HostGiftApi, GetAllHostGiftApi, saveActivityImageApi
} from './backend-api';
import { ApiService } from './api.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { Product, TranslationProduct } from '../models/product.model';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse, HttpParams, HttpClient } from '@angular/common/http';
import { Cart } from '../models/cart.model';
import { Translation } from '../models/category.model';
import { isEmpty, forEach } from 'lodash';
import { SpecialDelivery } from '../models/shipping.model';
import * as moment from 'moment';
import { OrderRedeem } from '../models/order.model';
import { formatDate } from '@angular/common';
import { PROPERTY } from 'app/main/product-detail/product-detail.component';
moment.locale('en');

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(
        private api: ApiService,
        private http: HttpClient
    ) { }

    /**
     * get list Category
     */
    getOrderList(flagAdvisor , status , searchText, page, limit): Observable<any> {
        let url: string;
        if (flagAdvisor) {
            url = ordersAdvisorApi; 
        } else {
            url = ordersApi;
        }
        
        let param = new HttpParams();
        if(!CheckNullOrUndefinedOrEmpty(status) && status !== 'ALL'){
            param = param.append('status', status);
        }

        if(!CheckNullOrUndefinedOrEmpty(page)){
            param = param.append('page', page);
        }

        if(!CheckNullOrUndefinedOrEmpty(limit)){
            param = param.append('limit', limit);
        }

        if (searchText && (status && status === 'ALL')) {
            param = param.append('searchField', searchText);
        }

        if(this.api.isEnable()){
            return this.http.get<any>(url,{ headers: this.api.headers, params: param }).pipe(
                map((value :any[])=>{
                    let result = this.renderDataListOrder(value);
                    return result;
                }), catchError(value => throwError(value))
            )
        }
        // return this.api.get(url).pipe(
        //     map((value: any[]) => {
        //         var result = this.renderDataListOrder(value);
        //         return result;
        //     }), catchError(value => throwError(value))
        // );
    }

    /**
     * get Order By Order Id
     * @param orderId 
     */
    getOrderByOrderIdCustomer(orderId): Observable<any> {
        let url = getOrderByIdApi.replace(":id", orderId);
        return this.api.get(url).pipe(
            map((value) => {
                let result = this.renderDataOrder(value);
                return result;
            }), catchError(value => throwError(value))
        );
    }

    /**
     * Count order of Advisor
     */
    countOrderOfAdvisor(): Observable<any>{
        return this.api.get(countOrderAdvisor).pipe(
            map(data=>{
                if(data.code === 200){
                    return data.data
                }               
            }), catchError(value => throwError(value))
        )
    }

    /**
     * Count order of Customer
     */
    countOrderOfCustomer(): Observable<any>{
        return this.api.get(countOrderCustomer).pipe(
            map(data=>{
                if(data.code === 200){
                    return data.data
                }               
            }), catchError(value => throwError(value))
        )
    }

    getOrderByOrderUuid(orderUuid): Observable<any> { 
        let param = new HttpParams();
        if (!CheckNullOrUndefinedOrEmpty(orderUuid)) {
            param = param.append('uuid', orderUuid);

            if (this.api.isEnable()) {
                return this.http.get<any>(getOrderByUuid, { headers: this.api.headers, params: param }).pipe(
                    map((value) => {
                        // console.log(value)
                        if (value.code === 200) { 
                            let order = new Order();
                            order.uuid = value.data.uuid;
                            order.paymentOption = value.data.payment_option;
                            order.subtotal = value.data.subtotal;
                            order.totalAmount = value.data.total_amount;
                            order.shippingFee = value.data.shipping_fee;
                            order.singlePaymentGiftProducts = [];
                            order.order_id_tmm = value.data.order_id_tmm;
                            order.is_buying_for_customer = value.data.is_buying_for_customer;
                            order.is_naep_order = false;
                            order.isRedemptionPrice = false;
                            order.id = value.data.id;
                            let orderCustomer = new CustomerOrder();
                            orderCustomer.is_anomynous_account = value.data.customer.is_anomynous_account;
                            orderCustomer.first_name = value.data.customer.firt_name;
                            orderCustomer.email = value.data.customer.email;
                            orderCustomer.phone_number = value.data.customer.phone_number;
                            orderCustomer.phone_dial_code = value.data.customer.phone_dial_code ;
                            orderCustomer.uuid = value.data.customer.public_id
                            order.customer_order = orderCustomer;
                           // order.area_code = value.data.shipping.shippinglocation.area_code
                            if (!CheckNullOrUndefinedOrEmpty(value.data.shipping.SpecialDelivery)) {
                                order.isCheckSdOnly = (value.data.shipping.SpecialDelivery.sd_type === 'SD_ONLY' || value.data.shipping.SpecialDelivery.sd_type === 'SD_ONLY_LATER') ? true : false;
                            } else {
                                order.isCheckSdOnly = true;
                            }

                            let listNameProduct = '';
                            if(value.data.order_items !== null && value.data.order_items !== undefined && value.data.order_items.length > 0){
                                order.currency = value.data.order_items[0].currency_code;
                                // value.data.order_items.foe
                                // order.allow_epp_payment = value.data.order_items[0].product.allow_epp_payment;
                                value.data.order_items.forEach(element => {
                                    if(!CheckNullOrUndefinedOrEmpty(element.product.single_paymt_gifts)){
                                        order.singlePaymentGiftProducts.push(element.product.single_paymt_gifts)
                                    }
                                    order.is_naep_order = order.is_naep_order || element.is_naep_discount
                                    order.isRedemptionPrice = order.isRedemptionPrice || element.is_redemption_price;
                                    if(!CheckNullOrUndefinedOrEmpty(element.host_gift_id)){
                                        order.order_host_gift = true;
                                    }
                                });
                                value.data.order_items.forEach((element,index)=>{
                                    if(index === (value.data.order_items.length -1)){
                                        if(element.quantity <= 1)
                                        {
                                            listNameProduct += `${element.product_name}`;
                                        }else{
                                            listNameProduct += `${element.quantity} x ${element.product_name}`;
                                        }
                                    }else{
                                        if(element.quantity <= 1)
                                        {
                                            listNameProduct += `${element.product_name}, `
                                        }else{
                                            listNameProduct += `${element.quantity} x ${element.product_name}, `;
                                        }
                                    }
                                })
                                order.listName = listNameProduct;
                            }


                            order.listProduct = this.renderDataProduct(value.data)
                            order.deliveryAddress = this.renderDeliveryAddress(value.data.delivery_address);
                            order.customerInformation = this.renderCustomerInformation(value.data.customer_information)
                            order.advisorCustomer = this.renderAdvisor(value.data.advisor_customer)
                            order.shipping = this.renderShipping(value.data.shipping);
                            let deposit_amount = 0;
                            order.order_combination_cart =  !CheckNullOrUndefinedOrEmpty(order.listProduct.find(e=>{return e.cart_combination})) ? true : false;
                            
                            if(order.order_combination_cart || order.order_host_gift){
                                let checkEPP =  order.listProduct.find(e=>{return e.allow_epp_payment});
                                order.allow_epp_payment = !CheckNullOrUndefinedOrEmpty(checkEPP) ? true : order.listProduct[0].allow_epp_payment;
                                order.listProduct.forEach(product => {
                                    deposit_amount = deposit_amount +  ( product.allow_recurring_payment ? Number(product.deposit_amount) : Number(product.price));
                                });
                            }else{
                                order.allow_epp_payment = order.listProduct[0].allow_epp_payment;
                                order.listProduct.forEach(product => {
                                    if (product.deposit_amount) {
                                        deposit_amount = deposit_amount + product.deposit_amount;
                                    }
                                });
                            }
                            order.deposit_amount = deposit_amount;
                            order.dataSummary = this.renderDataOrder(value);

                            return order;
                        }
                    }), catchError(value => throwError(value))
                );
            }
        }
    }

    /**
     * 
     * @param reason 
     * @param flag : flag 1: update unbox
     *               flag 2 : update ship
     */
    updateReason(reason, orderId, flag): Observable<any> {
        let url: string;
        if (flag === true) {
            url = updateReasonUnboxApi.replace(":id", orderId);
        } else {
            url = updateReasonHostApi.replace(":id", orderId);
        }
        let param = {
            reasons: reason
        };
        return this.api.put(url, param).pipe(
            map((value) => {
            }), catchError(value => throwError(value))
        );
    }

    /**
     * render Data Orders
     * @param data 
     */
    renderDataListOrder(data) {
        let listOrders = new Array<Order>();
        if (data.code === 200 && data.data.length > 0) {
            data.data.forEach(ord => {
                let order = new Order();
                order.order_id_tmm = ord.order_id_tmm;
                order.id = ord.id;
                order.uuid = ord.uuid;
                order.customerId = ord.customer_id;
                order.isDeleted = ord.is_deleted;
                order.subtotal = ord.subtotal;
                order.shippingFee = ord.shipping_fee;
                order.tax = ord.tax;
                order.createdAt = ord.created_at;
                order.updatedAt = ord.updated_at;
                order.advisorCustomer = this.renderAdvisor(ord.advisor_customer);
                order.entityId = ord.entity_id;
                order.totalAmount = ord.total_amount;
                order.shipping = this.renderShipping(ord.shipping);
                order.listProduct = this.renderDataProduct(ord);
                order.deliveryAddress = this.renderDeliveryAddress(ord.delivery_address);
                order.customerInformation = this.renderCustomerInformation(ord.customer_information);
                order.history = this.renderOrderHistory(ord.histories);
                order.payment = this.renderOrderPayment(ord.payments , order.order_id_tmm , ord.payment_option );
                order.currency = !isNullOrUndefined(ord.order_items) && ord.order_items.length > 0 ? ord.order_items[0].product.currency_code : "SGD";
                order.is_buying_for_customer = ord.is_buying_for_customer;
                order.is_customer_pay = ord.is_customer_pay

                let arr = ord.status.split("_");
                arr = arr.map(x => x.toLowerCase());
                arr = arr.map(x => x.replace(x.charAt(0), x.charAt(0).toUpperCase()));
                order.status = arr.join(" ");

                listOrders.push(order);
            });
            return listOrders;
        }
    }

    /**
     * render Data Orders
     * @param data 
     */
    renderDataOrder(data) {
        if (data.code === 200 && !isNullOrUndefined(data.data)) {
            let order = new Order();
      
            order.order_id_tmm = data.data.order_id_tmm;
            order.uuid = data.data.uuid;
            order.id = data.data.id;
            order.customerId = data.data.customer_id;
            order.isDeleted = data.data.is_deleted;
            order.subtotal = data.data.subtotal;
            order.shippingFee = data.data.shipping_fee;
            order.tax = data.data.tax;
            order.createdAt = data.data.created_at;
            order.updatedAt = data.data.updated_at;
            order.advisorCustomer = this.renderAdvisor(data.data.advisor_customer);
            order.entityId = data.data.entity_id;
            order.status = data.data.status;
            order.totalAmount = data.data.total_amount;
            order.shipping = this.renderShipping(data.data.shipping);
            order.listProduct = this.renderDataProduct(data.data);
            order.deliveryAddress = this.renderDeliveryAddress(data.data.delivery_address);
            order.customerInformation = this.renderCustomerInformation(data.data.customer_information);
            order.history = this.renderOrderHistory(data.data.histories);
            order.payment = this.renderOrderPayment(data.data.payments, data.data.order_id_tmm , data.data.payment_option);
            order.paymentInstallment = data.data.paymentInstallment;
            order.arrPaymentBank = this.renderPaymentBank(order.order_id_tmm , data.data.payments);
            order.is_need_advisor =  false;

            order.remark_advisor_name = data.data.remark_advisor_name;
            order.remark_advisor_id = data.data.remark_advisor_id;
            order.remark_advisor_phone_number = data.data.remark_phone_number;
            order.currency = data.data.order_items[0].currency_code;
            order.paymentOption = data.data.payment_option;
            order.is_buying_for_customer = data.data.is_buying_for_customer;
            order.is_customer_pay = data.data.is_customer_pay;
            let deposit_amount = 0;
            order.listProduct.forEach(product=>{
                order.is_need_advisor = order.is_need_advisor || product.hasAdvisor;
                if (product.deposit_amount) {
                    deposit_amount = deposit_amount + product.deposit_amount;
                    // console.log(product.deposit_amount);
                }
                if(product.cart_combination){
                    order.order_combination_cart = true;
                }
            })
            order.deposit_amount = deposit_amount;

            order.noHostedReasons = data.data.no_hosted_reasons;
            order.noUnBoxedReasons = data.data.no_unboxed_reasons;
            if(order.order_combination_cart){
                order.hasSpecialPayment = !CheckNullOrUndefinedOrEmpty(order.listProduct.find(e=>{return e.hasSpecialPayment})) ? true : false;
                order.allow_epp_payment = !CheckNullOrUndefinedOrEmpty(order.listProduct.find(e=>{return e.allow_epp_payment})) ? true : false;
                order.allow_recurring_payment = !CheckNullOrUndefinedOrEmpty(order.listProduct.find(e=>{return e.allow_recurring_payment})) ? true : false;
            }else{
                order.hasSpecialPayment = order.listProduct[0].hasSpecialPayment;
                order.allow_epp_payment = order.listProduct[0].allow_epp_payment;
                order.allow_recurring_payment = order.listProduct[0].allow_recurring_payment;
            }
            order.warrantyInfo = [];
            if (data.data.warrantyProduct && data.data.warrantyProduct.length > 0) {
                data.data.warrantyProduct.forEach((element) => {
                    let product = new WarrantyProduct();
                    product.productName = element.product ? (element.product.product_name || "") : "";
                    product.serialNumber = element.serial_number || "";
                    product.warrantyDuration = element.warranty_duration_in_days || 0;
                    let arr = (element.status || "").split(" ");
                    arr = arr.map(x => x.toLowerCase());
                    arr = arr.map(x => x.replace(x.charAt(0), x.charAt(0).toUpperCase()));
                    product.status = arr.join(" ");
                    product.startDate = element.warranty_start_date ? moment(new Date(element.warranty_start_date)).format('DD/MM/YYYY') : "";
                    product.endDate = element.warranty_end_date ? moment(new Date(element.warranty_end_date)).format('DD/MM/YYYY') : "";

                    order.warrantyInfo.push(product);
                })
            }

            return order;
        }
    }

    renderPaymentBank(orderId, payment){
        let arrBank = [];
        if(!CheckNullOrUndefinedOrEmpty(payment)){
          payment.forEach(element => {
            if(element.payment_status === 'success' && !CheckNullOrUndefinedOrEmpty(element.payment_response)){
    
              let bank = new CardBank();
              bank.acct = element.payment_response.CCNo;
              bank.auth = element.payment_response.AuthCode;
              bank.refNo = `${element.uuid}+${orderId}`;
              let strFirst = (!CheckNullOrUndefinedOrEmpty(element.payment_response.CCNo)) ? element.payment_response.CCNo.substr(0,1): '';
              if(strFirst === '5'){
                bank.cardType = 'MASTERCARD';
              }else if(strFirst === '4'){
                bank.cardType = 'VISA';
              }else if(strFirst === '3'){
                bank.cardType = 'AMERICAN EXPRESS';
              }else{
                bank.cardType = 'UNKNOWN'
              }
    
              arrBank.push(bank);
            }
          });
        }
        return arrBank;
      }

    /**
     * render Data Product
     * @param listProduct 
     */
    renderDataProduct(order) {
        let orderProducts = [];
        let isCheckKit: boolean = true;

        if (order.order_items.length > 0) {

            let productFee = order.order_items.filter(product => product.is_fee == true);
            order.order_items.forEach(pro => {

                let product = new Product();
                // product.id = pro.product_reference_id;

                if (pro.is_kit || pro.is_fee) {

                    if (pro.is_kit) {

                        if (isCheckKit) { 

                            isCheckKit = false;
                            product.id = pro.product.id;
                            product.orderLineId = pro.id;
                            product.productUri = pro.product_uri;
                            product.isActive = pro.is_active;
                            product.productName = pro.naep_advisor_kit.name;
                            product.productDescription = pro.product_description;
                            product.sku = pro.sku;
                            product.price = productFee[0].price;
                            product.tax = pro.tax;
                            product.listedPrice = productFee[0].product.listed_price;
                            product.promotionalPrice = productFee[0].product.promotional_price;
                            product.promotionalPriceNaep = productFee[0].price;
                            product.promotionalListPriceNaep = !CheckNullOrUndefinedOrEmpty(productFee[0].product) ? productFee[0].product.listed_price : '';
                            product.currencyCode = productFee[0].product.currency_code;
                            product.hasAdvisor = pro.product.has_advisor;
                            product.termsAndConditionsLink = pro.terms_and_conditions_link;
                            product.cover_photo_key = this.renderAttachment(productFee[0].product.attachments);
                            product.quantity = pro.quantity;
            
                            product.hasSpecialPayment = pro.product.has_special_payment;
                            product.allow_epp_payment = pro.product.allow_epp_payment;
                            product.allow_recurring_payment = pro.product.allow_recurring_payment;
                            product.deposit_amount =productFee[0].quantity * (productFee[0].product.deposit_amount);
            
                            //naep
                            product.is_naep_discount = pro.is_naep_discount;
                            product.is_deposit = pro.is_deposit;
                            product.is_kit = pro.is_kit;
                            product.is_fee = pro.is_fee;
                            product.naep_advisor_kit = pro.naep_advisor_kit;
            
                            product.properties = [];
                            if (!CheckNullOrUndefinedOrEmpty(pro.properties)) {
                                Object.keys(pro.properties).forEach(function (key) {
                                    product.properties.push({ name: key, value: pro.properties[key] });
                                });
                            }
            
                            if (!CheckNullOrUndefinedOrEmpty(order.advisor_customer)) {
                                product.advisorId = order.advisor_customer.id;
                                product.advisorFirtName = order.advisor_customer.firt_name;
                                product.advisorLastName = order.advisor_customer.last_name;
                                product.advisorIdNumber = order.advisor_customer.advisor_id_number;
                                product.preferredName = !CheckNullOrUndefinedOrEmpty(order.advisor_customer.preferred_name) ? order.advisor_customer.preferred_name : order.advisor_customer.firt_name;
                            }
            
                            product.onlineBankingPaymentGiftProducts = [];
                            product.singlePaymentGiftProducts = [];
                            if (!CheckNullOrUndefinedOrEmpty(pro.product)) {
                                product.onlineBankingPaymentGiftProducts = pro.product.online_bank_transfer_gifts;
                                product.singlePaymentGiftProducts = pro.product.single_paymt_gifts;
                            }
            
                            product.orderLineOnlineBankingPaymentGifts = pro.order_line_bank_transfer_gifts;
                            product.orderLineSinglePaymentGifts = pro.order_line_single_paymt_gifts;
                            
                            // translation
                            product.translations = this.renderTranslation(pro.product.translations);

                            const customer = order.customer;
                            product.customerName = customer ? `${(customer.firt_name || "")} ${(order.customer.last_name || "")}` : "";
                            product.customerEmail = order.customer ? (order.customer.email || "") : "";

                        }
                    } else if (pro.is_fee) {
                        return;
                    }

                } else {
                    
                    product.id = pro.product.id;
                    product.orderLineId = pro.id;
                    product.productUri = pro.product_uri;
                    product.isActive = pro.is_active;
                    product.productName = pro.product.product_name;
                    product.productDescription = pro.product_description;
                    product.sku = pro.sku;
                    product.price = pro.price;
                    product.tax = pro.tax;
                    product.listedPrice = pro.product.listed_price;
                    product.promotionalPrice = pro.product.promotional_price;
                    product.promotionalPriceNaep = pro.price;
                    product.promotionalListPriceNaep = !CheckNullOrUndefinedOrEmpty(pro.product) ? pro.product.listed_price : '';
                    product.currencyCode = pro.product.currency_code;
                    product.hasAdvisor = pro.product.has_advisor;
                    product.termsAndConditionsLink = pro.terms_and_conditions_link;
                    product.cover_photo_key = this.renderAttachment(pro.product.attachments);
                    product.quantity = pro.quantity;
    
                    product.hasSpecialPayment = pro.product.has_special_payment;
                    product.allow_epp_payment = pro.product.allow_epp_payment;
                    product.allow_recurring_payment = pro.product.allow_recurring_payment;
                    product.deposit_amount = pro.quantity * (pro.product.deposit_amount);
                    if(!CheckNullOrUndefinedOrEmpty(pro.warranty)){
                        pro.warranty.forEach(item => {
                            product.warranty.push(item.serial_number)
                        });
                    }
                    //naep
                    product.is_naep_discount = pro.is_naep_discount;
                    product.is_deposit = pro.is_deposit;
                    product.is_kit = pro.is_kit;
                    product.is_fee = pro.is_fee;
                    product.naep_advisor_kit = pro.naep_advisor_kit;
                    product.naep_discount_price = pro.product.naep_discount_price;
                    product.cart_combination = pro.product.cart_combination;
                    product.properties = [];
                    if (!CheckNullOrUndefinedOrEmpty(pro.properties)) {
                        Object.keys(pro.properties).forEach(function (key) {
                            product.properties.push({ name: key, value: pro.properties[key] });
                        });
                    }
    
                    if (!CheckNullOrUndefinedOrEmpty(order.advisor_customer)) {
                        product.advisorId = order.advisor_customer.id;
                        product.advisorFirtName = order.advisor_customer.firt_name;
                        product.advisorLastName = order.advisor_customer.last_name;
                        product.advisorIdNumber = order.advisor_customer.advisor_id_number;
                        product.preferredName = !CheckNullOrUndefinedOrEmpty(order.advisor_customer.preferred_name) ? order.advisor_customer.preferred_name : order.advisor_customer.firt_name;
                    }
    
                    product.onlineBankingPaymentGiftProducts = [];
                    product.singlePaymentGiftProducts = [];
                    if (!CheckNullOrUndefinedOrEmpty(pro.product)) {
                        product.onlineBankingPaymentGiftProducts = pro.product.online_bank_transfer_gifts;
                        product.singlePaymentGiftProducts = pro.product.single_paymt_gifts;
                    }
    
                    product.orderLineOnlineBankingPaymentGifts = pro.order_line_bank_transfer_gifts;
                    product.orderLineSinglePaymentGifts = pro.order_line_single_paymt_gifts;
                    
                    // translation
                    product.translations = this.renderTranslation(pro.product.translations);

                    const customer = order.customer;
                    product.customerName = customer ? `${(customer.firt_name || "")} ${(customer.last_name || "")}` : "";
                    product.customerEmail = order.customer ? (order.customer.email || "") : "";
                }


                if (!CheckNullOrUndefinedOrEmpty(product.id)) {
                    orderProducts.push(product);
                }

            });
        }
        return orderProducts;
    }

    // render translation
    renderTranslation(lstTranslation: any[]) {
        let translations: TranslationProduct[] = [];
        if (!CheckNullOrUndefinedOrEmpty(lstTranslation)) {
            lstTranslation.forEach(translate => {
                let translation = new TranslationProduct();
                translation.productId = translate.product_id;
                translation.title = translate.translated_title;
                translation.description = translate.translated_description;
                translation.language_code = translate.language.language_code;
                translations.push(translation);
            })
        }
        return translations;
    }

    /**
     * render Delivery Address
     * @param deliveryAddress 
     */
    renderDeliveryAddress(deliveryAddress: any) {
        if (!isNullOrUndefined(deliveryAddress)) {
            let addressInfo = new DeliveryAddress();
            addressInfo.id = deliveryAddress.id;
            addressInfo.firstName = deliveryAddress.first_name;
            addressInfo.lastName = deliveryAddress.last_name;
            addressInfo.email = deliveryAddress.email;
            addressInfo.phoneDialCode = deliveryAddress.phone_dial_code;
            addressInfo.phoneNumber = deliveryAddress.phone_number;
            addressInfo.addressLine1 = deliveryAddress.address_line1;
            addressInfo.addressLine2 = deliveryAddress.address_line2;
            addressInfo.addressLine3 = deliveryAddress.address_line3;
            addressInfo.postalCode = deliveryAddress.postal_code;
            addressInfo.stateCode = deliveryAddress.state_code;
            addressInfo.countryCode = deliveryAddress.country_code;
            addressInfo.createdAt = deliveryAddress.created_at;
            addressInfo.updatedAt = deliveryAddress.updated_at;
            return addressInfo;
        }
    }

    /**
     * render Customer Information
     * @param customerInformation 
     */
    renderCustomerInformation(customerInformation) {
        if (!isNullOrUndefined(customerInformation)) {
            let customer = new CustomerInformation();
            customer.addressLine1 = customerInformation.address_line1;
            customer.addressLine2 = customerInformation.address_line2;
            customer.addressLine3 = customerInformation.address_line3;
            customer.countryCode = customerInformation.country_code;
            customer.stateCode = customerInformation.state_code
            customer.postalCode = customerInformation.postal_code;
            customer.id = customerInformation.id;
            customer.firstName = customerInformation.first_name;
            customer.lastName = customerInformation.last_name;
            customer.email = customerInformation.email;
            customer.phoneDialCode = customerInformation.phone_dial_code;
            customer.phoneNumber = customerInformation.phone_number;
            customer.createdAt = customerInformation.created_at;
            customer.updatedAt = customerInformation.updated_at;
            return customer;
        }
    }

    /**
     * create Order
     * @param formCreateOrder 
     */
    createOrder(formCreateOrder,is_redemption_cart : boolean) {
        if(is_redemption_cart){
            return this.api.post(createOrderRedemptionApi, formCreateOrder);
        }else{
            return this.api.post(createOrderApi, formCreateOrder);
        }
    }
    /**
     * render Shipping
     * @param shipping
     */
    renderShipping(shipping) {
        if (!CheckNullOrUndefinedOrEmpty(shipping)) {
            let ship = new Shipping();
            ship.id = shipping.id;
            ship.shippingMethod = shipping.shipping_method;
            ship.shippingNote = shipping.shipping_note;
            ship.customerSelectedShippingDate =
            shipping.customer_selected_shipping_date;
            ship.shipDate = shipping.ship_date;
            ship.receiveDate = shipping.receive_date;
            ship.customerNotes = shipping.customer_notes;
            ship.createdAt = shipping.created_at;
            ship.updatedAt = shipping.updated_at;
            ship.pickupAddressId = shipping.pickup_address_id;
            ship.pickupDateTime = shipping.pickup_date_time;
            ship.shippingAgentId = shipping.shipping_agent_id;
            ship.shipmentId = shipping.shipment_id;
            ship.shipmentLabel = shipping.shipment_label;
            ship.shippingStatus = shipping.shipping_status;
            ship.isManualShipping = shipping.is_manual_shipping;
            ship.shipping_location_name = !CheckNullOrUndefinedOrEmpty(shipping.shippinglocation) ? shipping.shippinglocation.name : '';

            let specialDelivery = new SpecialDelivery();
            if (!CheckNullOrUndefinedOrEmpty(shipping.SpecialDelivery)) {
                specialDelivery.sd_id = shipping.sd_id;
                specialDelivery.sd_type = shipping.SpecialDelivery.sd_type;
                specialDelivery.select_date = shipping.SpecialDelivery.select_date;
                specialDelivery.select_time = shipping.SpecialDelivery.select_time;
            }
            if(!CheckNullOrUndefinedOrEmpty(shipping.shippinglocation)) {
                ship.area_code = shipping.shippinglocation.area_code;
            }
            ship.specialShipping = specialDelivery;

            return ship;
        }
    }

    /**
     * get Order By Order Id
     * @param orderId 
     */
    getOrderByOrderId(orderId): Observable<any> {
        let orderData = new Order();
        let url = getOrderByIdApi.replace(":id", orderId);
        return this.api.get(url).pipe(
            map((data: any) => {
                if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
                    orderData.id = data.data.id;
                    orderData.shippingFee = data.data.shipping_fee;
                    orderData.subtotal = data.data.subtotal;
                    orderData.totalAmount = data.data.total_amount;
                    orderData.listProduct = this.renderDataProduct(data.data);
                    orderData.is_naep_order = false;
                    orderData.order_id_tmm = data.data.order_id_tmm;
                    // orderData.listProduct[0].hasSpecialPayment;
                    if(!CheckNullOrUndefinedOrEmpty(data.data.order_items)){
                        data.data.order_items.forEach(element => {
                            if(!CheckNullOrUndefinedOrEmpty(element.host_gift_id)){
                                orderData.order_host_gift = true;
                            }
                        });
                    }
                    orderData.is_buying_for_customer = data.data.is_buying_for_customer;
                    orderData.currency = data.data.order_items[0].currency_code;
                    orderData.paymentOption = data.data.payment_option;
                    let orderCustomer = new CustomerOrder();
                    orderCustomer.is_anomynous_account = data.data.customer.is_anomynous_account;
                    orderCustomer.first_name = data.data.customer.firt_name;
                    orderCustomer.email = data.data.customer.email;
                    orderCustomer.phone_number = data.data.customer.phone_number;
                    orderCustomer.phone_dial_code = data.data.customer.phone_dial_code ;
                    orderCustomer.uuid = data.data.customer.public_id;
                    orderData.customer_order = orderCustomer;
                    let deposit_amount = 0;
                    orderData.order_combination_cart = !CheckNullOrUndefinedOrEmpty(orderData.listProduct.find(e=>{return e.cart_combination})) ? true : false;
                    if(orderData.order_combination_cart || orderData.order_host_gift){
                        orderData.hasSpecialPayment = !CheckNullOrUndefinedOrEmpty(orderData.listProduct.find(e=>{return e.hasSpecialPayment})) ? true : false;
                        orderData.allow_epp_payment = !CheckNullOrUndefinedOrEmpty(orderData.listProduct.find(e=>{return e.allow_epp_payment})) ? true : false;
                        orderData.allow_recurring_payment = !CheckNullOrUndefinedOrEmpty(orderData.listProduct.find(e=>{return e.allow_recurring_payment})) ? true : false;
                        orderData.listProduct.forEach(product => {
                            deposit_amount = deposit_amount + ( product.allow_recurring_payment ? Number(product.deposit_amount) : Number(product.price)) ;
                            orderData.is_naep_order = orderData.is_naep_order || product.is_naep_discount;
                        });
                    }else{
                        orderData.hasSpecialPayment = false;
                        orderData.allow_epp_payment = false;
                        orderData.allow_recurring_payment = false;
                        orderData.listProduct.forEach(product => {
                            if (product.deposit_amount) {
                                
                                deposit_amount = deposit_amount + product.deposit_amount;
                            }
                            orderData.is_naep_order = orderData.is_naep_order || product.is_naep_discount;
                            orderData.hasSpecialPayment = orderData.hasSpecialPayment || product.hasSpecialPayment;
                            orderData.allow_epp_payment = orderData.allow_epp_payment || product.allow_epp_payment;
                            orderData.allow_recurring_payment =  orderData.allow_recurring_payment || product.allow_recurring_payment;
                        });
                    }
                    orderData.deposit_amount = deposit_amount;
                    orderData.entityId = data.data.entity_id;
                    orderData.dataSummary =  this.renderDataOrder(data);
                    return orderData;
                }
            },(err: HttpErrorResponse) => {
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

    renderDataOrderAfterPayment(session):Observable<any>{
        let param = new HttpParams();
        let orderData = new Order();
        if (!CheckNullOrUndefinedOrEmpty(session)) {
            param = param.append('session', session);
        }
        return this.http.get<any>(GetOrderAfterPaymentApi , {headers: this.api.headers , params: param}).pipe(
            map(data=>{
                if(data.code === 200){
                    orderData.is_naep_order = false;
                    orderData.totalAmount = data.data.total_amount;
                    orderData.currency = data.data.order_items[0]?.product?.currency_code;
                    orderData.listProduct = this.renderDataProduct(data.data);
                    orderData.order_id_tmm = data.data.order_id_tmm;
                    orderData.shippingFee = data.data.shipping_fee;
                    orderData.subtotal = data.data.subtotal;
                    let orderCustomer = new CustomerOrder();
                    orderCustomer.is_anomynous_account = data.data.customer.is_anomynous_account;
                    orderCustomer.first_name = data.data.customer.firt_name;
                    orderCustomer.email = data.data.customer.email;
                    orderCustomer.phone_number = data.data.customer.phone_number;
                    orderCustomer.phone_dial_code = data.data.customer.phone_dial_code ;
                    orderCustomer.uuid = data.data.customer.public_id;
                    orderData.customer_order = orderCustomer;

                    let deposit_amount = 0;
                    orderData.listProduct.forEach(product => {
                        if (product.deposit_amount) {
                            deposit_amount = deposit_amount + product.deposit_amount;
                        }
                        orderData.is_naep_order = orderData.is_naep_order || product.is_naep_discount
                    });
                    orderData.deposit_amount = deposit_amount;
                }
                return orderData
            })
        )
    }

    /**
     * render Advisor Customer
     * @param advisor 
     */
    renderAdvisor(advisor) {
        if (!isNullOrUndefined(advisor)) {
            let adv = new AdvisorCustomer();
            adv.id = advisor.id;
            // adv.entityId = advisor.entity_id;
            // adv.publicId = advisor.public_id;
            adv.firtName = advisor.firt_name;
            adv.lastName = advisor.last_name;
            adv.phoneDialCode = advisor.phone_dial_code;
            adv.phoneNumber = advisor.phone_number;
            adv.email = advisor.email;
            // adv.designation = advisor.designation;
            // adv.languageCode = advisor.language_code;
            // adv.password = advisor.password;
            // adv.isActive = advisor.is_active;
            // adv.isRegistered = advisor.is_registered;
            // adv.createdAt = advisor.created_at;
            // adv.updatedAt = advisor.updated_at;
            // adv.registeredAt = advisor.registered_at;
            adv.advisorIdNumber = advisor.advisor_id_number;
            // adv.advisedByCustomerId = advisor.advised_by_customer_id;
            // adv.teamLeaderCustomerId = advisor.team_leader_customer_id;
            // adv.branchManagerCustomerId = advisor.branch_manager_customer_id;
            // adv.profilePhotoId = advisor.profile_photo_id;
            // adv.recruiterId = advisor.recruiter_id;
            adv.preferredName = !CheckNullOrUndefinedOrEmpty(advisor.preferred_name) ? advisor.preferred_name : "";
            // adv.salt = advisor.salt;
            adv.profilePhotoKey = advisor.profile_photo_key;
            adv.cart = advisor.cart;
            return adv;
        }
    }

    updateStatus(order_id: string, status: string , share? , session?) : Observable<any> {
        if(share){
            let param = new HttpParams();
            if(!CheckNullOrUndefinedOrEmpty(order_id)){
                param = param.append('id', order_id);
            }
            if(!CheckNullOrUndefinedOrEmpty(status)){
                param = param.append('status', status);
            }
            if(!CheckNullOrUndefinedOrEmpty(session)){
                param = param.append('session', session);
            }
            return this.http.put<any>(UpdateStatusShareLinkApi , null , {headers: this.api.headers , params : param})
        }else{
            const url = updateOrderStatus.replace(':id', order_id);
            let body = {
                status: status
            };
            return this.api.put(url, body);
        }
    }
    /**
     * render OrderHistory
     * @param history 
     */
    renderOrderHistory(history) {
        let listOrderHistory = [];
        if (!isNullOrUndefined(history) && history.length > 0) {
            history.forEach(his => {

                let lengthString = his.action.indexOf('Delivery');
                let orderHistory = new OrderHistory();

                orderHistory.id = his.id;

                if (lengthString != -1) {
                    orderHistory.action = 'Admin update ' + his.action.substring(lengthString, his.action.length);
                } else {
                    orderHistory.action = his.action;
                }

                orderHistory.appUserId = his.app_user_id;
                orderHistory.createdAt = his.created_at;
                orderHistory.shipping_method = his.shipping_method;
                orderHistory.shipping_note = his.shipping_note;
                listOrderHistory.push(orderHistory);
            });
        }
        return listOrderHistory;
    }

    /**
     * render OrderPayment
     * @param payment 
     */
    renderOrderPayment(payment, orderIdTmm , paymentOption) {
        let ordersPayments = [];
        if (!CheckNullOrUndefinedOrEmpty(payment)) {
            payment.forEach(pay => {
                let orderPayment = new OrderPayment();
                orderPayment.id = pay.id;
                orderPayment.paymentAmount = pay.payment_amount;
                orderPayment.paymentMethod = pay.payment_method;
                orderPayment.paymentGateway = pay.payment_gateway;
                orderPayment.verfified = pay.verified;
                orderPayment.updatedAt = pay.updated_at;
                orderPayment.createdAt = pay.created_at;
                orderPayment.paymentStatus = pay.payment_status;
                orderPayment.payment_option = !paymentOption ? '' : paymentOption;
                orderPayment.isDepositPayment = pay.is_deposit_payment;
                orderPayment.paymentReference = (!CheckNullOrUndefinedOrEmpty(pay.payment_reference_by_admin)) ? pay.payment_reference_by_admin :`${pay.uuid}+${orderIdTmm}`;
                ordersPayments.push(orderPayment);
            });
            return ordersPayments;
        }
    }

    renderAttachment(data): string {
        let coverPhotoKey = '';
        if (!isNullOrUndefined(data) && data.length > 0) {
            data.forEach(element => {
                if (element.is_cover_photo === true) {
                    coverPhotoKey = element.storage_key;

                }
            });
        }
        return coverPhotoKey;
    }


    // payment option
    updatePaymentOption(formPaymentOption , share?) : Observable<any> {
        // console.log("share" , share)
        if(share){
            let param = new HttpParams();
            param = param.append('payment_option', formPaymentOption.payment_option);
            param = param.append('order_id', formPaymentOption.order_id);
            return this.http.post(UpdatePaymentOptionShareLinkApi , null , {headers: this.api.headers , params: param});  
        }
        return this.api.post(updateOrderPaymentOptionApi, formPaymentOption);
    }
    
    updateReasonForNoHostNoUnbox(reason, orderuuid, flag): Observable<any> {
        let url = updateNoUnboxNoHostReasonApi.replace(":uuid",orderuuid)
        let param = {
            reasons: reason,
            flag : flag
        };
        
        return this.api.put(url, param).pipe(
            map((value) => {
                return value;
            }), catchError(value => throwError(value))
        );
    }

    updateStatusNew(order_uuid: string, status: string) {
    updateUnboxHostQRApi
    const url = updateUnboxHostQRApi.replace(':uuid', order_uuid);
        let body = {
            status: status
        };
        return this.api.put(url, body);
    }

    updateSpecialShipping(formShipping) {
        return this.api.post(updateSpecialShippingApi, formShipping);
    } 

    getDateShareOrder(session): Observable<any>{
        let param = new HttpParams();
        if(!CheckNullOrUndefinedOrEmpty(session)){
            param = param.append('session', session);
        }
        return this.http.get<any>(shareLinkApi,{headers: this.api.headers , params: param }).pipe(
            map(value=>{
                // console.log('sgsjah',value)
                let result = (value.code === 200) ? this.rendershareDataOrder(value.data) : (value.code === 202 ? "expired" : null);
                return result;
            }), catchError(value => throwError(value))
        )
    }

    getDataForShareOrderCustomer(session){
        let param = new HttpParams();
        if(!CheckNullOrUndefinedOrEmpty(session)){
            param = param.append('session', session);
        }
        if(this.api.isEnable()){
            return this.http.get<any>(DataShareForCustomerTMMApi,{headers: this.api.headers , params: param }).pipe(
                map(value=>{
                    let result = (value.code === 200) ? this.rendershareDataOrder(value.data) : (value.code === 202 ? "expired" : null);
                    return result;
                }), catchError(value => throwError(value))
            )
        }
    }

    createSessionOrder(uuid){
        let param = new HttpParams();
        if(!CheckNullOrUndefinedOrEmpty(uuid)){
            param = param.append('order_uuid', uuid);
        }
        if(this.api.isEnable()){
            return this.http.put<any>(CreateshareLinkApi , "" , { headers: this.api.headers, params: param }).pipe(
                map(data=>{
                    return data
                }), catchError(data => throwError(data))
            )
        }
    }

    rendershareDataOrder(data){
        if(!CheckNullOrUndefinedOrEmpty(data)){
            let order = new Order();
            order.subtotal = data.subtotal;
            order.shippingFee = data.shipping_fee;
            order.entityId = data.entity_id;
            order.totalAmount = data.total_amount;
            order.order_id_tmm = data.order_id_tmm
            order.currency = data.order_items[0]?.product?.currency_code;
            order.is_naep_order = false;
            order.isRedemptionPrice = false;
            order.id = data.id
            order.paymentOption = data.payment_option;
            order.uuid = data.uuid;
            order.listProduct = this.renderDataProduct(data)
            order.deliveryAddress = this.renderDeliveryAddress(data.delivery_address);
            order.customerInformation = this.renderCustomerInformation(data.customer_information);
            order.shipping = this.renderShipping(data.shipping);
            order.advisorCustomer = this.renderAdvisor(data.advisor_customer);
            order.dataSummary =  this.renderDataOrder({code : 200, data : data});
            order.payment = [];
            if(!CheckNullOrUndefinedOrEmpty(data.payments)){
                data.payments.forEach(element => {
                    if(element.payment_status === 'success' && element.is_deposit_payment){
                        let pay = new OrderPayment();
                        pay.id = element.id;
                        pay.isDepositPayment = element.is_deposit_payment;
                        pay.paymentAmount = element.payment_amount;
                        pay.paymentStatus = element.payment_status;
                        order.payment.push(pay);
                    }
                });
            }
            let listNameProduct = '';
            order.singlePaymentGiftProducts = [];
            data.order_items?.forEach((element,index)=>{
                order.is_naep_order = order.is_naep_order || element.is_naep_discount
                order.isRedemptionPrice = order.isRedemptionPrice || element.is_redemption_price
                order.singlePaymentGiftProducts.push(element.product?.single_paymt_gifts)
                if(!CheckNullOrUndefinedOrEmpty(element.host_gift_id)){
                    order.order_host_gift = true;
                }
                if(index === (data.order_items.length -1)){
                    if(element.quantity <= 1)
                    {
                        listNameProduct += `${element.product_name}`;
                    }else{
                        listNameProduct += `${element.quantity} x ${element.product_name}`;
                    }
                }else{
                    if(element.quantity <= 1)
                    {
                        listNameProduct += `${element.product_name}, `
                    }else{
                        listNameProduct += `${element.quantity} x ${element.product_name}, `;
                    }
                }
            })
            order.listName = listNameProduct;
            if (!CheckNullOrUndefinedOrEmpty(data.shipping?.SpecialDelivery)) {
                order.isCheckSdOnly = data.shipping.SpecialDelivery.sd_type === 'SD_ONLY' ? true : false;
            } else {
                order.isCheckSdOnly = true;
            }
            let deposit_amount = 0;
            order.order_combination_cart = !CheckNullOrUndefinedOrEmpty(order.listProduct.find(e=>{return e.cart_combination})) ? true : false;
            if(order.order_combination_cart || order.order_host_gift){
                order.hasSpecialPayment = !CheckNullOrUndefinedOrEmpty(order.listProduct.find(e=>{return e.hasSpecialPayment})) ? true : false;
                order.allow_epp_payment = !CheckNullOrUndefinedOrEmpty(order.listProduct.find(e=>{return e.allow_epp_payment})) ? true : false;
                order.allow_recurring_payment = !CheckNullOrUndefinedOrEmpty(order.listProduct.find(e=>{return e.allow_recurring_payment})) ? true : false;
                order.listProduct.forEach(product => {
                    deposit_amount = deposit_amount + (product.allow_recurring_payment ? Number(product.deposit_amount) : Number(product.price))
                });
            }else{
                order.allow_recurring_payment = order.listProduct[0].allow_recurring_payment;
                order.hasSpecialPayment = order.listProduct[0].hasSpecialPayment;
                order.allow_epp_payment = data.order_items[0]?.product?.allow_epp_payment;
                order.listProduct.forEach(product => {
                    if (product.deposit_amount) {
                        deposit_amount = deposit_amount + product.deposit_amount;
                    }
                });
            }
            order.deposit_amount = deposit_amount;
            return order;
        }
    }

    renderProductForShare(listProduct){
        let orderProducts = [];
        if(!CheckNullOrUndefinedOrEmpty(listProduct)){
            listProduct.forEach(element => {
                let product = new Product();
                product.orderLineId = element.id;
                product.productName = element.product_name;
                product.quantity = element.quantity;
                product.id = element.product?.id;
                product.allow_recurring_payment = element.product?.allow_recurring_payment;
                product.hasSpecialPayment = element.product?.has_special_payment;
                product.singlePaymentGiftProducts = element.product?.single_paymt_gifts;
                product.listedPrice = element.product?.listed_price;
                product.naep_discount_price = element.product?.naep_discount_price;
                product.currencyCode = element.product?.currency_code;
                product.deposit_amount = element.quantity * (element.product?.deposit_amount);
                product.properties = [];
                if (!CheckNullOrUndefinedOrEmpty(element.properties)) {
                    Object.keys(element.properties).forEach(function (key) {
                        product.properties.push({ name: key, value: element.properties[key] });
                    });
                }
                product.cover_photo_key = this.renderAttachment(element.product?.attachments);

                orderProducts.push(product)
            });
        }
        return orderProducts
    }

    checkOrderHasBeenPaid(uuid): Observable<any>{
        let param = new HttpParams();
        if(!CheckNullOrUndefinedOrEmpty(uuid)){
            param = param.append('order_uuid', uuid);
        }
        return this.http.get<any>(CheckOrderPaymentApi , {headers: this.api.headers , params: param}).pipe(
            map(data=>{
                // console.log(data)
                return data.code === 200 && (CheckNullOrUndefinedOrEmpty(data.data.status) || data.data.status == "TO_PAY") ? true : false ;
            })
        )
    }

    //Download Pdf
    downloadInvoice(uuid): Observable<any>{
        let url = DownloadInvoiceApi.replace(":uuid", uuid);
          return this.api.get(url).pipe(
            map(data => {
                return data;
        })
        )
    }

    //Host gift
    getAllOrderHostGift(){
        return this.api.get(HostGiftApi).pipe(
            map(data=>{
                if(data.code === 200){
                    let result;
                    result = this.renderHostGift(data.data)
                    return result;
                }
            })
        )
    }

    async getAllHostGift(date){
        let param = new HttpParams();
        if(!CheckNullOrUndefinedOrEmpty(date)){
            param = param.append('date', date);
        }
        if(this.api.isEnable()){
            return await this.http.get<any>(GetAllHostGiftApi , {headers: this.api.headers , params: param}).toPromise().
                then(data=>{
                    if(data.code === 200){
                        // console.log('All host gift' , data)
                        let result;
                        result = {gift : this.renderHostGiftData(data.data) , discountCart: data.cartDiscount} || null;
                        return result;
                    }
                })
            // )
        }
    }

    renderHostGift(data){
        let arrData = [];
        // console.log(data)
        if(!CheckNullOrUndefinedOrEmpty(data)){
            data.forEach(element => {
                let item = new OrderRedeem();
                item.advisor_host_gift_id = element.id;
                item.order_id = element.order_id;
                item.order_id_tmm = element.order?.order_id_tmm;
                item.customer_name = element.order?.customer?.firt_name;
                item.recognition_date = formatDate(element.created_at, "dd-MM-yyyy", "en-US");
                item.date_query = element.created_at;
                item.expired_date = formatDate(element.expired_date, "dd-MM-yyyy", "en-US");
                item.time_left = Math.round(((new Date(element.expired_date)).getTime() - (new Date()).getTime())/(1000 * 3600 * 24));
                item.status = element.status == HostGiftAdvisorType.NOT_YES 
                ? HostGiftEnum.REDEEMABLE 
                : (element.status == HostGiftAdvisorType.REDEEMED ? HostGiftEnum.REDEEMED 
                    : (element.status == HostGiftAdvisorType.EXPIRED ? HostGiftEnum.EXPIRED 
                        : (element.status == HostGiftAdvisorType.NOT_APPLICABLE ? HostGiftEnum.NOT_APPLICABLE 
                            : (element.status == HostGiftAdvisorType.ORDER_CANCEL ? HostGiftEnum.ORDER_CANCEL : ''))))
                item.checkRedeem = element.status == HostGiftAdvisorType.NOT_YES ? true : false;
                item.redeemption_date = !CheckNullOrUndefinedOrEmpty(element.order_redeem) ? formatDate(element.order_redeem?.created_at, "dd-MM-yyyy", "en-US") : null; 
                arrData.push(item)
            });
            return arrData;
        }
        return [];
    }

    renderHostGiftData(data){
        if(!CheckNullOrUndefinedOrEmpty(data)){
            let hostGift = new HostGift();
            hostGift.is_active = data.is_active;
            if(!CheckNullOrUndefinedOrEmpty(data.host_gift_items)){
                data.host_gift_items.forEach(element => {
                    let gift = new HostGiftItem();
                    let item = new GiftComponent();
                    item.host_gift_id = element.id;
                    item.is_main_gift_product = true;
                    item.product_id = element.product?.id;
                    item.product_name = element.product?.product_name;
                    // item.properties = element.product?.properties;
                    item.allow_epp_payment = element.product?.allow_epp_payment;
                    item.allow_recurring_payment = element.product?.allow_recurring_payment;
                    item.has_special_payment = element.product?.has_special_payment;
                    item.price = element.product?.listed_price;
                    item.storage_key = element.product?.attachments[0]?.storage_key;
                    item.currencyCode = element.product?.currency_code;
                    item.listedPrice = element.product?.listed_price;
                    item.promotionalPrice =element.product?.promotional_price;
                    item.internal_discount_price = element.product?.internal_discount_price;
                    item.internal_discount_for =  element.product?.internal_discount_for;
                    item.internal_discount_start_time = element.product?.internal_discount_start_time;
                    item.total = element.product?.total;
                    item.max_total_discount = element.product?.max_total_discount;
                    item.hasAdvisor =  element.product?.has_advisor
                    let size = (!CheckNullOrUndefinedOrEmpty(element.product?.properties)) ? Object.keys(element.product?.properties).length : 0;
                    if(size > 0){
                      for (let key in element.product?.properties)
                      {
                        let value = element.product?.properties[key];
                        let property = new PROPERTY();
                        property.name = key;
                        property.value = [];
                        value.forEach(element =>
                        {
                          property.value.push({ value: element, label: element })
                        })
                        item.properties.push(property);
                      }
                    }
                    gift.id = element.id;
                    gift.component.push(item);
                    if(!CheckNullOrUndefinedOrEmpty(element.host_gift_item_component)){
                        element.host_gift_item_component.forEach(e => {
                            let item_component = new GiftComponent();
                            item_component.is_main_gift_product = false;
                            item_component.product_id = e.gift_product_id;
                            item_component.product_name = e.product?.product_name
                            gift.component.push(item_component);
                        });
                    }
                    hostGift.host_gift.push(gift)
                    hostGift.select_host_gift.push({ value: Number(element.id), label: element.product?.product_name })
                });
            }
            return hostGift;    
        }
    }

    updateHostGiftStatus(formUpdate){
        return this.api.put(HostGiftApi , formUpdate)
    }

}
export class Order {
    uuid: string;
    id: string;
    customerId: number;
    isDeleted: boolean;
    subtotal: string;
    shippingFee: string;
    tax: string;
    createdAt: string;
    updatedAt: string;
    advisorCustomer: AdvisorCustomer;
    entityId: number;
    status: string;
    totalAmount: string;
    shipping: Shipping;
    listProduct: Array<Product>;
    deliveryAddress: DeliveryAddress;
    customerInformation: CustomerInformation;
    history: OrderHistory[];
    payment: OrderPayment[];
    currency: string;
    hasSpecialPayment: boolean;
    allow_epp_payment: boolean;
    allow_recurring_payment: boolean;
    paymentOption: string;
    deposit_amount?: number;
    singlePaymentGiftProducts: Array<any>;
    listName : string;
    order_id_tmm: number;
    is_need_advisor : boolean;
    remark_advisor_name : string;
    remark_advisor_id : string;
    remark_advisor_phone_number : string;
    is_naep_order : boolean;
    noHostedReasons: string;
    noUnBoxedReasons: string;
    is_buying_for_customer : boolean;
    is_customer_pay : boolean;
    paymentInstallment: any;
    arrPaymentBank = [];
    isCheckSdOnly: boolean;
    isRedemptionPrice: boolean;
    warrantyInfo: any[];
    dataSummary : any;
    area_code: string;
    customer_order : CustomerOrder;
    order_combination_cart: boolean = false;
    order_host_gift: boolean = false;
}

export class CustomerOrder {
    is_anomynous_account : boolean;
    first_name : string;
    email : string;
    phone_number : string;
    phone_dial_code : string;
    uuid : string;
}
export class DeliveryAddress {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneDialCode: number;
    phoneNumber: number;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    postalCode: string;
    stateCode: string;
    countryCode: string;
    createdAt: string;
    updatedAt: string;
}
export class CustomerInformation {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneDialCode: number;
    phoneNumber: number;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    postalCode: string;
    stateCode: string;
    countryCode: string;
    createdAt: string;
    updatedAt: string;
}
export class Shipping {
    id: string;
    shippingMethod: string;
    shippingNote: string;
    customerSelectedShippingDate: string;
    shipDate: string;
    receiveDate: string;
    customerNotes: string;
    createdAt: string;
    updatedAt: string;
    pickupAddressId: string;
    pickupDateTime: string;
    shippingAgentId: string;
    shipmentId: string;
    shipmentLabel: any;
    shippingStatus: any;
    isManualShipping: boolean;
    shipping_location_name: string;
    specialShipping: SpecialDelivery;
    area_code: string;
}
export class AdvisorCustomer {
    id: number;
    entityId: number;
    publicId: string;
    firtName: string;
    lastName: string;
    phoneDialCode: number;
    phoneNumber: number;
    email: string;
    designation: string;
    languageCode: string;
    password: string;
    isActive: boolean;
    isRegistered: boolean;
    createdAt: string;
    updatedAt: string;
    registeredAt: string;
    advisorIdNumber: number;
    advisedByCustomerId: number;
    teamLeaderCustomerId: number;
    branchManagerCustomerId: number;
    profilePhotoId: string;
    recruiterId: number;
    preferredName: string;
    salt: string;
    profilePhotoKey: string;
    cart: Cart[];
}
export class OrderHistory {
    id: number;
    action: string;
    appUserId: string;
    createdAt: string;
    shipping_method : string;
    shipping_note: string;
}
export class OrderPayment {
    id: string;
    paymentAmount: string;
    paymentMethod: string;
    paymentGateway: string;
    verfified: boolean;
    createdAt: string;
    updatedAt: string;
    paymentStatus : string;
    paymentReference: string;
    payment_option: string;
    isDepositPayment: string;
}

export class CardBank{
    cardType: string;
    acct: string;
    refNo: string;
    auth: string;
}

class WarrantyProduct {
    productName: string;
    serialNumber: string;
    warrantyDuration: number;
    status: string;
    startDate: string;
    endDate: string;

    constructor() {
        this.productName = "";
        this.serialNumber = "";
        this.warrantyDuration = 0;
        this.status = "";
        this.startDate = "";
        this.endDate = "";
    }
}

export class HostGift{
    is_active: boolean;
    host_gift: Array<HostGiftItem> = [];
    select_host_gift = [];
}

export class HostGiftItem{
    id: number;
    component: Array<GiftComponent> = [];
}

export class GiftComponent{
    host_gift_id: number;
    is_main_gift_product: boolean;
    product_name: string;
    product_id: number;
    price: string;
    properties = [];
    has_special_payment: boolean;
    allow_recurring_payment: boolean;
    allow_epp_payment: boolean;
    storage_key: string;
    currencyCode: string;
    listedPrice: string;
    internal_discount_price: string;
    promotionalPrice: string;
    hasAdvisor: boolean;
    internal_discount_for;
    internal_discount_start_time;
    total;
    max_total_discount;

}

export enum HostGiftEnum{
    REDEEMABLE = "Redeemable",
    REDEEMED = 'Redeemed',
    EXPIRED = 'Expired',
    NOT_APPLICABLE = 'Not Applicable Period',
    ORDER_CANCEL = "Order Cancel"
}   

export enum HostGiftAdvisorType
{
    NOT_YES = 'NOT_YES',
    REDEEMED = 'REDEEMED',
    EXPIRED = 'EXPIRED',
    NOT_APPLICABLE = "NOT_APPLICABLE",
    ORDER_CANCEL = "ORDER_CANCEL"
}