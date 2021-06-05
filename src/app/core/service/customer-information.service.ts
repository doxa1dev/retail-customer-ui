
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { updateCustomerInformationApi, updateCustomerInformationÁnomynoudApi } from './backend-api';
import { ApiService } from './api.service'

import { CustomerInformation } from '../models/customer-infomation.model';
import { Observable } from "rxjs";
import { isNullOrUndefined } from "util";
import { searchAssignAdvisor } from "./backend-api";
import { CustomerInfor } from '../models/customer-infor.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerInformationService
{

    constructor(
        private http: HttpClient,
        private router: Router,
        private api: ApiService
    ) { }

    updateDeliveryAddress(customerInformation: CustomerInformation, id: string)
    {
        var url = updateCustomerInformationApi.replace(':id',id)
        return this.api.put(url,customerInformation);
    }

    updateCustmerInformation(customerInformation: CustomerInformation, id: string)
    {
        var url = updateCustomerInformationApi.replace(':id',id)
        return this.api.put(url,customerInformation);
    }


    updateCustmerInformationForAnomynous(customerInformation: CustomerInformation, id: string)
    {
        var url = updateCustomerInformationÁnomynoudApi.replace(':id',id)
        return this.api.put(url,customerInformation);
    }

    searchAdvisorByAdvisorId(advisorId): Observable<any> {
        if (!isNullOrUndefined(advisorId)) {

          let url = searchAssignAdvisor.replace(":id", advisorId);
          return this.api.get(url).pipe(
            map(data => {
              if (data.code === 200) {
                let advisor = new CustomerInfor();
                if (!isNullOrUndefined(data.advisor_display)) {
                  if (!isNullOrUndefined(data.advisor_display.firt_name) &&
                  data.advisor_display.firt_name != "") {
                  advisor.advisorName = data.advisor_display.firt_name;
                  }

                  else if (!isNullOrUndefined(data.advisor_display.preferred_name) &&
                    data.advisor_display.preferred_name != "") {
                    advisor.advisorName = data.advisor_display.preferred_name;
                  }
                  else {
                    advisor.advisorName = " ";
                  }
    
                  advisor.advisorId = data.advisor_display.advisor_id;
                  advisor.advisorPhotoKey = data.advisor_display.profile_photo_key;
                  advisor.phoneNumberFull = "(+" + data.advisor_display.phone_dial_code + ")" + ' ' + data.advisor_display.phone_number
                  return advisor;
                }
              }
            }));
          }
      }
}
