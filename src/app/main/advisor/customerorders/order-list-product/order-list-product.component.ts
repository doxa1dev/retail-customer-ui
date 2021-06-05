import { Router } from '@angular/router';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Order } from 'app/core/service/order.service';
import { isNullOrUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-order-list-product',
  templateUrl: './order-list-product.component.html',
  styleUrls: ['./order-list-product.component.scss']
})
export class OrderListProductComponent implements OnChanges {

  constructor(
    private router : Router,
    private translateService: TranslateService
  ) { }

  @Input() listOrder: Array<Order>;
  @Input() message: string;
  @Input() showIsBuying : boolean;
  @Input() showIsCustomerPay : boolean;
  @Input() showStatus: boolean;
  totalProduct: number;
  totalSum: number = 0;
  @Input() showAdvisor: boolean;
  @Input() showCustomer: boolean;
  ngOnChanges(changes: SimpleChanges) {
    if(!isNullOrUndefined(changes)&&!isNullOrUndefined(changes.listOrder)){
      this.listOrder = changes.listOrder.currentValue;
    }
  }

  totalItem(order)
  {
    let total = 0;
    if (order.listProduct.length > 0)
    {
      order.listProduct.forEach(product =>
      {
        total = total + product.quantity;
      });
      return total;
    }
  }
  // totalSumary(order) {
  //   var total = 0;
  //   if(order.listProduct.length > 0){
  //     order.listProduct.forEach(product => {
  //       total = total + product.quantity * Number(product.promotionalPrice);
  //     });
  //     return total;
  //   }
  // }
  goToDetail(uuid : string)
  {
    this.router.navigate(['/advisor/order-detail'],{queryParams : {uuid : uuid}});
  }

  // get translation
  getStaticTranslation(key) {
    return this.translateService.getStreamOnTranslationChange(key);
  }
}
