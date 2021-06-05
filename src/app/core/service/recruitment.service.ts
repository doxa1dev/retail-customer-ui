import { Injectable } from "@angular/core";

import { HttpErrorResponse, HttpParams, HttpClient } from "@angular/common/http";
import { retry, map, catchError, combineAll } from "rxjs/operators";
import {
  searchCustomer,
  getSubmissionHistory,
  updateBankCustomer,
  createRecruitment,
  getCustomerByUuid,
  CreateRecruitmentApi,
  advisorGetNAEPCustomerDetailApi,
  inviteNewContactApi,
  checkInvalidPackageApi,
  checkRouterNaepApi,
  inviteNewContactViaWhatsappApi
} from "./backend-api";
import { Observable, throwError } from "rxjs";
import { ApiService } from "./api.service";
import { isNullOrUndefined } from "util";
import { formatDate, formatCurrency } from "@angular/common";
import * as moment from "moment";
import { CustomerInformation } from "../models/customer-infomation.model";
import { customer, status, listRecruit, RecruiterCustomer } from '../models/list_recruit.model';
import { RecruitEnum } from '../enum/recruit';
import { IGetRowsParams } from 'ag-grid-community';
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';

@Injectable({
  providedIn: "root",
})
export class RecruitmentService {
  constructor(
    private api: ApiService,
    private http: HttpClient) { }

  /**
   * get All Submission History
   */
  getSubmissionHistory(params: IGetRowsParams , page  , limit): Observable<any> {
    let param = new HttpParams();
    if(!isNullOrUndefined(page)){
      param = param.append('page', page);
    }
    if(!isNullOrUndefined(limit)){
      param = param.append('limit', limit);
    }
    if(!isNullOrUndefined(params) && !isNullOrUndefined(params.filterModel)){
      if(!isNullOrUndefined(params.filterModel.customer)){
        param = param.append('name', params.filterModel.customer.filter);
      }
    }
    if(!CheckNullOrUndefinedOrEmpty(params) && !CheckNullOrUndefinedOrEmpty(params.filterModel)){
      if(!CheckNullOrUndefinedOrEmpty(params.filterModel.recruitedby)){
        param = param.append('advisor_name', params.filterModel.recruitedby.filter);
      }
    }
    if(this.api.isEnable()){
      let returnListRecruit = [];
      return this.http.get<any>(getSubmissionHistory, { headers: this.api.headers, params: param })
      .pipe(
        map(data => {
          if (data.code === 200 && !isNullOrUndefined(data.data)) {
            data.data.forEach((element) => {
  
              let customerdetail = new customer();
              customerdetail.email = element.customer.email;
              customerdetail.customerUuid = element.customer.public_id;
              customerdetail.phone_number = "(+" + element.customer.phone_dial_code + ") " + element.customer.phone_number;
              customerdetail.customer_name = !CheckNullOrUndefinedOrEmpty(element.customer.preferred_name) ? element.customer.preferred_name : element.customer.firt_name;
              customerdetail.uuid = element.uuid;

              let statusdetail = new status();
              // statusdetail.recruit_status = element.status2;
              statusdetail.recruit_status = element.status;

              let recruiterCustomer = new RecruiterCustomer();
              if (!CheckNullOrUndefinedOrEmpty(element.recruiterCustomer)) {
                recruiterCustomer.recruiterId = element.recruiterCustomer.advisor_id_number;
                recruiterCustomer.recruiterName = element.recruiterCustomer.firt_name;
              }

              let recruit = new listRecruit();
              recruit.customer = customerdetail;
              recruit.status = statusdetail;
              recruit.recruitedby = recruiterCustomer;

              returnListRecruit.push(recruit);
            });
            
            return {returnListRecruit , count: data.count};
          }
        })
      );
    }
      
  }

  /**
   * search customer by name or email
   * @param name
   */
  searchCustomerByName(name): Observable<any> {
    var listCustomer = new Array<CustomerInformationNewAdvisor>();
    var param = new HttpParams();
    if (!isNullOrUndefined(name)) {
      param = param.append('name', name);
    }

    if (this.api.isEnable()) {
      return this.http.get<any>(searchCustomer, { headers: this.api.headers, params: param }).pipe(
        map((data) => {
          if (data.code === 200 && !isNullOrUndefined(data.data)) {
            data.data.forEach((element) => {

              var customerData = new CustomerInformationNewAdvisor();

              customerData.customerUuid = element.public_id;
              // if (isNullOrUndefined(element.firt_name)) {
              //   customerData.customerName = element.last_name;
              // } else if (isNullOrUndefined(element.last_name)) {
              //   customerData.customerName = element.firt_name;
              // } else {
              //   customerData.customerName = element.firt_name + " " + element.last_name;
              // }
              customerData.customerName = element.firt_name;
              customerData.customerImage = element.profile_photo_key;
              customerData.customerEmail = element.email;
              customerData.customerPhoneNumber = "(+" + element.phone_dial_code + ") " + element.phone_number;

              listCustomer.push(customerData);
            });

            return listCustomer;
          }
        }), catchError(value => throwError(value))
      );
    }
  }

