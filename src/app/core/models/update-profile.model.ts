export class UpdateProfile
{
    firt_name    : string;
    preferred_name: string;
    address_line1: string;
    address_line2: string;
    address_line3: string;
    postal_code: string;
    state_code: string;
    country_code: string;
    constructor(
        firstName: string,
        preferredName: string,
        addressLine1: string,
        addressLine2: string,
        addressLine3: string,
        postalCode: string,
        stateCode: string,
        countryCode: string)
    {
        this.firt_name = firstName;
        this.preferred_name = preferredName;
        this.address_line1 = addressLine1;
        this.address_line2 = addressLine2;
        this.address_line3 = addressLine3;
        this.postal_code = postalCode;
        this.state_code = stateCode;
        this.country_code = countryCode;
    }
}