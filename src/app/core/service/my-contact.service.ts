import { customer } from './../models/list_recruit.model';
import { forEach, isEmpty } from 'lodash';
import { isNullOrUndefined } from 'util';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { getDataMyContactsApi, getDataMyContactDetailApi, customerRemoveContact, getDataMyContactsNaepApi } from './backend-api';
import { catchError, map } from 'rxjs/operators';
import { isEmptyOrNullOrUndefined } from 'app/main/account/profile/_helper/helper-fn';
import { CustomerInforAdvisor, MyContacts } from '../models/my-contacts.model';
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';
import { Injectable } from '@angular/core';
import { CustomerInformation } from '../models/my-customers';
import HelperFn from '../helper/helper-fn';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class MyContactsService {
  
  helperFn = new HelperFn();

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  // get list contact 
  getContactList(searchContact: string): Observable<any> {
    let listContact = [];
    let param = new HttpParams();
    param = param.append('search_string', searchContact)
    return this.http.get<any>(getDataMyContactsApi, { headers: this.api.headers, params: param }).pipe(
      map(value => {
       
        if (value.code === 200 && !CheckNullOrUndefinedOrEmpty(value.data)) {
          value.data.forEach(element => {
            let contact = new MyContacts();
            
            contact.uuid = element.uuid;
            contact.first_name = element.name;
            contact.phone_dial_code = element.dial_code;
            contact.phone_number = element.phone_number;
            contact.email = element.email;
            contact.advisor_id_number = element.advisor_id;
            contact.advisor_role = element.role;
            contact.id =  element.customer_id;
            listContact.push(contact)
          });
        }
          return listContact;
      }), catchError(value => throwError(value))
    );
  }

  // get list customer naep 
  getContactListNaep(searchContact: string): Observable<any> {
    let listContact = [];
    let param = new HttpParams();
    param = param.append('search_string', searchContact)
    return this.http.get<any>(getDataMyContactsNaepApi, { headers: this.api.headers, params: param }).pipe(
      map(value => {
       
        if (value.code === 200 && !CheckNullOrUndefinedOrEmpty(value.data)) {
          value.data.forEach(element => {
            let contact = new MyContacts();
            // console.log(element)
            contact.first_name = element.name;
            contact.phone_dial_code = element.dial_code;
            contact.phone_number = element.phone_number;
            contact.email = element.email;
            listContact.push(contact)
          });
        }
          return listContact;
      }), catchError(value => throwError(value))
    );
  }

  getContactListForAdvisorBuyOrder(searchContact: string): Observable<any> {
    let listContact = [];
    let param = new HttpParams();
    param = param.append('search_string', searchContact)
    return this.http.get<any>(getDataMyContactsApi, { headers: this.api.headers, params: param }).pipe(
      map(value => {
        if (value.code === 200 && !CheckNullOrUndefinedOrEmpty(value.data)) {
          value.data.forEach(element => {
            if(element.role == "CUSTOMER")
            {
              let contact = new CustomerInforAdvisor();
              contact.first_name = element.name;
              contact.phone_dial_code = element.dial_code;
              contact.phone_number = element.phone_number;
              contact.email = element.email;
              contact.id =  element.customer_id;
              contact.address_line1 = "";
              contact.address_line2 = "";
              contact.address_line3 = "";
              contact.country_code  = "";
              contact.state_code = "";
              contact.postal_code = "";
              if(!CheckNullOrUndefinedOrEmpty(element.address))
              {
                contact.address_line1 = element.address.address_line1;
                contact.address_line2 = element.address.address_line2;
                contact.address_line3 = element.address.address_line3;
                contact.country_code  = element.address.country_code;
                contact.state_code = element.address.state_code;
                contact.postal_code = element.address.postal_code;
              }

              listContact.push(contact)
            }
            
          });
        }
          return listContact;
      }), catchError(value => throwError(value))
    );
  }

  getContactDetail(uuid, version1, version2):Observable<any> {
    let isCheckKit: boolean = true;
    let param = new HttpParams();
    param = param.append('uuid', uuid);
    param = param.append('version1', version1);
    param = param.append('version2', version2);

    if (this.api.isEnable()) {
      return this.http.get<any>(getDataMyContactDetailApi, {headers: this.api.headers, params: param}).pipe(
        map (data => {
          if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
            let customer = new CustomerInformation();

            customer.nameAsInIC = data.data.firt_name;
            customer.nickName = data.data.preferred_name;
            customer.preferredName = data.data.preferred_name;
            customer.id = data.data.id;
            if (!isNullOrUndefined(data.data.address)) {
              customer.address = this.helperFn.setDisplayAddressLine(data.data.address.address_line1, 
                  data.data.address.address_line2, data.data.address.address_line3, data.data.address.postal_code);
              
              customer.country = this.helperFn.setStateCountryLine(data.data.address.state_code, data.data.address.country_code);
            } else {
                customer.address = null;
                customer.country = null;
            }

            customer.email = data.data.email;
            customer.phoneNumber = "(+" + data.data.phone_dial_code + ") " + data.data.phone_number;

            //Advisor
            if (!isNullOrUndefined(data.data.advisorCustomer)) {
                customer.advisorId = data.data.advisorCustomer.advisor_id_number;

                if (!isNullOrUndefined(data.data.advisorCustomer.firt_name) && !isNullOrUndefined(data.data.advisorCustomer.last_name)) {
                    customer.advisorName = data.data.advisorCustomer.firt_name + " " + data.data.advisorCustomer.last_name;
                } else {
                    customer.advisorName = data.data.advisorCustomer.firt_name;
                }

                customer.advisorImage = data.data.advisorCustomer.profile_photo_key;
            }

            //Recruiter
            if (!isNullOrUndefined(data.data.recruiter)) {
                customer.recruiterId = data.data.recruiter.advisor_id_number;

                if (!isNullOrUndefined(data.data.recruiter.firt_name) && !isNullOrUndefined(data.data.recruiter.last_name)) {
                    customer.recruiterName = data.data.recruiter.firt_name + " " + data.data.recruiter.last_name;
                } else {
                    customer.recruiterName = data.data.recruiter.firt_name;
                }

                customer.recruiterImage = data.data.recruiter.profile_photo_key;
            }  

            //Team Leader
            if (!isNullOrUndefined(data.data.teamLeaderCustomer)) {
                customer.teamLeaderId = data.data.teamLeaderCustomer.advisor_id_number;

                if (!isNullOrUndefined(data.data.teamLeaderCustomer.firt_name) && !isNullOrUndefined(data.data.teamLeaderCustomer.last_name)) {
                    customer.teamLeaderName = data.data.teamLeaderCustomer.firt_name + " " + data.data.teamLeaderCustomer.last_name;
                } else {
                    customer.teamLeaderName = data.data.teamLeaderCustomer.firt_name;
                }

                customer.teamLeaderImage = data.data.teamLeaderCustomer.profile_photo_key;
            } 

            //Branch Manager
            if (!isNullOrUndefined(data.data.manager_of_Customer)) {
                customer.branchManagerId = data.data.manager_of_Customer.advisor_id_number;

                if (!isNullOrUndefined(data.data.manager_of_Customer.firt_name) && !isNullOrUndefined(data.data.manager_of_Customer.last_name)) {
                    customer.branchManagerName = data.data.manager_of_Customer.firt_name + " " + data.data.manager_of_Customer.last_name;
                } else {
                    customer.branchManagerName = data.data.manager_of_Customer.firt_name;
                }

                customer.branchManagerImage = data.data.manager_of_Customer.profile_photo_key;
            }

            if (data.data.questionnaire.length === 2) {
                customer.questionnaireOne = data.data.questionnaire[0].answer;
                customer.questionnaireTwo = data.data.questionnaire[1].answer;
            } else if (data.data.questionnaire.length === 1) {
                customer.questionnaireOne = data.data.questionnaire[0].answer;
            } else {
                customer.questionnaireOne = undefined;
                customer.questionnaireTwo = undefined;
            }

            if(!CheckNullOrUndefinedOrEmpty(data.data.orders)){
                        
              data.data.orders.forEach(element => {
                
                  let order = new Order();
                  order.status = element.status.replace('_', ' ');
                  order.id = element.order_id_tmm;
                  order.totalAmount = element.total_amount;
                
                   if (!CheckNullOrUndefinedOrEmpty(element.advisor_customer)) {
                       order.advisorCustomer_id = element.advisor_customer.advisor_id_number;
                       order.advisorCustomerName = element.advisor_customer.firt_name;
                   }
                  order.totalItem = element.order_items.length;
                  order.listProduct = [];
                  
                  if(!CheckNullOrUndefinedOrEmpty(element.order_items) && element.order_items.length > 0 ){

                    let productFee = element.order_items.filter(product => product.is_fee === true);

                    element.order_items.forEach(e => {

                        let product = new Product();

                        if (e.is_kit || e.is_fee) {
                          if (e.is_kit) {

                            if (isCheckKit) {

                              isCheckKit = false;
                              product.currencyCode = productFee[0].currency_code;
                              product.price = productFee[0].price;
                              product.is_naep_product = e.is_naep_discount;
                              product.productName = e.naep_advisor_kit.name;
                              product.listedPrice = productFee[0].product.listed_price;
                              product.promotionalPrice = productFee[0].product.promotional_price;
                              // product.product = e.product;


                              if (!CheckNullOrUndefinedOrEmpty(e.quantity)) {
                                  product.quantity = e.quantity;
                              }
                              // product.properties = e.properties;
                              product.properties = [];
      
                              if (!isNullOrUndefined(e.properties)) {
                                  Object.keys(e.properties).forEach(function (key) {
                                      product.properties.push({ name: key, value: e.properties[key] });
                                  });
                              }
      
                              // if (e.product.attachments.length != 0) {
                              //   product.productPhotoKey = e.product.attachments[0].storage_key;
                              // }
                              product.productPhotoKey = this.renderAttachment(productFee[0].product.attachments);
      
                              product.is_naep_discount = e.is_naep_discount;
                              product.is_fee = e.is_fee;
                              product.is_kit = e.is_kit;
                              product.is_deposit = e.is_deposit;
                              product.naep_advisor_kit = e.naep_advisor_kit;
                              product.naep_discount_price = e.product.naep_discount_price;
      
                              product.onlineBankingPaymentGiftProducts = [];
                              product.singlePaymentGiftProducts = [];
      
                              // if (!isNullOrUndefined(e.product)) {
                              //     product.onlineBankingPaymentGiftProducts = e.product.online_bank_transfer_gifts;
                              //     product.singlePaymentGiftProducts = e.product.single_paymt_gifts;
                              // }
              
                              product.orderLineOnlineBankingPaymentGifts = this.aggregateGifts(e.order_line_bank_transfer_gifts);
                              product.orderLineSinglePaymentGifts = this.aggregateGifts(e.order_line_single_paymt_gifts);
                            }
                          } else if (e.is_fee) {
                            return;
                          } 
                        } else {

                          product.currencyCode = e.currency_code;
                          product.price = e.price;
                          product.is_naep_product = e.is_naep_discount;
                          product.productName = e.product_name;
                          // product.product = e.product;
                          product.listedPrice = e.product.listed_price;
                          product.promotionalPrice = e.product.promotional_price;

                          if (!CheckNullOrUndefinedOrEmpty(e.quantity)) {
                              product.quantity = e.quantity;
                          }
                          // product.properties = e.properties;
                          product.properties = [];
  
                          if (!isNullOrUndefined(e.properties)) {
                              Object.keys(e.properties).forEach(function (key) {
                                  product.properties.push({ name: key, value: e.properties[key] });
                              });
                          }
  
                          // if (e.product.attachments.length != 0) {
                          //   product.productPhotoKey = e.product.attachments[0].storage_key;
                          // }
                          product.productPhotoKey = this.renderAttachment(e.product.attachments);

                          product.is_naep_discount = e.is_naep_discount;
                          product.is_fee = e.is_fee;
                          product.is_kit = e.is_kit;
                          product.is_deposit = e.is_deposit;
                          product.naep_advisor_kit = e.naep_advisor_kit;
                          product.naep_discount_price = e.product.naep_discount_price;
  
                          product.onlineBankingPaymentGiftProducts = [];
                          product.singlePaymentGiftProducts = [];
  
                          // if (!isNullOrUndefined(e.product)) {
                          //     product.onlineBankingPaymentGiftProducts = e.product.online_bank_transfer_gifts;
                          //     product.singlePaymentGiftProducts = e.product.single_paymt_gifts;
                          // }
          
                          product.orderLineOnlineBankingPaymentGifts = this.aggregateGifts(e.order_line_bank_transfer_gifts);
                          product.orderLineSinglePaymentGifts = this.aggregateGifts(e.order_line_single_paymt_gifts);
                        }

                        if (!isEmpty(product)) {
                          order.listProduct.push(product);
                        }
                      });
                  } 
                  customer.orderHistory.push(order);
              });   
            }
            

            return customer;
          }
        }), catchError(value => throwError(value))
      )
    }
  }

  aggregateGifts(gifts: any[]): GiftDisplay[] {
    const giftDisplayArr: GiftDisplay[] = [];
    for (const gift of gifts) {
      const giftId = (gift.single_paymt_gift_product_id) ? gift.single_paymt_gift_product_id : gift.online_bank_transfer_gift_product_id;
      const giftObj = giftDisplayArr.find(obj => obj.id === giftId);
      if (!giftObj) {
        const giftName = (gift.single_paymt_gift_product_name) ? gift.single_paymt_gift_product_name : gift.online_bank_transfer_gift_product_name;
        const giftDisplay: GiftDisplay = {
          id: giftId,
          name: giftName,
          quantity: 1
        };
        giftDisplayArr.push(giftDisplay);
      }
      else {
        giftObj.quantity += 1;
      }
    }
    return giftDisplayArr;
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

  removeContactList(remove_id : string){
    let param = new HttpParams();
    param = param.append('remove_id', remove_id);
  
    if (this.api.isEnable()) {
      return this.http.post<any>(customerRemoveContact,'',{headers : this.api.headers, params : param}).pipe(map(data =>{
        return data;
      }))
    }
  }


}


interface GiftDisplay {
  id: string;
  name: string;
  quantity: number;
}