import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from 'app/core/enum/title';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit {
  title = Title.LEFT;
  uuid : string;
  constructor(
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params) => {
      this.uuid = params.order_tmm ;;
      console.log(this.uuid)
    });
  }

}
