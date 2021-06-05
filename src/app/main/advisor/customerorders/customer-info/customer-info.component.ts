import { Component, OnInit, Input } from '@angular/core';
import { CustomerInformation } from 'app/core/service/order.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements OnInit {

  @Input() customerInformation: CustomerInformation;

  constructor() { }

  ngOnInit(): void {
  }

  
  setDisplayAddressLine(address_line1, address_line2, address_line3, postal_code) {
    const address1 = !this.isEmptyOrNullOrUndefined(address_line1) ? address_line1 + ', ' : '';
    const address2 = !this.isEmptyOrNullOrUndefined(address_line2) ? address_line2 + ', ' : '';
    const address3 = !this.isEmptyOrNullOrUndefined(address_line3) ? address_line3 + ', ' : '';
    const postal = !this.isEmptyOrNullOrUndefined(postal_code) ? postal_code : '';

    return address1 + address2 + address3 + postal;
  }

  setStateCountryLine(stateCode, countryCode) {
    const countryCodeToName = environment.countryCodeToName;
    const stateCodeToName = environment.countryCodeToStates[countryCode];
    const state = !this.isEmptyOrNullOrUndefined(stateCode) ? stateCodeToName[stateCode] + ', ' : '';
    const country = !this.isEmptyOrNullOrUndefined(countryCode) ? countryCodeToName[countryCode] : '';

    return state + country;
  }

  private isEmptyOrNullOrUndefined(str: string) {
    return (str === "" || str === null || str === "null" || str === undefined || str === "undefined");
  }

}
