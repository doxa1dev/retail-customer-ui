import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpParams, HttpClient } from "@angular/common/http";
import { map, catchError, combineAll } from "rxjs/operators";
import { getlistRecruitApi, getDetailRecruitApi, recruitApproveOrRejectApi} from "./backend-api";
import { listRecruit, customer, status, recruitDetail } from "../models/list_recruit.model";
import { Observable, throwError } from "rxjs";
import { ApiService } from "./api.service";
import { isNullOrUndefined } from "util";
import { formatDate, formatCurrency } from "@angular/common";
import * as moment from "moment";
import { RecruitEnum} from 'app/core/enum/recruit'
import { IGetRowsParams } from 'ag-grid-community';
@Injectable({
    providedIn: "root",
})
export class TeamdLeaderService
{
    constructor(private api: ApiService, private http: HttpClient) { }

    getlistRecruit(params: IGetRowsParams , page  , limit){
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
        if(this.api.isEnable()){
            return this.http.get<any>(getlistRecruitApi, { headers: this.api.headers, params: param })
            .pipe(map ((data)=>{
               
                if(data.code === 200)
                {
                    let returnListRecruit = [];
                    data.data.forEach(element => {
                        let recruit = new listRecruit();
                        let customerdetail = new customer();
                        customerdetail.customer_name = isNullOrUndefined(element.customer.preferred_name) ? element.customer.firt_name : element.customer.preferred_name;
                        customerdetail.email = element.customer.email;
                        customerdetail.dial_code = element.customer.phone_dial_code;
                        customerdetail.phone_number = element.customer.phone_number;
                        let statusdetail = new status();
                        statusdetail.recruit_uuid = element.uuid;
                        statusdetail.recruit_status = element.status;
                        recruit.customer = customerdetail;
                        recruit.status = statusdetail;
                        returnListRecruit.push(recruit)
                    });
                    return {returnListRecruit , count: data.count};
                }
                
    
            }))
        }
        
    }
    getRecruitDetail(uuid : string)
    {
        let url = getDetailRecruitApi.replace(':UUID',uuid);
        return this.api.get(url).pipe(map ((data)=>{
            if(data.code === 200)
            {
                let returnRecruitDetail  = new recruitDetail();
                returnRecruitDetail.status = data.data.status;
                returnRecruitDetail.name = isNullOrUndefined(data.data.customer.preferred_name) ? data.data.customer.firt_name : data.data.customer.preferred_name;
                returnRecruitDetail.email = data.data.customer.email;
                returnRecruitDetail.phone_number = '(+' + data.data.customer.phone_dial_code + ')' + data.data.customer.phone_number;
                returnRecruitDetail.photo_key = data.data.customer.profile_photo_key;
                returnRecruitDetail.advisor_id = data.data.recruiterCustomer.advisor_id_number;
                returnRecruitDetail.advisor_name = isNullOrUndefined(data.data.recruiterCustomer.preferred_name) ? data.data.recruiterCustomer.firt_name : data.data.recruiterCustomer.preferred_name;
                returnRecruitDetail.bank_code = data.data.customer.bank_code;
                returnRecruitDetail.bank_account = data.data.customer.bank_account;
                returnRecruitDetail.bank_holder = data.data.customer.bank_holder;
                returnRecruitDetail.bank_holder_ic = data.data.customer.bank_holder_ic;
                returnRecruitDetail.comment = data.data.comment;
                return returnRecruitDetail
            }
            
        }))
    }
    recruitApproveOrReject(uuid : string, formSubmit){
        let url = recruitApproveOrRejectApi.replace(':UUID',uuid)
        return this.api.put(url,formSubmit)
    }
    
}
