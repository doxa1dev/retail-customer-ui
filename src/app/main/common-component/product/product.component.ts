import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'app/core/models/product.model';
import { environment } from 'environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  FULL_PAYMENT_GIFT = 'Full Payment Gift';
  ONLINE_BANK_TRANSFER_PAYMENT_GIFT = 'Online Bank Transfer Payment Gift';
  storageUrl: string = environment.storageUrl;

  @Input() product: Product;
  @Input() showAdvisor: boolean;
  @Input() orderId: string;
  @Input() showCustomer : boolean;
  imageProduct: string;
  isShow: boolean;
  isShowListedPrice: boolean;
  isShowAdvisorInfo: boolean;
  inshowCustomerInfo : boolean;
  @Input() isOrderDetail: boolean;


  single_full_paymt_gifts: GiftDisplay[];
  online_bank_transfer_gifts: GiftDisplay[];
  hasSerialNumber: boolean = false;
  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
    if (this.product.hasAdvisor === true  ) {
      this.isShow = true;
      if (this.product.advisorId == undefined ) {
        this.isShow = false;
      }
    } else { 
      this.isShow = false;
    }

    if (this.product.listedPrice === this.product.price) {
      this.isShowListedPrice = false;
    } else {
      this.isShowListedPrice = true;
    }

    if (!CheckNullOrUndefinedOrEmpty(this.product.orderLineSinglePaymentGifts)) {
      this.single_full_paymt_gifts = this.aggregateGifts(this.product.orderLineSinglePaymentGifts);
      this.online_bank_transfer_gifts = this.aggregateGifts(this.product.orderLineOnlineBankingPaymentGifts);
    }
    if(!CheckNullOrUndefinedOrEmpty(this.product.warranty)){
      this.hasSerialNumber = true;
    }
    this.inshowCustomerInfo = CheckNullOrUndefinedOrEmpty(this.showCustomer) ? true : this.showCustomer;
    this.isShowAdvisorInfo = CheckNullOrUndefinedOrEmpty(this.showAdvisor) ? true : this.showAdvisor;
  }

  aggregateGifts(gifts: any[]): GiftDisplay[] {
    const giftDisplayArr: GiftDisplay[] = [];
    for (const gift of gifts) {
      const giftId = (gift.single_paymt_gift_product_id) ? gift.single_paymt_gift_product_id : gift.online_bank_transfer_gift_product_id;
      const giftObj = giftDisplayArr.find(obj => obj.id === giftId);
      if (!giftObj) {
        const giftName = (gift.single_paymt_gift_product_name) ? gift.single_paymt_gift_product_name : gift.online_bank_transfer_gift_product_name;
        const giftDisplay: GiftDisplay = {
          id: giftId,
          name: giftName,
          quantity: 1
        };
        giftDisplayArr.push(giftDisplay);
      }
      else {
        giftObj.quantity += 1;
      }
    }
    return giftDisplayArr;
  }

  // get translation
  getTranslation(orderId: string, productId: string) {
    let key = 'ORDER.' + orderId + '_' + productId + '.' + productId;
    return this.translateService.getStreamOnTranslationChange(key);
  }
}

interface GiftDisplay {
  id: string;
  name: string;
  quantity: number;
}
