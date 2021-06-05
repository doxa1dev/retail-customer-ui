import { Component, OnInit, Input, Output , ViewEncapsulation} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DeliveryAddressComponent implements OnInit {
  deliveryAddress: FormGroup;

  constructor() { }



  ngOnInit(): void {
    this.deliveryAddress = new FormGroup({
      searchEmail: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      postalCode: new FormControl(),
      detailAddress: new FormControl(),
      unitNo: new FormControl(),
    });
  }
  onSubmit() {
    console.log(this.deliveryAddress);
  }

}
