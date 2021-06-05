import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { map, catchError, combineAll } from "rxjs/operators";
import { getAllWarrantiedApi, warrantiedDetailApi, warrantiedHistoryApi} from "./backend-api";
import { Product } from "../models/product.model";
import { Observable, throwError } from "rxjs";
import { ApiService } from "./api.service";
import { isNullOrUndefined } from "util";
import { formatDate, formatCurrency } from "@angular/common";
import * as moment from "moment";
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';

@Injectable({
  providedIn: "root",
})
export class WarrantiedService {
  constructor(private api: ApiService) {}

  /**
   * get All Warrantied by Status
   */
  getAllWarrantied(): Observable<any> {
    return this.api.get(getAllWarrantiedApi).pipe(
      map((data) => {
        var listWarrantied = new Array<Warrantied>();
        if (data.code === 200) {
          data.data.forEach((data) => {
            var warrantiedData = new Warrantied();
            warrantiedData.productName = data.product.product_name;
            warrantiedData.currency = data.product.currency_code
            warrantiedData.orderNumber = data.order_id;
            warrantiedData.serialNumber = data.serial_number;
            warrantiedData.warrantyPeriod = data.warranty_duration_in_days + " days";
            warrantiedData.translations = data.product.translations;
            if(data.order !== null && data.order !== undefined){
              warrantiedData.orderIdTmm = data.order.order_id_tmm;
            }
            if(!isNullOrUndefined(data.warranty_start_date)){
              warrantiedData.warrantyStartDate = formatDate(data.warranty_start_date, "dd/MM/yyyy", "en-US");
            }
            if(!isNullOrUndefined(data.warranty_end_date)){
              warrantiedData.warrantyExpired = formatDate(data.warranty_end_date, "dd/MM/yyyy", "en-US");
            }           
            warrantiedData.uuid = data.uuid;
            warrantiedData.productImage =  this.renderImageIsCover(data.product.attachments)

            // warrantiedData.productPrice = CheckNullOrUndefinedOrEmpty(data.Orderlineitem) ? 0 : data.Orderlineitem.price;
            // if (isNullOrUndefined(data.product.promotional_price)) {
            //   warrantiedData.productPrice = '10'
            // } else {
            //   warrantiedData.productPrice = '10'
            // }

            if (isNullOrUndefined(data.customer)) {
              warrantiedData.customerName = " ";
            } else if (isNullOrUndefined(data.customer.firt_name)) {
              warrantiedData.customerName = data.customer.last_name
            } else if (isNullOrUndefined(data.customer.last_name)){
              warrantiedData.customerName = data.customer.firt_name
            } else {
              warrantiedData.customerName = data.customer.firt_name + " " + data.customer.last_name;
            }

            if (!isNullOrUndefined(data.advisor)) {
              warrantiedData.advisorID = data.advisor.advisor_id_number;
              if(!CheckNullOrUndefinedOrEmpty(data.advisor.preferred_name)){
                warrantiedData.advisorName = data.advisor.preferred_name
              }else {
                warrantiedData.advisorName = data.advisor.firt_name + data.advisor.last_name
              }
            }
            warrantiedData.productPrice = CheckNullOrUndefinedOrEmpty(data.Orderlineitem) ? 0 : data.Orderlineitem.price;
            
            if (data.status === "IN WARRANTY") {
              warrantiedData.status = "In warranty"
            } else if (data.status === "IN SHIPPING") {
              warrantiedData.status = "Warranty not activated"
            } else if (data.status === "WARRANTY EXPIRED") {
              warrantiedData.status = "Warranty expired"
            }
          
            listWarrantied.push(warrantiedData);
          });

          return listWarrantied;
        }
      }),
      catchError((data) => throwError(data))
    );
  }

