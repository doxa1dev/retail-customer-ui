import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpParams, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

import { questionnaireOneApi, questionnaireOneRegisterApi, questionnaireTwoRegisterApi, 
    getDataQuestion1Api, getDataQuestion2Api, getDataQuestionnaireReportApi } from './backend-api';
import { questionnaireTwoApi } from './backend-api';

import { QueryFormOne } from '../models/query-form-one.model';
import { QueryFormTwo } from '../models/query-form-two.model';

import { ApiService } from './api.service';
import { QuestionTwo } from '../models/question-two';
import { isNullOrUndefined } from 'util';
import { QuestionOne } from '../models/question-one';
import { QuestionnaireReport } from '../models/questionnaire-report';
import { P2_Q1, P2_Q2, P2_Q3, P2_Q4, P2_Q5, P2_Q6, P2_Q7, P2_Q8, Q1_DATA, Q3_DATA, Q4_DATA, Q5_DATA, P2_Q9_MODEL } from '../constants/constant';

@Injectable({
    providedIn: 'root'
})
export class QuestionnaireService {
    q1data = P2_Q1;
    q2data = P2_Q2;
    q3data = P2_Q3;
    q4data = P2_Q4;
    q5data = P2_Q5;
    q6data = P2_Q6;
    q7data = P2_Q7;
    q8data = P2_Q8;
    q9Model = P2_Q9_MODEL;
    q10data = Q1_DATA;
    q12data = Q3_DATA;
    q13data = Q4_DATA;
    q14data = Q5_DATA;

    constructor(private api: ApiService,
        private http: HttpClient) { }

    getQuestionnaireOne(version: string, isRegistered: boolean, token: string) {
        var param = new HttpParams();
        param = param.append('version', version);
        if(!isRegistered){
            param = param.append('token', token);
        }
        var url = isRegistered === true ? questionnaireOneApi : questionnaireOneRegisterApi
        return this.http.get<any>(url, {headers: this.api.headers, params: param }).pipe(
            map(data => {
                return data
            })
        );
    }

    updateQuestionnaireOne(version: string, queryFormOne, isRegistered: boolean, token: string, advisor_id : string) {
        var param = new HttpParams();
        param = param.append('version', version);
        param = param.append('advisor_id' , advisor_id)
        if(!isRegistered){
            param = param.append('token', token);
        }
        var url = isRegistered === true ? questionnaireOneApi : questionnaireOneRegisterApi
        return this.http.post<any>(url, queryFormOne, {headers: this.api.headers, params: param }).pipe(retry(3), catchError(this.handleError));
    }

    getQuestionnaireTwo(version: string, isRegistered: boolean, token: string) {
        var param = new HttpParams();
        param = param.append('version', version);
        if(!isRegistered){
            param = param.append('token', token);
        }
        var url = isRegistered === true ? questionnaireTwoApi : questionnaireTwoRegisterApi
        return this.http.get<any>(url, {headers: this.api.headers, params: param }).pipe(
            map(data => {
                return data
            })
        );
    }

