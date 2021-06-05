import { customer, status } from './../models/list_recruit.model';
import { forEach } from 'lodash';
import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpParams, HttpClient } from "@angular/common/http";
import { map, catchError, combineAll } from "rxjs/operators";
import { applyCustomerinformationNaepApi,getCustomerInformationNaepApi,
    getlistRecruitApi, getDetailRecruitApi, recruitApproveOrRejectApi, getNAEPProductOptionsApi,
    getNewAdvisorEarningProgramApi, getSpecialProductApi, checkRecruitmentApi, checkBuyNaepOptionApi, 
    createCartNaepApi, checkIsBuyNaepApi, deleteNaepApi, advisorGetNAEPCustomerDetailApi, getSpecialProductV2Api,
    decodeTokenApi, getListAdvisorApi, createNewCartNaepApi, getNaepPackageDetailApi, checkValidPackageApi, 
    newCreateCartByRefundProductApi, newCreateCartByDiscountProductApi, createCartGiftNaepApi, getNaepPackagesV3Api,
    getNaepPackageDetailV3Api, checkCustomerValidToBuyPackageApi } from "./backend-api";
import { Naep, info ,Sale, CustomerInformationNaep, applyCustomerinformationNaep, infoCustomer, NaepType, ProductPayBack} from "../models/naep.model";
import { Observable, throwError } from "rxjs";
import { ApiService } from "./api.service";
import { isNullOrUndefined } from "util";
import { formatDate, formatCurrency } from "@angular/common";
import * as moment from "moment";
import { RecruitEnum, NAEPStatus, RecruitEnum2} from 'app/core/enum/recruit';
import { element } from 'protractor';
import { SALESLIST } from 'app/core/constants/constant'
import { ItemProduct, NaepPackage, ProductNaep } from '../models/product.model';
import * as _ from 'lodash';
import { CheckNullOrUndefinedOrEmpty } from '../utils/common-function';
import { PROPERTY } from 'app/main/product-detail/product-detail.component';
@Injectable({
    providedIn: "root",
})
export class NaepService
{
    constructor(private api: ApiService, private http: HttpClient) { }

    decodeTokenFromEmail(token : string) :Observable<any>
    {
        let param = new HttpParams();
        param = param.append('token',token)
        return this.http.get<any>(decodeTokenApi,{params : param}).pipe(map((data)=>{
            return data;
        }))
    }

    createNaepSaleListLabel(index : number)
    {
        if(index === 0)
        {
            return 'Buy NAEP package'
        }else if(index === 1)
        {
            return 'Sell 1st Thermomix'
        }else if(index === 2)
        {
            return 'Sell 2nd Thermomix'
        }else if(index ===3 ){
            return 'Sell 3rd Thermomix'
        }else{
            return `Sell ${index}th Thermomix`
        }
    }

