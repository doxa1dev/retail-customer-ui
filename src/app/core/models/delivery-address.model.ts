export class DeliveryAddress {
    first_name: string;
    last_name: string;
    email: string;
    phone_dial_code: string;
    phone_number: string;
    address_line1: string;
    address_line2: string;
    address_line3: string;
    postal_code: string;
    state_code: string;
    country_code: string;

    constructor(
        first_name: string,
        last_name: string,
        email: string,
        phone_dial_code: string,
        phone_number: string,
        address_line1: string,
        address_line2: string,
        address_line3: string,
        postal_code: string,
        state_code: string,
        country_code: string,
    ) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone_dial_code = phone_dial_code;
        this.phone_number = phone_number;
        this.address_line1 = address_line1;
        this.address_line2 = address_line2;
        this.address_line3 = address_line3;
        this.postal_code = postal_code;
        this.state_code = state_code;
        this.country_code = country_code;
    }
}
