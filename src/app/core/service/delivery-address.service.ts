
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { updateDeliveryAddressApi} from './backend-api';
import { ApiService} from './api.service'
import { DeliveryAddress } from '../models/delivery-address.model'

@Injectable({
    providedIn: 'root'
})
export class DeliveryAddressService
{

    constructor(
        private http: HttpClient,
        private router: Router,
        private api: ApiService
    ) { }

    updateDeliveryAddress(deliveryAddress : DeliveryAddress){
        return this.api.post(updateDeliveryAddressApi, deliveryAddress);
    }
}
