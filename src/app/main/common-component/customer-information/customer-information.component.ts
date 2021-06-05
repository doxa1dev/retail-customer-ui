import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.scss']
})
export class CustomerInformationComponent implements OnInit {

  storageUrl: string = environment.storageUrl;
  @Input() customerInformation
  customerImage: any;

  constructor() { }

  ngOnInit(): void {
    if (isNullOrUndefined(this.customerInformation.customerImage)) {
      this.customerImage = "assets/icons/ICON/UserMenu.svg";
    } else {
      this.customerImage = this.storageUrl +  this.customerInformation.customerImage;
    }
  }

}
