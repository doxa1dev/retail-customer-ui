import { Injectable } from '@angular/core';
import { map, catchError, retry } from 'rxjs/operators';

import { 
    createPaymentApi, getRemainingPaymentApi, getPendingVerifiedPaymentApi, getVerifiedPaymentApi, generatePaymentSignatureApi, 
    getWirecardPaymentRedirectUrlApi, ttPaymentRefPhotoGetPreSignedUrl, RecurringPaymentSubscribeRequestApi, sendOffLineEPPEmailApi, 
    RecurringPaymentCreateApi, getInstallmentByOrderIdApi, WireCardIppRequestApi, getMpgsCheckoutSession, checkPaynowReferencePaymentApi, createPaymentForShare, NotLogInRecurringPayment, NotLogInGetPendingVerifiedPayment, NotLogInGetVerifiedPayment, NotLogInGetInstallmentPayment, RecurringPaymentSubscribeRequestForShareApi, NotLogInDBS
} from './backend-api';

import { ApiService } from './api.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';


@Injectable({
    providedIn: 'root'
})

export class PaymentService {
    constructor(
        private api: ApiService,
        private http: HttpClient,
    ) { }

    /**
     * create Payment
     * @param formPayment 
     */
    createPayment(formPayment , share?) : Observable<any> {
        // let url = share ? createPaymentForShare : createPaymentApi;
        if(share){
            return this.http.post<any>(createPaymentForShare, formPayment ,{headers: this.api.headers })
        }
        return this.api.post(createPaymentApi , formPayment);
    }

    /**
     * get Remainning Payment
     * @param orderId 
     */
    getRemainingByOrderId(orderId , share?) : Observable<any>{
        const url = getRemainingPaymentApi.replace(':id', orderId);
        if(share){
            return this.http.get<any>(url, {headers: this.api.headers});
        }
        return this.api.get(url);
    }

    getPendingVerifiedByOrderId(orderId , share?) {
        if(share){
            let param = new HttpParams();
            if(!CheckNullOrUndefinedOrEmpty(orderId)){
                param = param.append('order_id', orderId);
            }
            return this.http.get<any>(NotLogInGetPendingVerifiedPayment , {headers: this.api.headers , params: param})
        }
        const url = getPendingVerifiedPaymentApi.replace(':id', orderId);
        return this.api.get(url);
    }

    getVerifiedByOrderId(orderId , share?) {
        if(share){
            let param = new HttpParams();
            if(!CheckNullOrUndefinedOrEmpty(orderId)){
                param = param.append('order_id', orderId);
            }
            return this.http.get<any>(NotLogInGetVerifiedPayment , {headers: this.api.headers , params: param})
        }
        const url = getVerifiedPaymentApi.replace(':id', orderId);
        return this.api.get(url);
    }

    //generate payment signature 
    generatePaymentSignature(formSignature) {
        return this.api.post(generatePaymentSignatureApi, formSignature);
    }

    getWirecardPaymentRedirectUrl(wirecardRequestBody) {
        return this.api.post(getWirecardPaymentRedirectUrlApi, wirecardRequestBody);
    }
    
    getPreSignedUrl(fileName: string, fileType: string)
    {
        const bodyObj = { name: fileName, type: fileType };
        return this.api.post(ttPaymentRefPhotoGetPreSignedUrl, bodyObj);
    }


    uploadPaymentImage(url: string, contentType: string, file) {
        const headers = new HttpHeaders({ 'Content-Type': contentType });
        return this.http.put<any>(url, file, { headers: headers, reportProgress: true }).pipe(retry(3), catchError(this.errorHandler));
    }

      /**
     * create Payment
     * @param formRecurringSubscription 
     */
    createRecurringPayment(formRecurringCreate , share?){
        if(share){
            return this.http.post<any>(NotLogInRecurringPayment , formRecurringCreate , {headers: this.api.headers})
        }
        return this.api.post(RecurringPaymentCreateApi, formRecurringCreate);}

    subscribeRecurringPayment(order_id , share?){
        if(share){
            let param = new HttpParams();
            if(!CheckNullOrUndefinedOrEmpty(order_id)){
                param = param.append('order_id', order_id);
            }
            return this.http.get<any>(RecurringPaymentSubscribeRequestForShareApi , {headers: this.api.headers , params: param})
        }
        const url = RecurringPaymentSubscribeRequestApi.replace(':id', order_id); 
        return this.api.get(url); 
        
    }

    sendOffLineEPPEmail(formEPPInfo){
    return this.api.post(sendOffLineEPPEmailApi,formEPPInfo );

    }

    getInstallmentByOrderId(order_id , share?){
        if(share){
            let param = new HttpParams();
            if(!CheckNullOrUndefinedOrEmpty(order_id)){
                param = param.append('order_id', order_id);
            }
            return this.http.get<any>(NotLogInGetInstallmentPayment , {headers: this.api.headers , params: param})
        }
        const url = getInstallmentByOrderIdApi.replace(':orderId', order_id); 
        return this.api.get(url); 
        
    }

    getIppData(formIpp: any , share?){
        if(share){
            return this.http.post<any>(NotLogInDBS , formIpp , {headers: this.api.headers})
        }
        return this.api.post(WireCardIppRequestApi, formIpp);
    }

    getMpgsCheckoutSession(mpgsRequestBody , share?) : Observable<any> {
        if(share){
            return this.http.post<any>(getMpgsCheckoutSession, mpgsRequestBody ,{headers: this.api.headers })
        }
        return this.api.post(getMpgsCheckoutSession, mpgsRequestBody);
    }


    private errorHandler(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occured:', error.error.message);
        }
        else {
            console.error(
                `Back-end return code: ${error.status}\n` +
                `Body content: ${error.status}`
            );
        }

        return throwError(error.message || 'Server Error');
    }


    checkPaynowReferencePaymentNumber(paymentReferenceNumber : string): Observable<any>{
        let param = new HttpParams();
        param = param.append('payment_referencde', paymentReferenceNumber);
        if(this.api.isEnable())
        {
            return this.http.post(checkPaynowReferencePaymentApi, '',{headers: this.api.headers, params: param}).pipe(
                map(data=>{
                return data;
                }), catchError(value => throwError(value)) 
            )
        }
       
    }
}
