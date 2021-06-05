import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { getListCustomersApi, getDataCustomerApi, getDataQuestionCustomerApi } from './backend-api';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Report } from './convert.service';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { MyCustomers, CustomerInformation } from '../models/my-customers';
import HelperFn from '../helper/helper-fn';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: "root"
})

export class MyCustomersService {
    helperFn = new HelperFn();
    
    constructor( private api: ApiService, 
    private http: HttpClient) {}

    getListCustomers(): Observable<any> {
        let listCustomers = []
        return this.api.get(getListCustomersApi).pipe(
            map( data => {
               
                if (data.code === 200 && !isNullOrUndefined(data.data)) {

                    data.data.forEach(element => {
                        let customer = new MyCustomers();

                        customer.id = element.id;
                        customer.uuid = element.public_id;
                        
                        if (!isNullOrUndefined(element.preferred_name) && element.preferred_name != "") {
                            customer.customerName = element.preferred_name;
                        } else if (!isNullOrUndefined(element.firt_name) && !isNullOrUndefined(element.last_name)) {
                            customer.customerName = element.firt_name + " " + element.last_name;
                        } else {
                            customer.customerName = element.firt_name;
                        }

                        customer.email = element.email;
                        customer.phoneNumber = "(+" + element.phone_dial_code + ") " + element.phone_number;

                        listCustomers.push(customer);
                    });

                    return listCustomers;
                } else {
                    return data;
                }
            }), catchError(value => throwError(value))
        )
    }

    getCustomerDetail(uuid, version1, version2): Observable<any>{
        let param = new HttpParams();

        if (!isNullOrUndefined(uuid)) {
            param = param.append("uuid", uuid)
        } 
        if (!isNullOrUndefined(version1)) {
            param = param.append("version1", version1)
        } 
        if (!isNullOrUndefined(version2)) {
            param = param.append("version2", version2)
        }

        if (this.api.isEnable()) {
            return this.http.get<any>(getDataCustomerApi, {headers: this.api.headers, params: param}).pipe(
                map ( data => {
                   
                    if (data.code === 200 && !isNullOrUndefined(data.data)) {
                        let customer = new CustomerInformation();

                        customer.nameAsInIC = data.data.firt_name;
                        customer.nickName = data.data.preferred_name;
                        customer.preferredName = data.data.preferred_name;
                        
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

                                    element.order_items.forEach(e => {
                                        let product = new Product();
                                        product.currencyCode = e.currency_code;
                                        product.price = e.price;
                                        product.is_naep_product = e.is_naep_discount;
                                        product.productName = e.product_name;
                                        product.product = e.product
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
                                        
                                        product.productPhotoKey = this.renderAttachment(e.product.attachments);

                                        product.orderLineOnlineBankingPaymentGifts = this.aggregateGifts(e.order_line_bank_transfer_gifts);
                                        product.orderLineSinglePaymentGifts = this.aggregateGifts(e.order_line_single_paymt_gifts);

                                        order.listProduct.push(product);
                                    });
                                } 
                                customer.orderHistory.push(order);
                            });   
                        }
                       
                        return customer;
                    }
                })
            )
        }
    }

    getCustomerQuestionnaire(uuid, version1, version2): Observable<any>{
        let param = new HttpParams();

        if (!isNullOrUndefined(uuid)) {
            param = param.append("uuid", uuid)
        } 
        if (!isNullOrUndefined(version1)) {
            param = param.append("version1", version1)
        } 
        if (!isNullOrUndefined(version2)) {
            param = param.append("version2", version2)
        }

        if (this.api.isEnable()) {
            return this.http.get<any>(getDataQuestionCustomerApi, {headers: this.api.headers, params: param}).pipe(
                map ( data => {

                    if (data.code === 200 && !isNullOrUndefined(data.data)) {
                        let customer = new CustomerInformation();
                        if (data.data.questionnaire.length === 2) {
                            customer.questionnaireOne = data.data.questionnaire[0].answer;
                            customer.questionnaireTwo = data.data.questionnaire[1].answer;
                        } else if (data.data.questionnaire.length === 1) {
                            customer.questionnaireOne = data.data.questionnaire[0].answer;
                        } else {
                            customer.questionnaireOne = undefined;
                            customer.questionnaireTwo = undefined;
                        }  
    
                        return customer;
                    }
                })
            )
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
}

interface GiftDisplay {
    id: string;
    name: string;
    quantity: number;
  }



