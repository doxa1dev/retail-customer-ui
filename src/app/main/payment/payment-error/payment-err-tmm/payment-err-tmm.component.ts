import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from 'app/core/enum/title';

@Component({
  selector: 'app-payment-err-tmm',
  templateUrl: './payment-err-tmm.component.html',
  styleUrls: ['./payment-err-tmm.component.scss']
})
export class PaymentErrTMMComponent implements OnInit {
  title = Title.LEFT;
  orderID : string;
  transaction_Id: string;

  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activedRoute.queryParams.subscribe( param =>{
      this.orderID = param.orderId;
      this.transaction_Id = param.transactionId;
    })
  }
  gotoStore(){
    this.router.navigate(['/store'])
  }
  copyTransaction(){
    let copyText = document.getElementById('transactionId');
    let orderNumber = document.createElement('textarea');
    orderNumber.value = copyText.textContent;
    document.body.appendChild(orderNumber);
    orderNumber.select();
    document.execCommand('Copy');
    orderNumber.remove();
  }
  copyOrder(){
    let copyText = document.getElementById('orderId');
    let orderNumber = document.createElement('textarea');
    orderNumber.value = copyText.textContent;
    document.body.appendChild(orderNumber);
    orderNumber.select();
    document.execCommand('Copy');
    orderNumber.remove();
  }
}
