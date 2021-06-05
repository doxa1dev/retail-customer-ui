import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient, HttpParams, } from '@angular/common/http'
import { productDetailApi, listProductApi, getSinglePaymentGiftByProdcutApi, getOnlineBankingGiftByProdcutApi, 
    listProductApiNoRegister,productDetailUserApi, getListProductV2Api, getListProductNoRegisterV2Api, GiftSharePaymentApi, getBannerCustomerApi } from './backend-api';
import { Product, TranslationProduct } from './../models/product.model';
import { ApiService } from './api.service';
import { isNullOrUndefined } from 'util';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';
import { PROPERTY } from 'app/main/product-detail/product-detail.component';
import * as jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class ProductService
{

    constructor(
        private api: ApiService,
        private http: HttpClient,
    ) { }

    decoded

    getProductDetail(id: string){
        let tokendata  = localStorage.getItem('token');
        if(isNullOrUndefined(tokendata))
        {
            let url = productDetailApi.replace(':id', id);
            return this.http.get<any>(url)
        }else{
            let url = productDetailUserApi.replace(':id', id);
            return this.api.get(url)
        }
        
    }
    
    // Get list product by category id
    getListProductByCategoty(categoryId , name) : Observable<any>  {
        let listProduct:any = [];
        let tokendata  = localStorage.getItem('token');
        let url : string;
        if(CheckNullOrUndefinedOrEmpty(tokendata))
        {
            url = listProductApiNoRegister.replace(':id', categoryId);
        } else{
            url = listProductApi.replace(':id', categoryId);
        }
        let param = new HttpParams();
        if(!CheckNullOrUndefinedOrEmpty(name)){
            param = param.append("name" , name)
        }
        return this.http.get<any>(url,{ headers: this.api.headers, params: param } )
        .pipe(map((data)=>{
            data.data.forEach(product => {
                if (product !== null){
                    let objProduct: Product;
                    objProduct = new Product();
                    objProduct.id = product.id;
                    // objProduct.entityId = product.entity_id;
                    // objProduct.productUri = product.product_uri;
                    // objProduct.isActive = product.is_active;
                    objProduct.productName = product.product_name;
                    // objProduct.productDescription = product.product_description;
                    // objProduct.sku = product.sku;
                    objProduct.listedPrice = product.listed_price;
                    objProduct.promotionalPrice = product.promotional_price;
                    // objProduct.promotionStartTime = product.promotion_start_time;
                    // objProduct.promotionEndTime = product.promotion_end_time;
                    // objProduct.tax = product.tax;
                    // objProduct.hasAdvisor = product.has_advisor;
                    objProduct.currencyCode = product.currency_code;
                    // objProduct.termsAndConditionsLink = product.terms_and_conditions_link;
                    // objProduct.createdAt = product.created_at;
                    // objProduct.updatedAt = product.updated_at;
                    // objProduct.properties = product.properties;
                    objProduct.publicId = product.public_id;
                    objProduct.internal_discount_for = product.internal_discount_for;
                    objProduct.internal_discount_price = product.internal_discount_price;
                    objProduct.internal_discount_start_time = product.internal_discount_start_time;
                    objProduct.total = product.total;
                    objProduct.max_total_discount = product.max_total_discount;
                    objProduct.hasAdvisor = product.has_advisor;

                    if(CheckNullOrUndefinedOrEmpty(product.specialProduct))
                    {
                        objProduct.is_key_product = false;
                        objProduct.is_naep_product = false;
                    }else{
                        objProduct.is_key_product = product.specialProduct.is_key_product;
                        objProduct.is_naep_product = product.specialProduct.is_naep_product;
                        objProduct.special_is_deleted = product.specialProduct.is_deleted;
                    }
                    objProduct.productPhotoKey = this.renderImageIsCover(product.attachments);
                    objProduct.translations = [];
                    if (product.translations.length > 0) {
                        product.translations.forEach(element => {
                            let translate = new TranslationProduct();
                            translate.productId = element.product_id;
                            translate.title = element.translated_title;
                            translate.description = element.translated_description;
                            translate.language_code = element.language.language_code;
                            objProduct.translations.push(translate);
                        })
                    }

                    let size = (!CheckNullOrUndefinedOrEmpty(product.properties)) ? Object.keys(product.properties).length : 0;
                    if(size > 0){
                      for (let key in product.properties)
                      {
                        let value = product.properties[key];
                        let property = new PROPERTY();
                        property.name = key;
                        property.value = [];
                        value.forEach(element =>
                        {
                          property.value.push({ value: element, label: element })
                        })
                        objProduct.propertiesv2.push(property);
                      }
                    }
                    listProduct.push(objProduct);
                }
            })
            return listProduct;
        }),catchError((data) => throwError(data)))
    }

    renderImageIsCover(data): string{
        let storageKey = ""
        if(!isNullOrUndefined(data) && data.length > 0){
            data.forEach(element => {
                if(element.is_cover_photo === true){
                    storageKey =  element.storage_key
                }
            });
        }
        return storageKey
    }

    getSinglePaymentGiftByProdcutId(product_id , share?){
        if(share){
            let param = new HttpParams();
            if(!CheckNullOrUndefinedOrEmpty(product_id)){
                param = param.append("productId" , product_id)
            }
            return this.http.get<any>(GiftSharePaymentApi , {headers: this.api.headers , params: param})
        }
        const url = getSinglePaymentGiftByProdcutApi.replace(':productId', product_id); 
        return this.api.get(url);  
    }


    getBankTransferGiftByProdcutId(product_id){
        const url = getOnlineBankingGiftByProdcutApi.replace(':productId', product_id); 
        return this.api.get(url);  
    }


    searchProductByNameV2(searchString: string): Observable<any>{
        let listProduct = [];
        let url: string;
        let param = new HttpParams();

        if (!CheckNullOrUndefinedOrEmpty(searchString)) {
            param = param.append('name', searchString);
        }

        if (this.api.isEnable()) {
            url = getListProductV2Api;
        } else {
            url = getListProductNoRegisterV2Api;
        }

        return this.http.get<any>(url, {headers: this.api.headers, params: param}).pipe(
            map((data) => {
                if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
                    data.data.forEach(element => {
                        let product = new Product();

                        product.id = element.id;
                        product.productName = element.product_name;
                        product.listedPrice = element.listed_price;
                        product.promotionalPrice = element.promotional_price;
                        product.currencyCode = element.currency_code;
                        product.publicId = element.public_id;
                        product.internal_discount_for = element.internal_discount_for;
                        product.internal_discount_price = element.internal_discount_price;
                        product.internal_discount_start_time = element.internal_discount_start_time;
                        product.total = element.total;
                        product.max_total_discount = element.max_total_discount;
                        product.hasAdvisor = element.has_advisor;

                        if(isNullOrUndefined(element.specialProduct))
                        {
                            product.is_key_product = false;
                            product.is_naep_product = false;
                        }else{
                            product.is_key_product = element.specialProduct.is_key_product;
                            product.is_naep_product = element.specialProduct.is_naep_product;
                            product.special_is_deleted = element.specialProduct.is_deleted;
                        }
                        product.productPhotoKey = this.renderImageIsCover(element.attachments);
                        product.translations = [];

                        if (element.translations.length > 0) {
                            element.translations.forEach(productTranslate => {
                                let translate = new TranslationProduct();
                                translate.productId = productTranslate.product_id;
                                translate.title = productTranslate.translated_title;
                                translate.description = productTranslate.translated_description;
                                translate.language_code = productTranslate.language.language_code;
                                product.translations.push(translate);
                            })
                        }

                        let size = !CheckNullOrUndefinedOrEmpty(element.properties) ? Object.keys(element.properties).length : 0;
                        if(size > 0){
                          for (let key in element.properties)
                          {
                            let value = element.properties[key];
                            let property = new PROPERTY();
                            property.name = key;
                            property.value = [];
                            value.forEach(element =>
                            {
                              property.value.push({ value: element, label: element })
                            })
                            product.propertiesv2.push(property);
                          }
                        }

                        listProduct.push(product);
                    });

                    return listProduct;
                } else {
                    return [];
                }
            })
        )
    }

    getBanners(): Observable<any>{
        let param = new HttpParams();
            return this.http.get<any>(getBannerCustomerApi, {headers: this.api.headers, params: param}).pipe( 
                map(data=>{
                    let result = [];
                    if (!CheckNullOrUndefinedOrEmpty(data)) {
                        result = data
                    }
                    else {
                        result = []
                    }
                    return result;
                }), catchError(value => throwError(value))
            )
      } 

}
