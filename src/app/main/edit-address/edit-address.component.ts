import { Component, OnInit, Input, Output , ViewEncapsulation} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EditAddressComponent implements OnInit {
  editAddress: FormGroup;

  constructor() { }



  ngOnInit(): void {
    this.editAddress = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      postalCode: new FormControl(),
      detailAddress: new FormControl(),
      unitNo: new FormControl(),
      cityState: new FormControl()
    });
  }
  onSubmit() {
    console.log(this.editAddress);
  }

}