    updateQuestionnaireTwo(version: string, queryFormTwo: QueryFormTwo, isRegistered: boolean, token: string, advisor_id) {
        var param = new HttpParams();
        param = param.append('version', version);
        param = param.append('advisor_id' , advisor_id)
        if(!isRegistered){
            param = param.append('token', token);
        }
        var url = isRegistered === true ? questionnaireTwoApi : questionnaireTwoRegisterApi
        return this.http.post<any>(url, queryFormTwo, {headers: this.api.headers, params: param }).pipe(retry(3), catchError(this.handleError));

    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The back-end returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Back-end return code: ${error.status}\n` +
                `Body content: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
            'Something bad happened. Please try again later.');
    }

    getDataQuestionnaireOne(version) {
        let param = new HttpParams();

        if (!isNullOrUndefined(version)) {
            param = param.append('version', version); 
        }

        if (this.api.isEnable()) {
            return this.http.get<any>(getDataQuestion1Api, {headers: this.api.headers, params: param}).pipe(
                map (data => {
                    if (data.code === 200 && !isNullOrUndefined(data.data)) {
                        let question1 = new QuestionOne();

                        if (!isNullOrUndefined(data.data.answer)) {
                            let dataone = data.data.answer;
                            question1.userType = dataone.userType;
                            question1.name = dataone.name;
                            question1.email = dataone.email;
                            question1.address = dataone.address;
                            question1.postalCode = dataone.postalCode;
                            question1.dialCode = dataone.dialCode;
                            question1.phoneNum = dataone.phoneNum;
                            
                            question1.p2q1 = dataone.p2q1;
                            question1.p2q2 = dataone.p2q2;
    
                            if (!isNullOrUndefined(dataone.p2q2Text)) {
                                question1.p2q2Text = dataone.p2q2Text;
                            }
    
                            question1.p2q3 = dataone.p2q3;
                            question1.p2q4 = dataone.p2q4;
                            question1.p2q5 = dataone.p2q5;
                            question1.p2q6 = dataone.p2q6;
                            question1.p2q7 = dataone.p2q7;
                            question1.p2q8 = dataone.p2q8;
                            question1.p2q9 = dataone.p2q9;
                            question1.p2q9Model = CheckNullOrUndefinedOrEmpty(dataone.p2q9Model) ? null :  dataone.p2q9Model;
                            if (!isNullOrUndefined(dataone.p2q8Text)) {
                                question1.p2q8Text = dataone.p2q8Text;
                            }
                        }

                        return question1;
                    }
                })
            )
        }
    }

    checkIsAnswerQuestionnaireOne(version)
    {
        let param = new HttpParams();

        if (!isNullOrUndefined(version)) {
            param = param.append('version', version); 
        }

        if (this.api.isEnable()) {
            return this.http.get<any>(getDataQuestion1Api, {headers: this.api.headers, params: param}).pipe(
                map (data => {
                    return data;
                })
            )
        }
    }

    getDataQuestionnaireTwo(version) {
        let param = new HttpParams();

        if (!isNullOrUndefined(version)) {
            param = param.append('version', version); 
        }

        if (this.api.isEnable()) {
            return this.http.get<any>(getDataQuestion2Api, {headers: this.api.headers, params: param}).pipe(
                map (data => {
                    if (data.code === 200 && !isNullOrUndefined(data.data)) {
                        let question2 = new QuestionTwo();

                        if (!isNullOrUndefined(data.data.answer)) {
                            let dataone = data.data.answer;

                            question2.q1 = dataone.q1;
                            question2.q2 = dataone.q2;
                            question2.q3 = dataone.q3;
                            question2.q4 = dataone.q4;
                            question2.q5 = dataone.q5;

                        }
                        
                        return question2;
                    } 
                })
            )
        }
    }

    getDataQuestionnaireReport(filter, version): Observable<any> {
        let listAnswer = [];
        let param = new HttpParams();

        if (!CheckNullOrUndefinedOrEmpty(filter)) {
            param = param.append('filter', filter);
        }

        if (!CheckNullOrUndefinedOrEmpty(version)) {
            param = param.append('version', version);
        }

        if(this.api.isEnable()){
            return this.http.get<any>(getDataQuestionnaireReportApi, {headers: this.api.headers, params: param}).pipe(
                map( data => {
                    if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
                        data.data.forEach(dataArr => {
                            let answerData = new QuestionnaireReport();

                            dataArr.forEach(element => {
                                if (element.questionnaire_type === 'BEFORE') {
    
                                    if (!CheckNullOrUndefinedOrEmpty(element.customer)) {
                                        answerData.nameInIC = element.customer.firt_name;
                                        answerData.preferredName = element.customer.preferred_name;
                                        answerData.email = element.customer.email;
                                        answerData.phoneNumber = "(+" + element.customer.phone_dial_code + ") " + element.customer.phone_number;
                                    }
    
                                    if (!CheckNullOrUndefinedOrEmpty(element.answer)) {
                                        answerData.answer1 = '"' + this.checkDataAnswer(element.answer.p2q1, this.q1data, null) + '"';
                                        answerData.answer2 = '"' + this.checkDataAnswer(element.answer.p2q2, this.q2data, element.answer.p2q2Text) + '"';
                                        answerData.answer3 = '"' + this.checkDataAnswer(element.answer.p2q3, this.q3data, null) + '"';
                                        answerData.answer4 = '"' + this.q4data.filter(e => e.id === element.answer.p2q4)[0].text + '"';
                                        answerData.answer5 = '"' + this.q5data.filter(e => e.id === element.answer.p2q5)[0].text + '"';
                                        answerData.answer6 = '"' + this.checkDataAnswer(element.answer.p2q6, this.q6data, null) + '"';
                                        answerData.answer7 = '"' + this.checkDataAnswer(element.answer.p2q7, this.q7data, null) + '"';
                                        answerData.answer8 = '"' + this.checkDataAnswer(element.answer.p2q8, this.q8data, element.answer.p2q8Text) + '"';
            
                                        if (element.answer.p2q9 === 1) {
                                            answerData.answer9 = '"' + this.q9Model.filter(e => e.id === element.answer.p2q9Model)[0].text + '"';
                                        } else {
                                            answerData.answer9 = 'No';
                                        }
                                    }

                                } else if (element.questionnaire_type === 'AFTER') {
                                    answerData.answer10 = '"' + this.checkDataAnswer(element.answer.q1, this.q10data, null) + '"';
                                    answerData.answer11 = '"' + element.answer.q2 + '"';
                                    answerData.answer12 = '"' + this.checkDataAnswer(element.answer.q3, this.q12data, null) + '"';
                                    answerData.answer13 = '"' + this.q13data[element.answer.q4 - 1].text + '"';
                                    answerData.answer14 = '"' + this.q14data[element.answer.q5 - 1].text + '"';
                                } 
                            });

                            listAnswer.push(answerData);
                        });

                        return listAnswer;
                    } else {
                        return [];
                    }
                }), catchError(value => throwError(value))
            )
        }
    }

    checkDataAnswer(data, dataArr, textInput) {
        let answer = '';

        if (!CheckNullOrUndefinedOrEmpty(data)) {
            let arr = data.split(',');
            arr.forEach((a1, i) => {
                if (i === arr.length - 1) {

                    if (!isNaN(a1)) {
                        if (dataArr[Number(a1)].text === 'Others' && !CheckNullOrUndefinedOrEmpty(textInput)) {
                            answer += textInput;
                        } else {
                            answer += dataArr[Number(a1)].text;
                        }

                    } else {
                        answer += '';
                    }

                } else {
                    if (dataArr[Number(a1)].text === 'Others' && !CheckNullOrUndefinedOrEmpty(textInput)) {
                        answer += textInput + ', ';
                    } else {
                        answer += dataArr[Number(a1)].text + ', ';
                    }
                }  
            });
        } else {
            answer = '';
        }

        return answer;
    }
}
                                // if (!CheckNullOrUndefinedOrEmpty(element.answer.p2q1)) {
                                //     let arrQ1 = element.answer.p2q1.split(',');
                                //     arrQ1.forEach((a1, i) => {
                                //         if (i === arrQ1.length - 1) {
                                //             answerData.answer1 += this.q1data[Number(a1) - 1];
                                //         } else {
                                //             answerData.answer1 += this.q1data[Number(a1) - 1] + ', ';
                                //         }  
                                //     });
                                // } else {
                                //     answerData.answer1 = '';
                                // }