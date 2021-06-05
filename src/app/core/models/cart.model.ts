import { Product } from './product.model';
import { DeliveryAddress} from './delivery-address.model';
import { CustomerInformation} from './customer-infomation.model'
import { Shipping} from './shipping.model'
export class Cart
{
    id                         : string;
    customer_id                : number;
    cart_delivery_address      : DeliveryAddress;
    customer_information       : CustomerInformation;
    shipping                   : Shipping;
    cart_advisor_customer_id   : number;
    cart_advisor_customer_name : string;
    preferred_name             : string;
    profile_photo_key          : string;
    cartItems                  : CartItem[];
    is_need_advisor            : boolean;
    is_naep_cart               : boolean; 
    is_redemption_cart             : boolean;
    is_buying_for_customer     : boolean;
    is_has_account             :boolean;
    customer_buy               : CustomerInformation
    sd_price: number = 0;
    isCheckSpecialOnly: boolean;
    isCheckSpecialBefore: boolean;
    isCheckSpecialAfter: boolean;
    remark_advisor : RemarkAdvisorInformation
    constructor () {}
}

export class RemarkAdvisorInformation {
    id : string;
    phone_number : string;
    name : string;
}

export class CartItem {
    id             : string;
    product_name   : string;
    product_id     : number;
    quantity       : number;
    properties     : object[];
    listed_price   : number;
    promotional_price: number;
    has_advisor    : boolean;
    shipping_fee   : string;
    has_special_payment : boolean;
    product_uri    : string;
    max_order_number : number;
    cover_photo_key : string;
    currency_code : string;
    internal_discount_for: string[];
    internal_discount_price: string;
    internal_discount_start_time : Date;
    max_total_discount : number;
    total : number;
    is_naep_discount : boolean;
    naep_discount_price : number;
    is_deposit: boolean;
    is_fee: boolean;
    is_kit: boolean;
    naep_advisor_kit;
    translations: TranslationProduct[];
    is_redemption_price: boolean;
    redemption_price: number;
    is_sd_after: boolean;
    is_sd_before: boolean;
    is_sd_only: boolean;
    sd_price: number;
    product_weight: number;
    host_gift_id: number;
}

export class TranslationProduct {
    language_code: string;
    translated_title: string;
    product_id: string;
}