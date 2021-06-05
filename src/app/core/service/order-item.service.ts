
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { updateShippingApi, createOrderLineSinglePaymtGiftApi, createOrderLineBankTransferGiftApi } from './backend-api';
import { ApiService } from './api.service'
import { Shipping } from '../models/shipping.model'

@Injectable({
    providedIn: 'root'
})
export class OrderItemService
{

    constructor(
        private http: HttpClient,
        private router: Router,
        private api: ApiService
    ) { }

    createOrderLineSinglePaymtGift(formSinglePaymentGift)
    {
        return this.api.post(createOrderLineSinglePaymtGiftApi, formSinglePaymentGift);
    }

    createOrderBankTransferPaymtGift(formBankTransferGift)
    {
        return this.api.post(createOrderLineBankTransferGiftApi, formBankTransferGift);
    }


}
