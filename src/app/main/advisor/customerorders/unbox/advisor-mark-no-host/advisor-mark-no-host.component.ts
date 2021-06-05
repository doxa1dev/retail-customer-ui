import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Order, OrderService } from 'app/core/service/order.service';
import { REASONS_FOR_ADVISOR_TO_NOT_HOST } from '../../../../../core/constants/constant';
import { isNullOrUndefined } from 'util';
import { Title } from 'app/core/enum/title';
@Component({
  selector: 'app-advisor-mark-no-host',
  templateUrl: './advisor-mark-no-host.component.html',
  styleUrls: ['./advisor-mark-no-host.component.scss']
})
export class AdvisorMarkNoHostComponent implements OnInit {
  title = Title.LEFT;
  order: Order;
  reason: string;
  reasonInput: string;
  reasonList = REASONS_FOR_ADVISOR_TO_NOT_HOST;
  isError : boolean = false;
  order_id : string;
  constructor(
    private _location: Location,
    private router: Router,
    private orderSevice: OrderService,
    private activatedRoute: ActivatedRoute,
  )
  {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.order_id = params.uuid;
    });
  }

  ngOnInit(): void
  {
    this.reason = this.reasonList[0].value;
  }
  onKey(event){
    if(this.isError === true && event.target.value !== '')
    {
      this.isError = false;
    }
    if(event.target.value === '')
    {
      this.isError = true;
    }
  }

  back()
  {
    this._location.back();
  }

  backHistory()
  {
    if(this.reason === '100')
    {
      if (isNullOrUndefined(this.reasonInput))
      {
        this.isError = true;
        return;
      }
    }
    const rea = this.reasonList.find(el => el.value === this.reason) ? this.reasonList.find(el => el.value === this.reason).label : this.reasonInput;

    this.orderSevice.updateReasonForNoHostNoUnbox(rea, this.order_id, 1).subscribe(
      data =>
      {
        this.router.navigate(['/advisor/customerorders'], { state: { selectTab: 6 } });
      });
  }

}
