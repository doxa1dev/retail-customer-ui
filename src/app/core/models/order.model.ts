import { Product } from './product.model';

export class Order {
    id: string;
    customerId: number;
    isDeleted: boolean;
    subtotal: string;
    shippingFee: string;
    tax: string;
    createdAt: string;
    updatedAt: string;
    advisorCustomer_id: number;
    entityId: number;
    status: string;
    totalAmount: string;
    shippingId: number;
    listProduct: Array<Product>;
    deliveryAddress: DeliveryAddress;
    customerInformation: CustomerInformation;
    advisorCustomerName: string;
    totalItem: number;
}
export class DeliveryAddress{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    postalCode: number;
    cityState: string;
    detailAddress: string;
    unitNumber: string;
    countryCode: string;
    phoneDialCode: number;
    phoneNumber: number;
    createdAt: string;
    updatedAt: string;
}
export class CustomerInformation{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneDialCode: number;
    phoneNumber: number;
    createdAt: string;
    updatedAt: string;
}

export class OrderRedeem {
    advisor_host_gift_id: number;
    order_id: number;
    order_id_tmm: number;
    customer_name: string;
    recognition_date: string;
    expired_date: string;
    status: string;
    checkRedeem: boolean;
    time_left : number;
    redeemption_date: string;
    date_query: string;
}

export class OrderJustHost {
    id: number;
    request_id: string;
    demo_date: string;
    expired_date: string;
    status: string;
    checkRedeem: boolean;
    time_left : number;
    request_date: string;
}