    getNewAdvisorEarningProgram(){
        return this.api.get(getNewAdvisorEarningProgramApi).pipe(map ((data)=>{
            if(data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data))
            {
                let dataReturn = new Naep();
                dataReturn.is_select_advisor = false;
                dataReturn.status = data.data[0].status;

                data.data.forEach(element=>{
                    dataReturn.is_select_advisor = dataReturn.is_select_advisor || element.is_selected;

                    if(element.is_selected)
                    {
                        let advisor = new info();
                        let name_advisor = CheckNullOrUndefinedOrEmpty(element.recruiterCustomer.preferred_name) ? element.recruiterCustomer.firt_name : element.recruiterCustomer.preferred_name;
                        advisor.name_id = '(' + name_advisor  + ' / ID: ' + element.recruiterCustomer.advisor_id_number + ')';
                        advisor.time = element.created_at;
                        dataReturn.status = element.status;
                        dataReturn.is_answer = element.status === 'APPLY';
                        
                        dataReturn.advisor_info = advisor;
                        dataReturn.is_answer_question = (!CheckNullOrUndefinedOrEmpty(element.customer.questionnaireNaepApprove) && element.customer.questionnaireNaepApprove.is_answer) ? true : false;
                        if(!CheckNullOrUndefinedOrEmpty(element.naepSalesCustomerProcess))
                        {
                            dataReturn.list_key_product = element.naepSalesCustomerProcess.product_key_info;
                            dataReturn.product_id = element.naepSalesCustomerProcess.payback_product_id;
                            dataReturn.refund_status = element.naepSalesCustomerProcess.refund_status;
                            dataReturn.is_refund = element.naepSalesCustomerProcess.is_refund;
                            dataReturn.is_buy_discount = element.naepSalesCustomerProcess.mark_by_discount;
                            if (!CheckNullOrUndefinedOrEmpty(element.naepSalesCustomerProcess.payback_product)) {
                                let productPayBack = new ProductPayBack();
                                
                                productPayBack.productName = element.naepSalesCustomerProcess.payback_product.product_name;
                                productPayBack.id = element.naepSalesCustomerProcess.payback_product.id;

                                if(!CheckNullOrUndefinedOrEmpty(element.naepSalesCustomerProcess.payback_product.attachments)) {
                                    productPayBack.image = element.naepSalesCustomerProcess.payback_product.attachments[0].storage_key;
                                }

                                let size = Object.keys(element.naepSalesCustomerProcess.payback_product.properties).length;

                                if (size > 0) {
                                  for (let key in element.naepSalesCustomerProcess.payback_product.properties)
                                  {
                                    let value = element.naepSalesCustomerProcess.payback_product.properties[key];
                                    let property = new PROPERTY();
                                    property.name = key;
                                    property.value = [];
                                    value.forEach(element =>
                                    {
                                      property.value.push({ value: element, label: element })
                                    })

                                    productPayBack.properties.push(property);
                                  }
                                }

                                dataReturn.payback_product = productPayBack;
                            }
                        }
                        
                        if(!CheckNullOrUndefinedOrEmpty(element.naepSalesCustomerProcess))
                        {
                            let naepArr = [];

                            // element.naepSalesCustomerProcess.naepPackage.naep_type.forEach(element => {
                            //     let naepType = new NaepType();

                            //     naepType.id = element.type.id;
                            //     naepType.name = element.type.name;
                            //     naepType.periodLength = Number(element.type.period_length);

                            //     naepArr.push(naepType);
                            // });

                            element.naepSalesCustomerProcess.naep_sale_customer_process_type.forEach(element => {
                                let naepType = new NaepType();

                                naepType.id = element.naep_sales_customer_process_id;
                                naepType.name = element.name;
                                naepType.periodLength = Number(element.period_length);
                                naepType.checkGift = CheckNullOrUndefinedOrEmpty(element.gift_product_id) ? false : true;
                                naepType.endDay = element.end_type_date;

                                naepType.isCompleted = element.is_completed;
                                if(naepType.checkGift)
                                {
                                    naepType.isGetGift = element.is_get_gift;
                                    naepType.productId = element.gift_product_id;
                                    naepType.saleTypeId = element.id;
                                    naepType.imageProduct = element.product.attachments[0].storage_key;
                                    naepType.nameProduct = element.product.product_name;
                                    naepType.isGetGiftBuy = element.is_get_gift_buy;
                                    let size = Object.keys(element.product.properties).length;

                                    if (size > 0) {
                                    for (let key in element.product.properties)
                                    {
                                        let value = element.product.properties[key];
                                        let property = new PROPERTY();
                                        property.name = key;
                                        property.value = [];
                                        value.forEach(element =>
                                        {
                                        property.value.push({ value: element, label: element })
                                        })

                                        naepType.properties.push(property);
                                    }
                                    }
                                }
                                naepArr.push(naepType);
                            });
                            dataReturn.naepType = naepArr.sort((a,b) => Number(a.periodLength) - Number(b.periodLength));

                            let arrayGift = dataReturn.naepType.filter(element=>{
                                return element.isCompleted == true && element.productId != null
                            }).sort((a,b) => Number(a.periodLength) - Number(b.periodLength));
                            dataReturn.gift = arrayGift[0]

                            dataReturn.is_deposit_packet = element.naepSalesCustomerProcess.is_deposit_packet;
                            // dataReturn.naepType = element.naepSalesCustomerProcess.naepPackage.naep_type;
                            dataReturn.start_time = element.naepSalesCustomerProcess.start_time;
                            dataReturn.end_time = element.naepSalesCustomerProcess.end_time;
                            dataReturn.sale_starus  = element.naepSalesCustomerProcess.status;
                            
                            if (!CheckNullOrUndefinedOrEmpty(element.naepSalesCustomerProcess.payback_product)) {
                                dataReturn.currency = element.naepSalesCustomerProcess.payback_product.currency_code;
                            }

                            dataReturn.product_sell_number = 
                            `${(element.naepSalesCustomerProcess.recruitmentSalesHistory.length - 1) > element.naepSalesCustomerProcess.complete_sales_number 
                                ? element.naepSalesCustomerProcess.complete_sales_number : element.naepSalesCustomerProcess.recruitmentSalesHistory.length - 1}th Thermomix® ! `;
                            
                            dataReturn.product_not_sell_number = Number(element.naepSalesCustomerProcess.complete_sales_number) - Number(element.naepSalesCustomerProcess.recruitmentSalesHistory.length - 1);

                            //check price refund
                            const sellNumber = (element.naepSalesCustomerProcess.recruitmentSalesHistory.length - 1) > element.naepSalesCustomerProcess.complete_sales_number 
                            ? element.naepSalesCustomerProcess.complete_sales_number : element.naepSalesCustomerProcess.recruitmentSalesHistory.length - 1;
                            dataReturn.is_old_naep = true;
                            if (!CheckNullOrUndefinedOrEmpty(element.naepSalesCustomerProcess.discount_per_sales)){

                            dataReturn.is_old_naep = false;

                                if (element.naepSalesCustomerProcess.is_deposit_packet == true) {
                                    dataReturn.priceRefund = Number(Object.values(element.naepSalesCustomerProcess.discount_per_sales)[sellNumber]) - Number(element.naepSalesCustomerProcess.total_deposite);
                                } else {
                                    dataReturn.priceRefund = Number(Object.values(element.naepSalesCustomerProcess.discount_per_sales)[sellNumber]);
                                }
                                
                                dataReturn.checkRefund = dataReturn.priceRefund < 0 ? true : false;
                            }

                            let saleHistories = element.naepSalesCustomerProcess.recruitmentSalesHistory;
                            let index = saleHistories.findIndex(a=>a.is_naep_product == true)
                            if(index !== -1)
                            {
                                dataReturn.Sales = [];
                                dataReturn.Sales.push({ title: SALESLIST[0].label + ` (${element.naepSalesCustomerProcess.package_name}) ` , date: saleHistories[index].updated_at });
                                let listProduct =  saleHistories.filter(item=>{
                                    return item.is_naep_product === false;
                                });       
                                // let lengthOfList  = SALESLIST.length;
                                let lengthOfList = element.naepSalesCustomerProcess.complete_sales_number;

                                listProduct.sort((a,b)=>new Date(a.updated_at).getTime()-new Date(b.updated_at).getTime())
                                for (let i = 1; i <= lengthOfList; i ++)
                                {
                                    let date;
                                    let title : string;
                                    if (CheckNullOrUndefinedOrEmpty(listProduct[i-1]))
                                    {   
                                        date = null;
                                        title = this.createNaepSaleListLabel(i) 
                                    }else{
                                        date = listProduct[i-1].updated_at;
                                        title = this.createNaepSaleListLabel(i) + ' (' + listProduct[i-1].product.product_name + ')';
                                    }
                                    
                                    dataReturn.Sales.push({ title: title, date: date })

                                }
                            }

                        }

                        if (!CheckNullOrUndefinedOrEmpty(element.customer)) {
                            dataReturn.is_active = element.customer.is_active && element.customer.is_registered;
                        }
                    }
                })

               
                
            //     dataReturn.status = data.data.status;
            //     if (dataReturn.status === RecruitEnum2.APPLY || dataReturn.status === RecruitEnum2.SUBMIT )
            //     {
            //         dataReturn.is_buy_naep = false;
            //     }else{
            //         if(!isNullOrUndefined(data.data.recruitmentApproval))
            //         {   
            //             dataReturn.sale_starus = data.data.recruitmentApproval.status
            //             let saleHistories = data.data.recruitmentApproval.recruitmentSalesHistory;
            //             let index = saleHistories.findIndex(element => element.is_naep_product == true)
            //             if(index !== -1 )
            //             {   
            //                 let option : string = data.data.recruitmentApproval.is_package_naep ? " (packet 2)" : " (packet 1)"
            //                 dataReturn.is_buy_naep = true;
            //                 dataReturn.Sales = [];
            //                 // dataReturn.sale_starus = NAEPStatus.COMPLETED;
            //                 let lengthOfList  = SALESLIST.length;
            //                 dataReturn.Sales.push({ title: SALESLIST[0].label + option , date: saleHistories[index].updated_at });
            //                 let listProduct =  saleHistories.filter(item=>{
            //                     return item.is_naep_product === false;
            //                 });

                            
            //                 listProduct.sort((a,b)=>new Date(a.updated_at).getTime()-new Date(b.updated_at).getTime())
            //                 for (let i = 1; i < lengthOfList; i ++)
            //                 {
            //                     let date;
            //                     let title : string;
            //                     if (isNullOrUndefined(listProduct[i-1]))
            //                     {   
            //                         // dataReturn.sale_starus = NAEPStatus.PROCESS;
            //                         date = null;
            //                         title = SALESLIST[i].label;
            //                     }else{
            //                         date = listProduct[i-1].updated_at;
            //                         title = SALESLIST[i].label + ' (' + listProduct[i-1].product.product_name + ')'
            //                     }
                                
            //                     dataReturn.Sales.push({ title: title, date: date })
            //                 }                       



            //             }
            //             else{
            //                 dataReturn.is_buy_naep = false;
            //             }

                    
            //         }else{
            //             dataReturn.is_buy_naep = false;
            //         }
            //     }   

            //     let customer_info = new info();
            //     let name_advisor = isNullOrUndefined(data.data.recruiterCustomer.preferred_name) ? data.data.recruiterCustomer.firt_name : data.data.recruiterCustomer.preferred_name;
            //     customer_info.name_id = '(' + name_advisor  + ' / ID: ' + data.data.recruiterCustomer.advisor_id_number + ')';
            //     customer_info.time = data.data.created_at;
            //     dataReturn.advisor_info= customer_info;

            //     if(!isNullOrUndefined(data.data.recruitmentApproval))
            //     {
            //         dataReturn.start_time = data.data.recruitmentApproval.start_time;
            //         dataReturn.end_time = data.data.recruitmentApproval.end_time;
            //     }
               return dataReturn
            }
        }))

    }

    checkRecruitment(){
            return this.api.get(checkRecruitmentApi).pipe(map ((data)=>{
                if(!isNullOrUndefined(data)){
                    if (data.code === 200){
                        return true
                    } else if(data.code === 201){
                        return false
                    }
                } else {
                    return false
                }
            }))    
    }

    getCustomerInformationNaep(){
        return this.api.get(getCustomerInformationNaepApi).pipe(map((response)=>{
            if(response.code === 200)
            {
                let dataReturn = new CustomerInformationNaep();
                dataReturn.name = response.data.firt_name;
                dataReturn.email = response.data.email;
                dataReturn.phoneNumber = "(+" + response.data.phone_dial_code + ")" + " " + response.data.phone_number;
                dataReturn.id = response.data.id;
                dataReturn.uuid = response.data.uuid;
                dataReturn.checkStatus = response.data.recruitment[0].status === 'COMPLETED';
                
                if (!CheckNullOrUndefinedOrEmpty(response.data.address)) {
                    dataReturn.addressLine1 = response.data.address.address_line1;
                    dataReturn.addressLine2 = response.data.address.address_line2;
                    dataReturn.addressLine3 = response.data.address.address_line3;
                    dataReturn.postalCode = response.data.address.postal_code;
                    dataReturn.countryCode = response.data.address.country_code;
                    dataReturn.stateCode = response.data.address.state_code;
                }

                return dataReturn;
            } else{
                return null;
            }
        }))
    }

    applyCustomerinformationNaepApi(formNaep :  applyCustomerinformationNaep){
        return this.api.post(applyCustomerinformationNaepApi,formNaep);
    }

    getSpecialProduct(){
        return this.api.get(getSpecialProductApi).pipe(map((response)=>{
          
            let listProduct : ProductNaep[] = [];
            if(response.code === 200){
                response.data.forEach((element)=>{
                    if(element.is_naep_product === true && element.is_naep_discount_product === false)
                    {
                        let product = new ProductNaep;
                        product.id = element.product.id;
                        product.uuid = element.product.public_id;
                        product.product_name = element.product.product_name;
                        product.product_description = element.product.product_description;
                        product.is_have_properties = !_.isEmpty(element.product.properties)
                        product.has_advisor = element.product.has_advisor
                        listProduct.push(product)
                    }
                });
                response.data.forEach((element)=>{
                    if(element.is_naep_product === false && element.is_naep_discount_product === true)
                    {
                        let product = new ProductNaep;
                        product.id = element.product.id;
                        product.uuid = element.product.public_id;
                        product.product_name = element.product.product_name;
                        product.product_description = element.product.product_description;
                        product.is_have_properties = !_.isEmpty(element.product.properties)
                        product.has_advisor = element.product.has_advisor
                        listProduct.push(product)
                    }
                })
            }
            return listProduct;
        }))
    }

    getSpecialProductV2() {
        return this.api.get(getSpecialProductV2Api).pipe(map ((response) => {
          
            let listNaepPackage = [];

            if (response.code === 200) {
             
                response.data.forEach(element => {
                    let naepPackage = new NaepPackage;

                    naepPackage.id = element.id;
                    naepPackage.uuid = element.uuid;
                    naepPackage.packageName = element.package_name;
                    naepPackage.description = element.description;
                    let productFee = element.naep_item.filter(product => product.is_fee === true);
                    naepPackage.imgFee = productFee[0].product.attachments[0].storage_key;
                    naepPackage.currencyFee = productFee[0].product.currency_code;
                    naepPackage.naepPackageKit = element.naepPackageKit;
                    naepPackage.promotionalPriceFee = productFee[0].product.promotional_price;
                    naepPackage.listedPriceFee = productFee[0].product.listed_price;

                    if (CheckNullOrUndefinedOrEmpty(element.naepPackageKit)) {
                        naepPackage.isKit = false;
                    } else {
                        naepPackage.isKit = true;
                    }
                    
                    let listDeposit = element.naep_item.filter(product => product.is_deposit === true);
                    listDeposit.forEach(element => {
                        let itemProduct = new ItemProduct;

                        itemProduct.is_have_properties = !_.isEmpty(element.product.properties);
                        itemProduct.product = element.product;

                        if (itemProduct.product.naep_discount_price === null) {
                            itemProduct.product.naep_discount_price = 0;
                        }

                        naepPackage.naepItem.push(itemProduct);
                    });       

                    listNaepPackage.push(naepPackage);
                });
            }

            return listNaepPackage;
        }))
    }

    checkBuyNaepOption(){
        return this.api.get(checkBuyNaepOptionApi).pipe(map((response)=>{
            if(response.code === 200){
                return response.data;
            }
        }))
    }

    getDataNaepProductOptions(option): Observable<any> {
        let param = new HttpParams();
        if (!isNullOrUndefined(option)) {
            param = param.append('option', option);

            if (this.api.isEnable()) {
                return this.http.get<any>(getNAEPProductOptionsApi, {headers: this.api.headers, params: param}).pipe(
                    map (data => {
                        if (data.code === 200 && !isNullOrUndefined(data.data)) {
                            return data.data;
                        }
                    }), catchError(value => throwError(value))
                )
            }
        }
    }

    CreateCartNaep(naepAddToCart){
        return this.api.post(createCartNaepApi,naepAddToCart)
    }

    checkIsBuyNaep(){
        return this.api.get(checkIsBuyNaepApi).pipe(map(data=>{
            if(data.code === 200)
            {
                return data.data;
            }
        }))
    }


    getCustomerNaepInfomationByAdvisor(uuid){
        let param = new HttpParams();
        param = param.append('uuid', uuid);
        return this.http.get<any>(advisorGetNAEPCustomerDetailApi, { headers: this.api.headers, params: param }).pipe(map ((data)=>{
            if(data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
               return data.data;
                
                // let dataReturn = new Naep();
                
                // dataReturn.status = data.data.status2;
                // if (dataReturn.status === RecruitEnum2.APPLY || dataReturn.status === RecruitEnum2.SUBMIT) {
                //     dataReturn.is_buy_naep = false;
                
                // } else {
                //     if(!CheckNullOrUndefinedOrEmpty(data.data.recruitmentApproval)) {   
                //         dataReturn.sale_starus = data.data.recruitmentApproval.status
                //         let saleHistories = data.data.recruitmentApproval.recruitmentSalesHistory;
                //         let index = saleHistories.findIndex(element => element.is_naep_product == true);

                //         if (index !== -1) {   
                //             let option : string = data.data.recruitmentApproval.is_package_naep ? " (packet 2)" : " (packet 1)"
                //             dataReturn.is_buy_naep = true;
                //             dataReturn.Sales = [];
                //             // dataReturn.sale_starus = NAEPStatus.COMPLETED;
                //             let lengthOfList  = SALESLIST.length;
                //             dataReturn.Sales.push({ title: SALESLIST[0].label + option , date: saleHistories[index].updated_at });
                //             let listProduct =  saleHistories.filter(item=>{
                //                 return item.is_naep_product === false;
                //             });
                //             // let arraySellProduct = listProduct.splice(index,1);
                            
                //             listProduct.sort((a,b)=>new Date(a.updated_at).getTime()-new Date(b.updated_at).getTime())
                //             for (let i = 1; i < lengthOfList; i ++)
                //             {
                //                 let date;
                //                 let title : string;
                //                 if (CheckNullOrUndefinedOrEmpty(listProduct[i-1]))
                //                 {   
                //                     // dataReturn.sale_starus = NAEPStatus.PROCESS;
                //                     date = null;
                //                     title = SALESLIST[i].label;
                //                 }else{
                //                     date = listProduct[i-1].updated_at;
                //                     title = SALESLIST[i].label + ' (' + listProduct[i-1].product.product_name + ')'
                //                 }
                                
                //                 dataReturn.Sales.push({ title: title, date: date })
                //             }                       
                //         }
                //         else{
                //             dataReturn.is_buy_naep = false;
                //         }

                    
                //     }else{
                //         dataReturn.is_buy_naep = false;
                //     }
                // }   
                // let customer_info = new infoCustomer();
                // customer_info.name = '(' + data.data.customer.firt_name + ' / ID: ' + data.data.customer.advisor_id_number + ')';
                
                // //advisor
                // let advisor_info = new info();
                // let name_advisor = CheckNullOrUndefinedOrEmpty(data.data.recruiterCustomer.preferred_name) ? data.data.recruiterCustomer.firt_name : data.data.recruiterCustomer.preferred_name;
                // advisor_info.name_id = '(' + name_advisor  + ' / ID: ' + data.data.recruiterCustomer.advisor_id_number + ')';
                // advisor_info.time = data.data.created_at;
                // dataReturn.advisor_info= advisor_info;

                // if(!CheckNullOrUndefinedOrEmpty(data.data.recruitmentApproval))
                // {
                //     dataReturn.start_time = data.data.recruitmentApproval.start_time;
                //     dataReturn.end_time = data.data.recruitmentApproval.end_time;
                //     customer_info.time = data.data.recruitmentApproval.approved_at;
                // }
                // dataReturn.customer = customer_info;
            }
        }))

    }

    getListInviteAdvisor() {
        return this.api.get(getListAdvisorApi).pipe( map(
            data => {
                if (data.code === 200) {
                    return data.data;
                }
            }
        ))
    }

    createNewCartNaep(formCart) {
        return this.api.post(createNewCartNaepApi, formCart)
    }

    getNaepPackageDetail(uuid) {
        let param = new HttpParams();
        param = param.append('uuid', uuid);

        return this.http.get<any>(getNaepPackageDetailApi, { headers: this.api.headers, params: param }).pipe(
            map( data => {
                
                if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {

                    let id = data.data.id;
                    let listDeposit = data.data.naep_item.filter(product => product.is_deposit === true);
                    let listDepositProperties = listDeposit.filter(deposit => !_.isEmpty(deposit.product.properties) === true);
                    
                    let naepPackage = {
                        naepPackageId: id,
                        listDepositProperties: listDepositProperties
                    };

                    return naepPackage;
                }
            })
        )
    }

    checkValidPackage(packageId) {
        let param = new HttpParams();
        param = param.append('package_id', packageId);

        return this.http.get<any>(checkValidPackageApi, {headers: this.api.headers, params: param}).pipe(
            map( data => {
                return data;
            })
        )
    }

    newCreateCartByRefundProduct(formCart) {
        return this.api.post(newCreateCartByRefundProductApi, formCart);
    }

    newCreateCartByDiscountProduct(formCart) {
        return this.api.post(newCreateCartByDiscountProductApi, formCart);
    }

    createCartGiftNaep(formGift) {
        return this.api.post(createCartGiftNaepApi, formGift);
    }

    getNaepPackagesV3() {
        return this.http.get<any>(getNaepPackagesV3Api).pipe(map ((response) => {
            let listNaepPackages = [];

            if (response.code === 200 && !CheckNullOrUndefinedOrEmpty(response.data)) {
                response.data.forEach(element => {
                    let naepPackage = new NaepPackage;

                    naepPackage.id = element.id;
                    naepPackage.uuid = element.uuid;
                    naepPackage.packageName = element.package_name;
                    naepPackage.packageImage = element.package_avatar;     

                    listNaepPackages.push(naepPackage);
                });
            }

            return listNaepPackages;
        }))
    }

    getNaepPackageDetailV3(uuid) {
        let naepPackage = new NaepPackage();
        let param = new HttpParams();
        param = param.append('uuid', uuid);

        return this.http.get<any>(getNaepPackageDetailV3Api, {headers: this.api.headers, params: param}).pipe(
            map( data => {
                if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {

                    let element = data.data;
                    naepPackage.id = element.id;
                    naepPackage.uuid = element.uuid;
                    naepPackage.packageName = element.package_name;
                    naepPackage.packageImage = element.package_avatar;
                    naepPackage.description = element.description;
                    let productFee = element.naep_item.filter(product => product.is_fee === true);
                    naepPackage.imgFee = productFee[0].product.attachments[0].storage_key;
                    naepPackage.currencyFee = productFee[0].product.currency_code;
                    naepPackage.naepPackageKit = element.naepPackageKit;
                    naepPackage.promotionalPriceFee = productFee[0].product.promotional_price;
                    naepPackage.listedPriceFee = productFee[0].product.listed_price;

                    if (CheckNullOrUndefinedOrEmpty(element.naepPackageKit)) {
                        naepPackage.isKit = false;
                    } else {
                        naepPackage.isKit = true;
                    }
                    
                    let listDeposit = element.naep_item.filter(product => product.is_deposit === true);
                    listDeposit.forEach(element => {
                        let itemProduct = new ItemProduct;

                        itemProduct.is_have_properties = !_.isEmpty(element.product.properties);
                        itemProduct.product = element.product;

                        if (itemProduct.product.naep_discount_price === null) {
                            itemProduct.product.naep_discount_price = 0;
                        }

                        naepPackage.naepItem.push(itemProduct);
                    });       
                }
                return naepPackage;
            })
        )
    }

    checkCustomerValidToBuyPackage(advisorId) {
        let param = new HttpParams();
        param = param.append('advisor_id', advisorId);

        return this.http.get<any>(checkCustomerValidToBuyPackageApi, {headers: this.api.headers, params: param}).pipe(
            map( data => {
                return data;
            })
        )
    }
}

