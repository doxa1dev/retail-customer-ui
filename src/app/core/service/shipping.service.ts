
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { updateShippingApi , shippingLocationAPI, getPublicHolidayApi, 
    getQuickTimeSlotQXpressApi, getSpTimeAfterByDateApi, createQXpressApi, cancelQXpressApi } from './backend-api';
import { ApiService } from './api.service'
import { Shipping } from '../models/shipping.model'
import { throwError } from 'rxjs';
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';

@Injectable({
    providedIn: 'root'
})
export class ShippingService
{

    constructor(
        private http: HttpClient,
        private router: Router,
        private api: ApiService
    ) { }

    updateDeliveryAddress(shipping: Shipping, id: string)
    {
        var url = updateShippingApi.replace(':id', id);
        return this.api.put(url, shipping);
    }
    getShippingLocation() {
        return this.api.get(shippingLocationAPI).pipe(
            map(respone => {
                if (respone.code == 200) {
                    return respone.data;
                }
            }), catchError(value => throwError(value))
        );
    }

    getPublicHoliday(country, year) {
        let param = new HttpParams();

        if (!CheckNullOrUndefinedOrEmpty(country)) {
            param = param.append('country', country);
        }
        if (!CheckNullOrUndefinedOrEmpty(country)) { 
            param = param.append('year', year);
        }

        return this.http.get<any>(getPublicHolidayApi, {headers: this.api.headers, params: param}).pipe(
            map( data => {
                if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
                    return data.data;
                }
            })
        )
    }

    getQuickTimeSlotQXpress(date_search) {
        let param = new HttpParams();

        if (!CheckNullOrUndefinedOrEmpty(date_search)) {
            param = param.append('date_search', date_search);
        }

        return this.http.get<any>(getQuickTimeSlotQXpressApi, {headers: this.api.headers, params: param}).pipe(
            map( data => {
                if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
                    return data.data;
                }
            })
        )
    }

    getSpTimeAfterByDate(date_search) {
        let param = new HttpParams();

        if (!CheckNullOrUndefinedOrEmpty(date_search)) {
            param = param.append('date_search', date_search);
        }

        return this.http.get<any>(getSpTimeAfterByDateApi, {headers: this.api.headers, params: param}).pipe(
            map( data => {
                if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
                    return data.data;
                }
            })
        )
    }

    createQXpress(formCreate) {
        return this.api.post(createQXpressApi, formCreate);
    }

    cancelQXpress(id) {
        let param = new HttpParams();

        if (!CheckNullOrUndefinedOrEmpty(id)) {
            param = param.append('id', id);
        }

        return this.http.patch<any>(cancelQXpressApi, {}, {headers: this.api.headers, params: param}).pipe(
            map( data => {
                return data;
            })
        )
    }
}