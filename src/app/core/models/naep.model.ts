import { applyCustomerinformationNaepApi } from './../service/backend-api';

import { RecruitEnum2, NAEPStatus} from '../enum/recruit'
import { Product } from './product.model';
import { PROPERTY } from 'app/main/product-detail/product-detail.component';
export class Naep
{   
    status           : RecruitEnum2;
    advisor_info     : info;
    team_leader_info : info;
    is_buy_naep      : boolean;
    start_time       : Date;
    end_time         : Date;
    sale_starus      : NAEPStatus;
    Sales            : Sale[];
    product_special  : string;
    customer         : infoCustomer;
    is_select_advisor : boolean;
    is_answer_question : boolean;
    list_key_product : Object[];
    naepType: NaepType[];
    is_deposit_packet: boolean;
    product_sell_number: string;
    product_not_sell_number: number;
    currency: string;
    checkRefund: boolean;
    priceRefund: number;
    product_id: number;
    refund_status: string;
    is_refund: boolean;
    payback_product: ProductPayBack;
    payback_product_id: number;
    gift : NaepType;
    is_buy_discount  : boolean;
    is_old_naep : boolean;
    is_active: boolean;
    is_answer: boolean;
}
export class info
{
    name_id : string;
    time    : string;
}




export class infoCustomer
{
    name : string;
    customer_advisor_id    : string;
    time : string;
}



export class Sale
{
    title : string;
    date  : Date
}

export class CustomerInformationNaep
{
    name : string;
    email : string;
    phoneNumber : string;
    id : number;
    uuid : string;
    checkStatus: boolean;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    postalCode: string;
    countryCode: string;
    stateCode: string;
}
export class applyCustomerinformationNaep
{
    residentCountry: string;
    nationality: string;
    nationlId: string;
    passport: string;
    dob: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    postalCode: number;
    cityState: string;
    country: string;
    bankCode: string;
    BankAccountNumber: number
    bankHolder: string;
    recruitmentId: string;
}

export class addToCartNaep{
    product_id : number;
    has_advisor: boolean;
    properties : object;
    is_naep_discount_product : boolean;
}

export class NaepPartnerInductionFormDetail{
    partnerName: string;
    contactNo: string;
    recruitedName: string;
    recruitedId: string;
    teamManagerName: string;
    teamManagerId: string;
}

export class ResponseQuestionNewPartner{
    familyMember: number;
    children: number;
    ages: number;
    spouseCarrer: number;
    workingExperience: string;
    currentlyWorking: string;
    whatMakeDecide: string;
    earnMonthly: string;
    howManyDays: string;
}   
export class addToCartNewNaep {
    package_id: number;
    deposit: Array<DepositProduct>;
    advisor_id: number;
}

export class DepositProduct{
    product_id: number;
    properties: object;
}

export class NaepType {
    id: number;
    name: string;
    periodLength: number;
    isCompleted: boolean;
    checkGift: boolean;
    isGetGift: boolean;
    productId: number;
    saleTypeId: number;
    properties: PROPERTY[] = [];
    imageProduct: string;
    nameProduct: string;
    isGetGiftBuy : boolean;
    endDay: Date;
}

export class ProductPayBack {
    id: number;
    productName: string;
    image: string;
    properties: PROPERTY[] = [];
}