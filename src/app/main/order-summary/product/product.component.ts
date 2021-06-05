import { Product } from 'app/core/models/product.model';
import { Component, OnInit, Input } from '@angular/core';
import { isNullOrUndefined } from 'util';
import * as jwt_decode from 'jwt-decode';
import * as moment from "moment";
import { environment } from 'environments/environment';
import { isEmpty } from 'lodash';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() productName: any;
  @Input() oldPrice: any;
  @Input() newPrice: any;
  @Input() properties: [];
  @Input() advisor_name: any;
  @Input() advisor_id: any;
  @Input() quantity: any;
  @Input() image: any;
  @Input() isShow: boolean;
  @Input() currency_code : string;
  @Input() product : any;
  @Input() discountPrice : any;
  @Input() naep_discount_price  : any;
  checkProduct: boolean = false;
  @Input() redemption_price: any;
  @Input() is_redemption_cart: boolean;
  
  decoded
  roleArray;
  token: string;
  constructor() { }

  ngOnInit(): void {

    if (isEmpty(this.product)) {
      this.checkProduct = true;
    }

    this.token =  localStorage.getItem('token');
    if(!isNullOrUndefined(this.token))
    {
      this.decoded = jwt_decode(this.token);
      this.roleArray = this.decoded.role;
    }
  }

  checkiIsHaveInternalDiscount(product)
  {
    if(isNullOrUndefined(this.decoded))
    {
      //Not Login
      return null;
    }else{
      if(product.is_naep_discount && product.is_deposit && !isNullOrUndefined(product.naep_discount_price)){
        //Customer NAEP
        return 1
      }else if(isNullOrUndefined(product.internal_discount_for))
      {
        //Not Has Internal Discount Product
        return 3;
      }else{
        //Check Internal Discount Product
        let isDiscount : boolean = false;
        this.roleArray.forEach(role=>{
          if(product.internal_discount_for.includes(role) && (moment(new Date()).format("YYYY-MM-DD") >= moment(product.internal_discount_start_time).format("YYYY-MM-DD") ) && product.total <= product.max_total_discount){
            isDiscount = true;
          }
        })
        //3-has internal-discount
        return isDiscount ? 2 : 3;
      }
    }

  }
  
  checkHasPromotionPrice(price: string)
  {
    if (isNullOrUndefined(price) || parseFloat(price) === 0)
    {
      return false
    }
    return true;
  }
}