  /**
   * get Customer by Uuid
   * @param uuid 
   */
  getCustomerByUuid(uuid): Observable<any> {
    var param = new HttpParams();
    param = param.append('uuid', uuid);

    if (this.api.isEnable()) {
      return this.http.get<any>(getCustomerByUuid, { headers: this.api.headers, params: param }).pipe(
        map(data => {
          if (data.code === 200 && !isNullOrUndefined(data.data)) {
            var customerData = new CustomerInformationNewAdvisor();

            // if (isNullOrUndefined(data.data.firt_name)) {
            //   customerData.customerName = data.data.last_name;
            // } else if (isNullOrUndefined(data.data.last_name)) {
            //   customerData.customerName = data.data.firt_name;
            // } else {
            //   customerData.customerName = data.data.firt_name + " " + data.data.last_name;
            // }

            customerData.customerId = data.data.id;
            customerData.customerName = (data.data.preferred_name !== "") ? data.data.preferred_name : data.data.firt_name;
            customerData.customerImage = data.data.profile_photo_key;
            customerData.customerEmail = data.data.email;
            customerData.customerPhoneNumber = "(+" + data.data.phone_dial_code + ") " + data.data.phone_number;

            return customerData;
          }
        })
      );
    }
  }

  /**
   * Create Recruitment 
   * @param formCustomer 
   */
  createRecruitment(formCustomer) {
    return this.api.post(createRecruitment, formCustomer);
  }

  /**
   * Update by Bank Customer
   * @param formUpdateCustomer 
   */
  updateCustomer(formUpdateCustomer, uuid) {
    var param = new HttpParams();
    param = param.append('uuid', uuid);
    if (this.api.isEnable()) {
      return this.http.put<any>(updateBankCustomer, formUpdateCustomer, { headers: this.api.headers, params: param });
    }
  }


  /**
   * Update by Bank Customer
   * @param formUpdateCustomer 
   */
  createRecruitmentByAdvisor(uuid) {
    var param = new HttpParams();
    param = param.append('uuid', uuid);
    if (this.api.isEnable()) {
      return this.http.post<any>(CreateRecruitmentApi, '', { headers: this.api.headers, params: param });
    }
  }


  /**
   * invite new contact
   * @param name 
   * @param email 
   */
  inviteNewContactByName(name, email) {
    var param = new HttpParams();
    param = param.append('preferred_name', name);
    param = param.append('email', email);

    if (this.api.isEnable()) {
      return this.http.post<any>(inviteNewContactApi, '', { headers: this.api.headers, params: param })
      .pipe(catchError(this.handleError));
    }
  }

  inviteNewContactbyWhatsapp (name, email) {
    var param = new HttpParams();
    param = param.append('preferred_name', name);
    param = param.append('email', email);

    if (this.api.isEnable()) {
      return this.http.post<any>(inviteNewContactViaWhatsappApi, '', { headers: this.api.headers, params: param })
      .pipe(catchError(this.handleError));
    }
  }

  private handleError(error: HttpErrorResponse) {
 //  let error2=number
    if (error.error instanceof ErrorEvent) {
        console.error('An error occurred:', error.error.message);
    } else { 
      // alert('Unauthorized Access. You are not allowed to access this page.')
      console.log(
        `Back-end return code: ${error.status}\n` +
        `Body content: ${error.error}`);
        return "0"
      }
      return throwError(
        'Something bad happened. Please try again later.');
}


  checkInvalidPackage(cart_id ) {
    let param = new HttpParams();
    param = param.append('cart_id', cart_id);
    if (this.api.isEnable()) {
      return this.http.get<any>(checkInvalidPackageApi, { headers: this.api.headers, params : param }).pipe(map(data=>{
        return data;
      }))
    }
  }

  checkRouterNaep()  : Observable<any>
  {
    if (this.api.isEnable()) {
      return this.http.get<any>(checkRouterNaepApi, { headers: this.api.headers }).pipe(map(data=>{
        return data;
      }))
    }
  }


  

}

export class CustomerInformationNewAdvisor {
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  customerImage: string;
  bankCode: string;
  bankAccount: string;
  bankHolder: string;
  bankHolderIC: string;
  customerUuid: string;
  comment: string;
  status: string;
  customerId: string;
}
