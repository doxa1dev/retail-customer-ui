import { formatDate } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateQuickOrder, OrderItemsQxpress, SpecialDelivery } from 'app/core/models/shipping.model';
import { OrderService } from 'app/core/service/order.service';
import { ShippingService } from 'app/core/service/shipping.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { environment } from 'environments/environment';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-special',
  templateUrl: './dialog-special.component.html',
  styleUrls: ['./dialog-special.component.scss']
})
export class DialogSpecialComponent implements OnInit {

  public type: string;
  public order: any;
  public id: number;
  public shipping_id: number;
  publicHolidayArr = [];
  timeOptionDateAfter = [];
  timeOptionDateBefore = [];
  selectDateAfter: string;
  selectDateBefore: string;
  selectDateOnly: string;
  selectTime: string;
  isCheckShowRequired: boolean = false;
  minDateShip = new Date();
  maxDateShip = new Date();
  specificDateTimeForm: FormGroup;
  nation_code = environment.entity === "MY" ? "MY" : "SG";
  getYear = (new Date()).getFullYear();
  isShowFocus: boolean = false;

  /**
  * Constructor
  *
  * @param {MatDialogRef<DialogCopyLinkComponent>} dialogRef
  */
  constructor(public dialogRef: MatDialogRef<DialogSpecialComponent>,
    private shippingService: ShippingService, private _formBuilder: FormBuilder,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      if (data) {
        this.type = data.type || this.type;
        this.id = data.id || this.id;
        this.shipping_id = data.shipping_id || this.shipping_id;
        this.order = data.order || this.order;
      }
  }


  confirm() {
    this.isCheckShowRequired = true;

    if (this.specificDateTimeForm.invalid) {
      return;
    }

    let formShipping = new SpecialDelivery();
    formShipping.sd_id = this.id;
    formShipping.sd_type = this.type;
    formShipping.select_date = (this.type == 'SD_ONLY' || this.type == 'SD_ONLY_LATER') ? this.selectDateOnly : (this.type == 'SD_BEFORE' ? this.selectDateBefore : this.selectDateAfter);
    formShipping.select_time = this.selectTime;

    if (this.type == 'SD_BEFORE') {
      this.shippingService.cancelQXpress(this.shipping_id).subscribe();

      let formCreate = new CreateQuickOrder();
      formCreate.orderId = '';
      formCreate.shipping_id = this.shipping_id;
      formCreate.customerName = this.order.deliveryAddress.firstName;
      formCreate.customerPhone = this.order.deliveryAddress.phoneDialCode + this.order.deliveryAddress.phoneNumber;
      formCreate.customerZipCode =  this.order.deliveryAddress.postalCode;
      formCreate.customerAddressLine1 = this.order.deliveryAddress.addressLine1;
      formCreate.customerAddressLine2 = this.order.deliveryAddress.addressLine2;
      formCreate.pickUpdate = this.selectDateBefore;
      formCreate.pickUpTime = this.selectTime;
  
      this.order.listProduct.forEach(element => {
        let orderItemsQxpress = new OrderItemsQxpress();
  
        orderItemsQxpress.ITEM_NM = element.productName;
        orderItemsQxpress.ITEM_ID = element.id;
        orderItemsQxpress.QTY = element.quantity;
        orderItemsQxpress.CURRENCY = element.currencyCode;
        orderItemsQxpress.PURCHASE_AMT = element.listedPrice;
        formCreate.orderItem.push(orderItemsQxpress);
      });

      this.shippingService.createQXpress(formCreate).pipe(
        mergeMap((data1) => this.orderService.updateSpecialShipping(formShipping))
      ).subscribe((data2) =>{
        if (data2.code === 200) {
          this.dialogRef.close(true);
        }
      })

    } else {
      this.updateSpecialShippingDate(formShipping);
    }
  }

  updateSpecialShippingDate(formShipping) {
    this.shippingService.cancelQXpress(this.shipping_id).pipe(
      mergeMap((data1) => this.orderService.updateSpecialShipping(formShipping))
    ).subscribe((data2) =>{
      if (data2.code === 200) {
        this.dialogRef.close(true);
      }
    })
  }

  cancel() {
    this.dialogRef.close(false);
  }

