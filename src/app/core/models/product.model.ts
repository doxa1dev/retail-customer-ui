export class Product {
    id: string;
    orderLineId: string;
    entityId: string;
    publicId: string;
    productUri: string;
    isActive: boolean;
    productName: string;
    productDescription: string;
    sku: string;
    listedPrice: string;
    promotionalPrice: string;
    promotionalPriceNaep: string; 
    promotionalListPriceNaep: string;
    promotionStartTime: string;
    promotionEndTime: string;
    tax: string;
    currencyCode: string;
    hasAdvisor: boolean;
    advisorId: string;
    advisorFirtName: string;
    advisorLastName: string;
    termsAndConditionsLink: string;
    properties: Object[];
    createdAt: string;
    updatedAt: string;
    language: string;
    quantity: number;
    hasSpecialPayment: boolean;
    advisorIdNumber: string;
    preferredName: string;
    productPhotoKey: string;
    price: string;
    cover_photo_key: string;

    allow_epp_payment: boolean;
    allow_recurring_payment: boolean;
    deposit_amount: number;

    //gift
    singlePaymentGiftProducts: Object[];
    onlineBankingPaymentGiftProducts: Object[];

    orderLineSinglePaymentGifts: any[];
    orderLineOnlineBankingPaymentGifts: any[];
    internal_discount_for : string[];
    internal_discount_price : string;
    internal_discount_start_time : Date;
    max_total_discount : number;
    is_key_product : boolean;
    is_naep_product : boolean;
    special_is_deleted : boolean;
    total : number;
    sum :number;
    // translation
    translations: TranslationProduct[];
    //naep
    is_naep_discount: boolean;
    is_deposit: boolean;
    is_fee: boolean;
    is_kit: boolean;
    naep_advisor_kit: any;
    naep_discount_price: boolean;
    product: any;
    warranty: string[] = [];
    customerName: string;
    customerEmail: string;
    propertiesv2 = [];
    cart_combination: boolean;
    constructor() { }
}

export class ProductNaep 
{
    id : number;
    uuid : string;
    product_name : string;
    product_description : string;
    is_have_properties : boolean;
    has_advisor : boolean;
}

export class TranslationProduct {
    productId: string;
    title: string;
    description: string;
    language_code: string;
}

export class NaepPackage {
    id: string;
    uuid: string;
    entityId: string;
    description: string;
    packageName: string;
    packageImage: string;
    imgFee: string;
    listedPriceFee: string;
    promotionalPriceFee: string;
    currencyFee: string;
    isKit: boolean;
    naepPackageKit;

    naepItem = [];
}

export class ItemProduct {
    is_have_properties: boolean;
    product;
}
