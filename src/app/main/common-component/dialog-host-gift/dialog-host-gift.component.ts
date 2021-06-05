import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'app/core/models/product.model';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-dialog-host-gift',
  templateUrl: './dialog-host-gift.component.html',
  styleUrls: ['./dialog-host-gift.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DialogHostGiftComponent implements OnInit {

  public product;
  public allHostGift = [];
  public decoded;
  public select_gift_arr;
  public cartDiscount;
  roleArray: [];
  propertiesOfProduct = {} as any;
  modelGroups = [];
  isCheck: boolean = false;
  storeUrl = environment.storageUrl;
  selectedGift: any;
  token: string;
  isJustHost: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogHostGiftComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      if(data){
        this.product = data.product || this.product;
        this.allHostGift = data.host_gift || this.allHostGift;
        this.select_gift_arr = data.select_gift_arr || this.select_gift_arr;
        this.cartDiscount = data.cartDiscount || this.cartDiscount;
        this.isJustHost = data.just_host || this.isJustHost;
        this.renderData();
      }
    }

  ngOnInit(): void {

  }

  renderData(){
    this.selectedGift = this.select_gift_arr[0].value;
    let gift = this.allHostGift.find(e=> {return Number(e.id) == this.selectedGift});
    this.product = gift.component.find(item=> {return item.is_main_gift_product});
    this.token = localStorage.getItem('token');
    if (!CheckNullOrUndefinedOrEmpty(this.token)) {
      this.decoded = jwt_decode(this.token);
      this.roleArray = this.decoded.role;
    }
  }

  changeProperties() {
    for(let i = 0; i < this.product.properties.length ; i++)
    {
      this.propertiesOfProduct[this.product.properties[i]['name']] = this.modelGroups[i];
    }

    if (Object.values(this.propertiesOfProduct).filter(e => e === undefined).length === 0) {
      this.isCheck = false;
    }
  }

  changeGift(){
    let gift = this.allHostGift.find(e=> {return Number(e.id) == this.selectedGift});
    this.product = gift.component.find(item=> {return item.is_main_gift_product});
  }

  checkiIsHaveInternalDiscount() {
      if (CheckNullOrUndefinedOrEmpty(this.product.internal_discount_for)) {
        return false;
      } else {
        let sum = this.cartDiscount.find(e=> {return Number(e.product_id) == Number(this.product.product_id)});
        let isDiscount: boolean = false;
        this.roleArray.forEach(role => {
          if (this.product.internal_discount_for.includes(role) && 
            (moment(new Date()).format("YYYY-MM-DD") >= moment(this.product.internal_discount_start_time).format("YYYY-MM-DD")) 
            && sum?.sum < this.product.max_total_discount
          ){
            isDiscount = true;
          }
        })
        return isDiscount;
      }
  }

  checkHasPromotionPrice(price: string) {
    if (CheckNullOrUndefinedOrEmpty(price) || parseFloat(price) === 0) {
      return false
    }
    return true;
  }

  confirm() {
    if (this.product.properties.length> 0  && (Object.keys(this.propertiesOfProduct).length === 0 ||
        Object.values(this.propertiesOfProduct).filter(e => e === undefined).length != 0)) {
        
      this.isCheck = true;
      return;
    } else {

      this.isCheck = false;
    }

    this.dialogRef.close({state: true , property: this.propertiesOfProduct , gift_id: this.selectedGift });
  }

  cancel() {
    this.dialogRef.close({state: false});
  }

}
