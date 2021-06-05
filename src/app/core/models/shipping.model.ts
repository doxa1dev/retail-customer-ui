export class Shipping
{
    shipping_method: string;
    customer_selected_shipping_date: Date;
    ship_date: Date;
    receive_date: Date;
    customer_notes: string;
    shipping_location_id : number

    // shipping_company: string;

    constructor(
       shippingmethod : string,
       customerSelectedShippingDate : Date,
       shipDate : Date,
       receiveDate : Date,
       customerNotes : string,
       shipping_location_id : number
    //    shippinCompany : string

    )
    {
        this.shipping_method = shippingmethod;
        this.customer_selected_shipping_date = customerSelectedShippingDate;
        this.ship_date = shipDate;
        this.receive_date = receiveDate;
        this.customer_notes = customerNotes;
        this.shipping_location_id  = shipping_location_id
        // this.shipping_company = shippinCompany;
    }
}

export class SpecialDelivery {
    sd_type: string;
    select_date: string;
    select_time: string;
    shipping_id: number;
    sd_id: number;
    sd_shipping_fee: number;
    sd_fee: number;
}

export class CreateQuickOrder {
    shipping_id : number;
    orderId: string;
    customerName: string;
    customerPhone: string;
    customerZipCode: string;
    customerAddressLine1: string;
    customerAddressLine2: string;
    pickUpdate: string;
    pickUpTime: string;
    orderItem: Array<OrderItemsQxpress> = [];;
}

export class OrderItemsQxpress{
    ITEM_NM: string;
    QTY: number;
    PURCHASE_AMT: string;
    CURRENCY: string;
    ITEM_ID : number;
    ITEM_URL: string = "";
    ITEM_IMAGE_URL: string = "";
    REF_ORDER_NO: string = "";
    REMARK: string = "";
}
