import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  @Input() id: number;
  @Input() img_product: String;
  @Input() name_product: String;
  @Input() price_product: String;
 
  constructor() { }

  ngOnInit(): void {
  }

}
