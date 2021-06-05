import { Injectable } from "@angular/core";

import { HttpErrorResponse, HttpParams, HttpClient } from "@angular/common/http";
import { retry, map, catchError, combineAll } from "rxjs/operators";
import {
    JustHostCreateApi , JustHostApi, GetAllJustHostApi, GetGiftJustHostApi
} from "./backend-api";
import { Observable, throwError } from "rxjs";
import { ApiService } from "./api.service";
import { formatDate, formatCurrency } from "@angular/common";
import * as moment from "moment";
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';
import { OrderJustHost } from "../models/order.model";
import { GiftComponent } from "./order.service";
import { PROPERTY } from "app/main/product-detail/product-detail.component";

@Injectable({
  providedIn: "root",
})
export class JustHostService {
  constructor(
    private api: ApiService,
    private http: HttpClient) { }

    createJustHost(formJustHost){
        return this.api.post(JustHostCreateApi , formJustHost)
    }

    getJustHostDetail(event_id){
        let param = new HttpParams();
        if (!CheckNullOrUndefinedOrEmpty(event_id)){
            param = param.append('event_id', event_id);
        }
        if(this.api.isEnable()){
            return this.http.get<any>(JustHostApi , {headers: this.api.headers , params: param}).pipe(
                map(data=>{
                    if(data.code === 200){
                        let result;
                        result = this.renderDataEventDetail(data.data);
                        return result;
                    }
                })
            )
        }

    }

    getAllJustHostCustomer(){
        return this.api.get(GetAllJustHostApi).pipe(
            map(data=>{
                if(data.code === 200){
                    let result;
                    result = this.renderAllEvent(data.data);
                    return result;
                }
            })
        )
    }

    getAllGift(){
        return this.api.get(GetGiftJustHostApi).pipe(
            map(data=>{
                if(data.code === 200){
                    let result;
                    result = this.renderAllGift(data.data);
                    return result;
                }
            })
        )
    }

    updateStatusEvent(formUpdate){
        return this.api.put(JustHostApi, formUpdate);
    }

    renderAllGift(data){
                // console.log('data' , data)
        if(!CheckNullOrUndefinedOrEmpty(data) && !CheckNullOrUndefinedOrEmpty(data.just_host_items)){
            let result = [];
            let select_gift = [];
            data.just_host_items.forEach(element => {
                let gift = new JustHostItem();
                let item = new GiftComponent();
                item.host_gift_id = element.id;
                item.is_main_gift_product = true;
                item.product_id = element.product?.id;
                item.product_name = element.product?.product_name;
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
                item.hasAdvisor =  element.product?.has_advisor;
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
                if(!CheckNullOrUndefinedOrEmpty(element.just_host_item_component)){
                    element.just_host_item_component.forEach(e => {
                        let item_component = new GiftComponent();
                        item_component.is_main_gift_product = false;
                        item_component.product_id = e.gift_product_id;
                        item_component.product_name = e.product?.product_name
                        gift.component.push(item_component);
                    });
                }
                select_gift.push({ value: Number(element.id), label: element.product?.product_name })
                result.push(gift)

            });
            return {result: result , select_gift: select_gift};
        }else{
            return []
        }
    }

    renderAllEvent(data){
        if(!CheckNullOrUndefinedOrEmpty(data)){
            let result = [];
            data.forEach(element => {
                let order = new OrderJustHost();
                order.expired_date = formatDate(element.expired_date , "dd-MM-yyyy", "en-US");
                order.demo_date = formatDate(element.demo_date , "dd-MM-yyyy", "en-US");
                order.request_date = formatDate(element.created_at , "dd-MM-yyyy", "en-US");
                order.id = element.id;
                order.status = element.status == JustHostBackEndStatus.NOT_YES 
                ? JustHostRenderUIStatus.REDEEMABLE 
                : (element.status == JustHostBackEndStatus.REDEEMED ? JustHostRenderUIStatus.REDEEMED 
                    : (element.status == JustHostBackEndStatus.EXPIRED ? JustHostRenderUIStatus.EXPIRED 
                        : (element.status == JustHostBackEndStatus.REJECTED ? JustHostRenderUIStatus.REJECTED 
                            : (element.status == JustHostBackEndStatus.PENDING ? JustHostRenderUIStatus.PENDING : ''))))
                order.request_id = this.renderRequestId(element.entity_id , element.request_id);
                order.time_left = !CheckNullOrUndefinedOrEmpty(element.expired_date) ? (Math.round(((new Date(element.expired_date)).getTime() - (new Date()).getTime())/(1000 * 3600 * 24))) : (-1);
                order.checkRedeem = true;
                result.push(order)
            });
            return result;
        }else{
            return []
        }
    }

    renderRequestId(entity_id , request_id){
        if(!CheckNullOrUndefinedOrEmpty(request_id)){
            let len = request_id.toString().length;
            if(len > 6){
                return (Number(entity_id) == 2) ? ('MH' +  request_id.toString()) : ('SG' +  request_id.toString())
            }else{
                let zeroString = '0000000';
                return (Number(entity_id) == 2) ? ('MH' + zeroString.substring(0,6 - len) + request_id.toString()) : ('SG' +  zeroString.substring(0,6 - len) + request_id.toString())
            }
        }else{
            return (Number(entity_id) == 2) ? 'MH000000' : 'SG000000';
        }
    }

    renderDataEventDetail(data){
        if(!CheckNullOrUndefinedOrEmpty(data)){
            let detail = new JustHostDetail();
            detail.host_name = data.host_name;
            detail.host_contact_number = data.host_contact_number;
            detail.demo_date = formatDate(data.demo_date , "dd-MM-yyyy", "en-US");
            detail.address = data.address_line1 + ', ' + data.address_line2 + ', ' + data.address_line3;
            detail.postal_code = data.postal_code;
            detail.demo_photo = data.demo_photo;
            detail.comment = data.comment;
            if(!CheckNullOrUndefinedOrEmpty(data.guest)){
                data.guest.forEach(element => {
                    let guest = new JustHostGuest();
                    guest.guest_contact_number = element.guest_contact_number;
                    guest.guest_name = element.guest_name;
                    detail.guest.push(guest);
                });
            }

            return detail
        }else{
            return null
        }
    }
}

export class FormJustHost{
    host_name:string;
    host_contact_number: string;
    demo_date: Date
    address_line1: string;
    address_line2: string;
    address_line3: string;
    demo_photo: string;
    postal_code : string;
    guest : Array<JustHostGuest> = [];
}

export class JustHostDetail{
    host_name:string;
    host_contact_number: string;
    demo_date: string;
    address: string;
    demo_photo: string;
    postal_code : string;
    guest : Array<JustHostGuest> = [];
    comment: string;
}

export class JustHostGuest{
    guest_name: string;
    guest_contact_number: string;
}

export class JustHostItem{
    id: number;
    component: Array<GiftComponent> = [];
}

export enum JustHostBackEndStatus{
    NOT_YES = 'NOT_YES',
    REDEEMED = 'REDEEMED',
    EXPIRED = 'EXPIRED',
    REJECTED = "REJECTED",
    PENDING = "PENDING"
}

export enum JustHostRenderUIStatus{
    REDEEMABLE = 'Redeemable',
    REDEEMED = 'Redeemed',
    EXPIRED = 'Expired',
    REJECTED = "Rejected",
    PENDING = "Pending Approval"
}