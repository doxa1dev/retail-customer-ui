import { Component, OnInit, ViewEncapsulation, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-button-loading',
  templateUrl: './button-loading.component.html',
  styleUrls: ['./button-loading.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonLoadingComponent implements OnChanges {

 @Input() buttonName: string;
 @Input() disabledBtn: boolean;
 @Input() active: boolean;
 @Input() buttonText: string;

  barButtonOptions: MatProgressButtonOptions= {
    active: false,
    text: !isNullOrUndefined(this.buttonText) ? this.buttonText : this.buttonName,
    buttonColor: 'accent',
    barColor: 'primary',
    raised: true,
    stroked: false,
    fab: true,
    mode: 'indeterminate',
    value: 0,
    disabled: this.disabledBtn,
    // fullWidth: true,
    customClass: this.disabledBtn ? 'button-css btn-active' : 'button-css btn-disabled',
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  }

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!isNullOrUndefined(changes.disabledBtn)){
      this.disabledBtn = changes.disabledBtn.currentValue;
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-add-to-cart btn-active' : 'btn-add-to-cart btn-disabled';
    }
    if (!isNullOrUndefined(changes.buttonName)){
      this.buttonName = changes.buttonName.currentValue
    }
    if (this.buttonName === 'Add to Cart'){
      // this.barButtonOptions.customClass = 'btn-add-to-cart';
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-add-to-cart btn-active' : 'btn-add-to-cart btn-disabled';
    } else if (this.buttonName === 'Update'){
      this.barButtonOptions.customClass = this.disabledBtn ? 'button-css btn-active' : 'button-css btn-disabled';
    }

    if (this.buttonName ===  "Click here to complete payment"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-pay-at-office btn-active' : 'btn-pay-at-office btn-disabled';
    }
    if (this.buttonName ===  "NEXT"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-next btn-active' : 'btn-next btn-disabled';
    }
    if (this.buttonName ===  "PAY"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-pay btn-active' : 'btn-pay btn-disabled';
    }
    if (this.buttonName ===  "CREATE"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-create-activity btn-active' : 'btn-create-activity btn-disabled';
    }
    if (this.buttonName ===  "Save change"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-save-change btn-active' : 'btn-save-change btn-disabled';
    }
    if (this.buttonName ===  "Add new"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-add-atendee btn-active' : 'btn-add-atendee btn-disabled';
    }
    if (this.buttonName ===  "SIGN IN"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-signin btn-active' : 'btn-signin btn-disabled';
    }
    if (this.buttonName ===  "Search"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-search btn-active' : 'btn-search btn-disabled';
    }
    if (this.buttonName ===  "SEARCH"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-search-find-class btn-active' : 'btn-search-find-class btn-disabled';
    }
    if (this.buttonName ===  "Submit"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-submit btn-active' : 'btn-submit btn-disabled';
    }
    if (this.buttonName ===  "EXPORT"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-export btn-active' : 'btn-export btn-disabled';
    }
    if (this.buttonName ===  "CONFIRM"){
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-export btn-active' : 'btn-export btn-disabled';
    }
    if (this.buttonName === "Upload Image")
    {
      // this.barButtonOptions.fullWidth = true;
      this.barButtonOptions.customClass = !this.disabledBtn ? 'btn-scan btn-active' : 'btn-scan btn-disabled';
    }
    if (this.buttonName ===  "Apply"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-apply-new-advisor btn-active' : 'btn-apply-new-advisor btn-disabled';
    }
    if (this.buttonName ===  "Buy NAEP Package"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-buy-naep btn-active' : 'btn-buy-naep btn-disabled';
    }
    if (this.buttonName ===  "Submit"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-select-package-naep btn-active' : 'btn-select-package-naep btn-disabled';
    }
    if (this.buttonName ===  "Via Email"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-recruit btn-active' : 'btn-recruit btn-disabled';
    }
    if (this.buttonName ===  "Via Whatsapp"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-whatsapp btn-active' : 'btn-whatsapp btn-disabled';
    }
    if (this.buttonName ===  "Apply for New Advisor Earning Program"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-apply-new-advisor-earning btn-active' : 'btn-apply-new-advisor-earning btn-disabled';
    }
    if (this.buttonName ===  "MAKE PAYMENT" || this.buttonName === "PURCHASE" || this.buttonName === "GET REWARD"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-make-payment btn-active' : 'btn-make-payment btn-disabled';
    }
    if (this.buttonName ===  "Add to cart"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-add-to-cart-product btn-active' : 'btn-add-to-cart-product btn-disabled';
    }
    if (this.buttonName ===  "Buy Now"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-buy-now btn-active' : 'btn-buy-now btn-disabled';
    }
    if (this.buttonName ===  "Buy Package"){
      this.barButtonOptions.customClass = this.disabledBtn ? 'btn-buy-package btn-active' : 'btn-buy-package btn-disabled';
    }

    if (!isNullOrUndefined(this.buttonText)) {
      this.barButtonOptions.text = this.buttonText;
    } else {
      this.barButtonOptions.text = this.buttonName;
    }
    if (!isNullOrUndefined(changes.active)){  
      if (!isNullOrUndefined(changes.buttonName)) {
        this.buttonName = changes.buttonName.currentValue;
        this.barButtonOptions.text = changes.buttonName.currentValue;

        // if(this.active === true){
        //   this.bathis.barButtonOptions.text = changes.buttonName.currentValue;rButtonOptions.customClass = 'button-css';
        // }
      }
      this.active = changes.active.currentValue;
      this.barButtonOptions.active = this.active;
      this.barButtonOptions.text = this.buttonName;
    }
    
    // this.barButtonOptions = {
    //   active: false,
    //   text: 'Update',
    //   buttonColor: 'accent',
    //   barColor: 'primary',
    //   raised: true,
    //   stroked: false,
    //   fab: true,
    //   mode: 'indeterminate',
    //   value: 0,
    //   disabled: this.disabledBtn,
    //   // fullWidth: true,
    //   customClass: this.disabledBtn ? 'button-css btn-active' : 'button-css btn-disabled'
    //   // buttonIcon: {
    //   //   fontIcon: 'favorite'
    //   // }
    // }
  }

  someFunc2(): void {
    // this.barButtonOptions.active = true;
    // this.barButtonOptions.text = 'Progress...';
    // setTimeout(() => {
    //   this.barButtonOptions.active = false;
    //   this.barButtonOptions.text = this.buttonName;
    // }, 2000)
  }

}
