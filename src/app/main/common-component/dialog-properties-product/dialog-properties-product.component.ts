import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'app/core/models/product.model';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { environment } from 'environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-dialog-properties-product',
  templateUrl: './dialog-properties-product.component.html',
  styleUrls: ['./dialog-properties-product.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DialogPropertiesProductComponent {

  public product;
  public decoded;
  storeUrl = environment.storageUrl;
  modelGroups = [];
  roleArray: [];
  propertiesOfProduct = {} as any;
  isCheck: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogPropertiesProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data)
      {
        this.product = data.product || this.product;
      }
    }

  changeProperties() {
    for(let i = 0; i < this.product.propertiesv2.length ; i++)
    {
      this.propertiesOfProduct[this.product.propertiesv2[i]['name']] = this.modelGroups[i];
    }

    if (Object.values(this.propertiesOfProduct).filter(e => e === undefined).length === 0) {
      this.isCheck = false;
    }
  }

  confirm() {
    if (Object.keys(this.propertiesOfProduct).length === 0 ||
        Object.values(this.propertiesOfProduct).filter(e => e === undefined).length != 0) {
        
      this.isCheck = true;
      return;
    } else {

      this.isCheck = false;
    }

    this.dialogRef.close({ data: this.propertiesOfProduct });
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

  checkHasPromotionPrice(price: string) {
    if (CheckNullOrUndefinedOrEmpty(price) || parseFloat(price) === 0) {
      return false
    }
    return true;
  }

  checkiIsHaveInternalDiscount(product: Product) {
    if (CheckNullOrUndefinedOrEmpty(this.decoded)) {
      return false;
    } else {
      if (CheckNullOrUndefinedOrEmpty(product.internal_discount_for)) {
        return false;
      } else {
        let isDiscount: boolean = false;
        this.roleArray.forEach(role => {
          if (product.internal_discount_for.includes(role) && (moment(new Date()).format("YYYY-MM-DD") >= moment(product.internal_discount_start_time).format("YYYY-MM-DD")) && product.total < product.max_total_discount) {
            isDiscount = true;
          }
        })
        return isDiscount;
      }
    }
  }
}
