import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-shipping-policy',
  templateUrl: './shipping-policy.component.html',
  styleUrls: ['./shipping-policy.component.scss']
})
export class ShippingPolicyComponent implements OnInit {

  constructor() { }

  entity: string = environment.entity;

  ngOnInit(): void {
  }

}
