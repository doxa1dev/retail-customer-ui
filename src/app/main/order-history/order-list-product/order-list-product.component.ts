import { Router } from '@angular/router';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Order } from 'app/core/service/order.service';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-order-list-product',
  templateUrl: './order-list-product.component.html',
  styleUrls: ['./order-list-product.component.scss']
})
export class OrderListProductComponent implements OnChanges {

  constructor(
    private router : Router
  ) { }

  @Input() listOrder: Array<Order>;
  @Input() message: string;
  @Input() showAdvisor: boolean;
  @Input() showIsBuying : boolean;
  @Input() showIsCustomerPay : boolean;
  @Input() showStatus: boolean;
  @Input() showCustomer: boolean;
  totalProduct: number;
  totalSum: number = 0;

  @Input() isOrderDetail: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if (!isNullOrUndefined(changes.listOrder))
      this.listOrder = changes.listOrder.currentValue;
  }

  totalItem(order) {
    let total = 0;
    if (order.listProduct.length > 0) {
      order.listProduct.forEach(product => {
        total = total + product.quantity;
      });
      return total;
    }
  }

  goToDetail(uuid : string)
  {
    this.router.navigate(['/order-detail'],{queryParams : {uuid : uuid}});
  }
}