  /**
   * get Warrantied Product By ID
   */
  getWarrantiedProductById(id): Observable<any> {
    var warrantiedData = new Warrantied()
    var url = warrantiedDetailApi.replace(":id", id)

    return this.api.get(url).pipe(
      map( (data) => {
        if (data.code === 200 && !isNullOrUndefined(data.data)) {
          warrantiedData.productName = data.data.product.product_name
          warrantiedData.orderNumber = data.data.order_id
          warrantiedData.serialNumber = data.data.serial_number;
          warrantiedData.currency = data.data.product.currency_code
          if(data.data.order !== null && data.data.order !== undefined){
            warrantiedData.orderIdTmm = data.data.order.order_id_tmm;
          }
          // warrantiedData.status = data.data.status
          warrantiedData.productImage =  this.renderImageIsCover(data.data.product.attachments)
          warrantiedData.productPrice = CheckNullOrUndefinedOrEmpty(data.data.Orderlineitem) ? 0 : data.data.Orderlineitem.price;

          if (!isNullOrUndefined(data.data.advisor)) {
            warrantiedData.advisorID = data.data.advisor.advisor_id_number
            if(!isNullOrUndefined(data.data.advisor.preferred_name)){
              warrantiedData.advisorName = data.data.advisor.preferred_name;
            }else if(!isNullOrUndefined(data.data.advisor.firt_name)){ 
              if (!isNullOrUndefined(data.data.advisor.last_name)){
                warrantiedData.advisorName = data.data.advisor.firt_name + " " + data.data.advisor.last_name;
              }else{
                warrantiedData.advisorName = data.data.advisor.firt_name;
              }
            }
          } 

          if (isNullOrUndefined(data.data.customer)) {
            warrantiedData.customerName = " ";
          } else if (isNullOrUndefined(data.data.customer.firt_name)) {
            warrantiedData.customerName = data.data.customer.last_name
          } else if (isNullOrUndefined(data.data.customer.last_name)){
            warrantiedData.customerName = data.data.customer.firt_name
          } else {
            warrantiedData.customerName = data.data.customer.firt_name + " " + data.data.customer.last_name
          }

          warrantiedData.customerPhoneNumber = "(+" + data.data.customer.phone_dial_code + ") " + data.data.customer.phone_number
          warrantiedData.customerEmail = data.data.customer.email

          data.data.history.forEach(element => {

            var warrantiedList = new WarrantyHistory()
            warrantiedList.createdAt = formatDate(element.created_at, "dd/MM/yyyy", "en-US")
            warrantiedList.comment = element.comment
            // warrantiedList.createdById = element.created_by_id
            // warrantiedList.id = element.id
            // warrantiedList.warrantiedProductId = element.warrantied_product_id

            warrantiedData.warrantyHistory.push(warrantiedList)
          });

          if (data.data.status === "IN WARRANTY") {
            warrantiedData.status = "In warranty"
          } else if (data.data.status === "IN SHIPPING") {
            warrantiedData.status = "Warranty not activated"
          } else if (data.data.status === "WARRANTY EXPIRED") {
            warrantiedData.status = "Warranty expired"
          }
          
          warrantiedData.warrantyPeriod = data.data.warranty_duration_in_days + " days"
          if(!isNullOrUndefined( data.data.warranty_start_date)){
            warrantiedData.warrantyStartDate = formatDate(data.data.warranty_start_date, "dd/MM/yyyy", "en-US")
          }
          if(!isNullOrUndefined(data.data.warranty_end_date)){
          warrantiedData.warrantyExpired = formatDate(data.data.warranty_end_date, "dd/MM/yyyy", "en-US")
          }

          warrantiedData.translations = data.data.product.translations;
        }

        return warrantiedData;
      })
    )
  }
  
  renderImageIsCover(data): string{
    var storageKey = ""
    if(!isNullOrUndefined(data) && data.length > 0){
        data.forEach(element => {
            if(element.is_cover_photo === true){
                storageKey =  element.storage_key
            }
        });
    }
    return storageKey
}

}

export class Warrantied {
  productName: string;
  productPrice: string;
  productImage: string;
  serialNumber: string;
  orderNumber: string;
  orderIdTmm: number;
  warrantyPeriod: string;
  warrantyStartDate: string;
  warrantyExpired: string;
  customerName: string;
  customerPhoneNumber: string;
  customerAddress: string;
  customerEmail: string;
  advisorID: string;
  advisorName: string;
  id: string;
  warrantyHistory: WarrantyHistory[] = [];
  status: string;
  uuid: string;
  currency: string;
  translations: any[];
}

export class WarrantyHistory {
  comment: string;
  createdAt: string;
  // createdById: string;
  // id: string;
  // warrantiedProductId: string;
}
