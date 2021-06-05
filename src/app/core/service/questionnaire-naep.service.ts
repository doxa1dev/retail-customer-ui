import { DatePipe } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { isEmptyOrNullOrUndefined } from "app/main/account/profile/_helper/helper-fn";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { isNullOrUndefined } from "util";
import { QuestionnaireNaep } from "../models/questionnaire-naep.model";
import { CheckNullOrUndefinedOrEmpty } from "../utils/common-function";
import { getLocalDate } from "../utils/date.utils";
import { ApiService } from "./api.service";
import { createNaepIntroductionFormApi, getNaepIntroduction2FormApi, getNaepIntroductionFormApi } from "./backend-api";


@Injectable({
    providedIn: 'root'
})

export class QuestionnaireNaepService {
    constructor(
      private api: ApiService,
      private http: HttpClient,
      private datePipe: DatePipe) { }


    createNaepIntroductionForm(formQuestion) {
        return this.api.post(createNaepIntroductionFormApi, formQuestion);
    }

    getNaepIntroductionForm(): Observable<any> {
        return this.api.get(getNaepIntroductionFormApi).pipe(
            map( data => {
              
                if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data)) {
                    let questionnaireNaep = new QuestionnaireNaep();

                    questionnaireNaep.id = data.data.id;
                    questionnaireNaep.uuid= data.data.uuid; 
                    questionnaireNaep.customerName = 
                    data.data.preferred_name != "" ? data.data.preferred_name : data.data.firt_name;
                    questionnaireNaep.phoneNumerCustomer = "(+" + data.data.phone_dial_code + ") " + data.data.phone_number;
                    questionnaireNaep.dialCode = data.data.phone_dial_code;
                    questionnaireNaep.phoneNumer = data.data.phone_number;
                    questionnaireNaep.questionnaireNaepApprove = data.data.questionnaireNaepApprove;

                    if (!CheckNullOrUndefinedOrEmpty(data.data.recruiter)) {
                        questionnaireNaep.recruiterName = 
                        data.data.recruiter.preferred_name != "" ? data.data.recruiter.preferred_name : data.data.recruiter.firt_name;
                        questionnaireNaep.recruiterId = data.data.recruiter.advisor_id_number;
                    }

                    if (!CheckNullOrUndefinedOrEmpty(data.data.teamLeaderCustomer)) {
                        questionnaireNaep.teamManagerName =
                        data.data.teamLeaderCustomer.preferred_name != "" ? data.data.teamLeaderCustomer.preferred_name : data.data.teamLeaderCustomer.firt_name;
                        questionnaireNaep.teamManagerId = data.data.teamLeaderCustomer.advisor_id_number;
                    }

                    if (!CheckNullOrUndefinedOrEmpty(data.data.recruitment)) {
                        questionnaireNaep.startTime = this.datePipe.transform(data.data.recruitment[0].naepSalesCustomerProcess.start_time, 'MM/dd/yyyy') ;
                        questionnaireNaep.endTime = this.datePipe.transform(data.data.recruitment[0].naepSalesCustomerProcess.end_time, 'MM/dd/yyyy');
                    }
                    return questionnaireNaep;
                }
            })
        )
    }


    
    getNaepIntroductionFormByUuid(uuid): Observable<any> {
        let param = new HttpParams();
        if (!CheckNullOrUndefinedOrEmpty(uuid)) {
            param = param.append('uuid', uuid);
        }
        if (this.api.isEnable()) {
            return this.http.get<any>(getNaepIntroduction2FormApi, {headers: this.api.headers, params: param }).pipe(
                map( data => {  
                   // console.log(data)
                    if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
                        
                        let questionnaireNaep = new QuestionnaireNaep();
                        
                        questionnaireNaep.id = data.data.id;
                        questionnaireNaep.customerName = data.data.preferred_name;
                        questionnaireNaep.phoneNumerCustomer = "(+" + data.data.phone_dial_code + ") " + data.data.phone_number;
                        questionnaireNaep.dialCode = data.data.phone_dial_code;
                        questionnaireNaep.phoneNumer = data.data.phone_number;
                        
                        if(!CheckNullOrUndefinedOrEmpty(data.data.questionnaireNaepApprove)) {
                            questionnaireNaep.questionnaireNaepApprove = data.data.questionnaireNaepApprove;
                        } else {
                            questionnaireNaep.questionnaireNaepApprove = null;
                        }
                      
                        if (!CheckNullOrUndefinedOrEmpty(data.data.teamLeaderCustomer)) {
                            questionnaireNaep.teamManagerName = data.data.teamLeaderCustomer.preferred_name;
                            questionnaireNaep.teamManagerId = data.data.teamLeaderCustomer.advisor_id_number; 
                        }
                        
                        if (!CheckNullOrUndefinedOrEmpty(data.data.contactPerson)) { 
                            questionnaireNaep.recruiterName = data.data.contactPerson.preferred_name;
                            questionnaireNaep.recruiterId = data.data.contactPerson.advisor_id_number;
                        } else {
                            questionnaireNaep.recruiterName = ' ';
                            questionnaireNaep.recruiterId = ' '
                        }

                        return questionnaireNaep;
                        
                    } else if (data.code === 202 || CheckNullOrUndefinedOrEmpty(data.data) ||
                        data.data.questionnaireNaepApprove.is_answer === false ) {
                        return {};
                    }
                }), catchError(value => throwError(value))
            );
        }
    }


}