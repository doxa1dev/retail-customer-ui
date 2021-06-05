import { environment } from 'environments/environment';

export function CheckNullOrUndefinedOrEmpty(value: any){
    return value === null || value === undefined || value.length === 0
}


export function RenderInformation(value: any)
{
    const address1 = !CheckNullOrUndefinedOrEmpty(value.address_line1) ? value.address_line1 + ', ' : '';
    const address2 = !CheckNullOrUndefinedOrEmpty(value.address_line2) ? value.address_line2 + ', ' : '';
    const address3 = !CheckNullOrUndefinedOrEmpty(value.address_line3) ? value.address_line3 + ', ' : '';
    const postal = !CheckNullOrUndefinedOrEmpty(value.postal_code) ? value.postal_code  + ', ' : '';
    const countryCodeToName = environment.countryCodeToName;
    const stateCodeToName = environment.countryCodeToStates[value.country_code];
    const state = !CheckNullOrUndefinedOrEmpty(value.state_code) ? stateCodeToName[value.state_code] + ', ' : '';
    const country = !CheckNullOrUndefinedOrEmpty(value.country_code) ? countryCodeToName[value.country_code] : '' ;

    return address1 + address2 + address3 + postal + state + country + '.';
}