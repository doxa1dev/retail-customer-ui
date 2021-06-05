import { Product } from 'app/core/models/product.model';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'app/core/service/product.service';
import { CartService } from 'app/core/service/cart.service';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { SharedService } from 'app/core/service/commom/shared.service';
import { isNullOrUndefined } from 'util';
import { environment } from 'environments/environment';
import { parse } from 'path';
import  { Title} from 'app/core/enum/title';
import * as jwt_decode from 'jwt-decode';
import { includes, take } from 'lodash';
import * as moment from "moment";
import { TranslateService } from '@ngx-translate/core';
import { element } from 'protractor';
@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {
  title = Title.LEFT;
  listProduct: any = [];
  categoryId: any;
  numberProducts : Observable<number>
  disable = false;
  total_product: number;
  decoded
  roleArray : [];
  checkLength: boolean = false;
  /** store url get enviroment */
  storageUrl = environment.storageUrl;
  name : string;

  /** translation */
  lstEn: any[] = [];
  lstZh: any[] = [];
  lstMy: any[] = [];

  constructor(
    public productService: ProductService,
    public cartService:  CartService,
    public activatedRoute: ActivatedRoute,
    public sharedService: SharedService,
    private translateService: TranslateService
  ) { }

  async ngOnInit() { 
    var token =  localStorage.getItem('token');
    
    if(!isNullOrUndefined(token))
    {
      this.decoded = jwt_decode(token);
      this.roleArray = this.decoded.role;
    }
    if(isNullOrUndefined(token)){
      this.total_product = 0;
    } else {
      this.cartService.getCartByCustomerId().subscribe(data =>
      {
        if(data === undefined){
          this.total_product = 0;
        }
        else{
          this.total_product = data.cartItems.length;
        }
      })
    }

    this.activatedRoute.queryParams
    .subscribe(params=>{
      this.categoryId = params.categoryId;
    }) 
    this.productService.getListProductByCategoty(this.categoryId , this.name).subscribe(data=>{
      this.listProduct = data;
      setTimeout(() => {
        this.checkLength = this.listProduct.length > 0 ? false : true; 
      }, 1000);

      // get list translation
      for (const product of this.listProduct) {
        if (product.translations.length > 0) {
          product.translations.forEach(element => {
            if (element.language_code === 'en') {
              let objEn = {};
              objEn["ProductId"] = element.productId;
              objEn["Title"] = element.title;
              this.lstEn.push(objEn);
            } else if (element.language_code === 'en') {
              let objZh = {};
              objZh["ProductId"] = element.productId;
              objZh["Title"] = element.title;
              this.lstZh.push(objZh);
            } else {
              let objMy = {};
              objMy["ProductId"] = element.productId;
              objMy["Title"] = element.title;
              this.lstMy.push(objMy);
            }
          })
        }
      }

      // set translation
      this.translateService.getTranslation('en').subscribe(() => {
        let obj = {
          "PRODUCT": {
            "TITLE": {}
          }
        }
        this.lstEn.forEach(element => {
          obj["PRODUCT"]["TITLE"][element["ProductId"]] = element["Title"];
        });
        // set english language
        this.translateService.setTranslation('en', obj, true);

        /** ------------------- */
        this.translateService.getTranslation('en').subscribe(() => {
          let obj = {
            "PRODUCT": {
              "TITLE": {}
            }
          }
          this.lstZh.forEach(element => {
            obj["PRODUCT"]["TITLE"][element["ProductId"]] = element["Title"];
          });
          // set chinese language
          this.translateService.setTranslation('en', obj, true);

          /** ------------------ */
          // set malay language
          this.translateService.getTranslation('my').subscribe(() => {
            let obj = {
              "PRODUCT": {
                "TITLE": {}
              }
            }
            this.lstMy.forEach(element => {
              obj["PRODUCT"]["TITLE"][element["ProductId"]] = element["Title"];
            });
            this.translateService.setTranslation('my', obj, true);
          });
        });
      });
    })


  }
  checkiIsHaveInternalDiscount(product : Product)
  {
    if(isNullOrUndefined(this.decoded))
    {
      return false;
    }else{
      if(isNullOrUndefined(product.internal_discount_for))
      {
        return false;
      }else{
        let isDiscount : boolean = false;
        this.roleArray.forEach(role=>{
          if(product.internal_discount_for.includes(role) && (moment(new Date()).format("YYYY-MM-DD") >= moment(product.internal_discount_start_time).format("YYYY-MM-DD") ) && product.total < product.max_total_discount){
            isDiscount = true;
          }
        })
        return isDiscount;
      }
    }

  }


  checkHasPromotionPrice(price: string)
  {
    if(isNullOrUndefined(price) || parseFloat(price) === 0){
      return false
    }
    return true;
  }
  search(searchString: string):void{
    setTimeout(() => {
      this.productService.getListProductByCategoty(this.categoryId , searchString).subscribe( data => {
        this.listProduct = data
      })
    }, 500);
  }

  // get translation
  getTranslation(id: string) {
    let key = 'PRODUCT.TITLE.' + id + '';
    return this.translateService.getStreamOnTranslationChange(key);
  }
}