  ngOnInit(): void {
    this.maxDateShip.setDate(this.maxDateShip.getDate() + 7);
    this.minDateShip.setDate(this.minDateShip.getDate() + 3);
    this.shippingService.getPublicHoliday(this.nation_code, this.getYear).subscribe(data => {
      data.forEach(element => {
        this.publicHolidayArr.push(new Date(element));
      });
    });

    this.specificDateTimeForm = this._formBuilder.group({
      specificDate1: ['', Validators.required],
      specificDate2: ['', Validators.required],
      specificTime2: ['', Validators.required],
    })

    this.checkTimeDisableDate(this.type);

    if (this.type == 'SD_ONLY' || this.type == 'SD_ONLY_LATER') {
      this.specificDateTimeForm.get('specificDate2').disable();
      this.specificDateTimeForm.get('specificTime2').disable();
    
    } else {
      this.specificDateTimeForm.get('specificDate1').disable();
      this.specificDateTimeForm.get('specificTime2').disable();
    }
  }

  onChangeDateAfter(event) {
    this.selectDateAfter = formatDate(event, "yyyy-MM-dd", "en-US");
    this.shippingService.getSpTimeAfterByDate(this.selectDateAfter).subscribe(data => {
      this.timeOptionDateAfter = data;
    });

    this.specificDateTimeForm.get('specificTime2').enable();
  }

  onChangeDateBefore(event) {
    this.selectDateBefore = formatDate(event, "yyyy-MM-dd", "en-US");
    this.shippingService.getQuickTimeSlotQXpress(this.selectDateBefore).subscribe(data => {
      this.timeOptionDateBefore = data;
    });

    this.specificDateTimeForm.get('specificTime2').enable();
  }

  onChangeDateOnly(event) {
    this.selectDateOnly = formatDate(event, "yyyy-MM-dd", "en-US");
  }

  onChangeTime(event) {
    this.selectTime = !CheckNullOrUndefinedOrEmpty(event.value.DEL_TIME_SLOT) ? event.value.DEL_TIME_SLOT : event.value.time_slot;
  }

  onShowFocus() {
    if (!this.isShowFocus) {
      this.isShowFocus = true;
    }
  }

  renderDialCode(field,returnValue)
  {
    if(!CheckNullOrUndefinedOrEmpty(field))
    {
      return field.SelectedDial
    }else{
      return returnValue
    }
  }

  onYearChange(event) {

    if (Number(event.year) != this.getYear) {
      this.getYear = event.year;
      this.publicHolidayArr = [];
      this.shippingService.getPublicHoliday(this.nation_code, event.year).subscribe(data => {
        data.forEach(element => {
          this.publicHolidayArr.push(new Date(element));
        });
      });
    }
  }

  checkTimeDisableDate(type) {
    let getTimeNow = new Date().getHours();
    let getDayNow = new Date().getDay();
    this.minDateShip = new Date();

    if (type == 'SD_ONLY' || type == 'SD_ONLY_LATER') {
      switch(getDayNow) {
        case 0:
          this.minDateShip.setDate(this.minDateShip.getDate() + 4);
          break;
        case 1: 
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 3);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 4);
          }
          break;
        case 2:
        case 3:
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 3);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 4);
          }
          break;
        case 4:
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 3);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 6);
          }
          break;
        case 5:
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 5);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 6);
          }
          break;
        case 6:
          this.minDateShip.setDate(this.minDateShip.getDate() + 5);
          break;
      }
    
    } else if (type == 'SD_BEFORE') {
      switch(getDayNow) {
        case 0:
          this.minDateShip.setDate(this.minDateShip.getDate() + 4);
          break;
        case 1: 
        case 2:
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 3);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 4);
          }
          break;
        case 3:
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 3);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 6);
          }
          break;
        case 4:
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 5);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 6);
          }
          break;
        case 5:
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 5);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 6);
          }
          break;
        case 6:
          this.minDateShip.setDate(this.minDateShip.getDate() + 5);
          break;
      }

    } else if (type == 'SD_AFTER') {
      switch(getDayNow) {
        case 0:
          this.minDateShip.setDate(this.minDateShip.getDate() + 4);
          break;
        case 1: 
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 3);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 4);
          }
          break;
        case 2:
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 3);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 5);
          }
          break;
        case 3:
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 3);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 5);
          }
          break;
        case 4:
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 5);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 6);
          }
          break;
        case 5:
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 5);
          } else {
            this.minDateShip.setDate(this.minDateShip.getDate() + 6);
          }
          break;
        case 6:
          this.minDateShip.setDate(this.minDateShip.getDate() + 5);
          break;
      }

    }
  }
}
