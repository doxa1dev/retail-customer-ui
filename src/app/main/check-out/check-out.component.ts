import { dialCode } from './../../../environments/common-env-variables';
import { customer } from './../../core/models/list_recruit.model';
import { Value } from './../../core/service/reports.service';
import { element } from 'protractor';
import { Component, OnInit, Input, Output, ViewEncapsulation, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DialCodeComponent } from '../account/authentication/dial-code/dial-code.component';
import { DeliveryAddress } from '../../core/models/delivery-address.model';
import { Router, ActivatedRoute } from '@angular/router';
import { DeliveryAddressService } from '../../core/service/delivery-address.service';
import { CustomerInformation } from '../../core/models/customer-infomation.model';
import { CustomerInformationService } from '../../core/service/customer-information.service';
import { CartService } from 'app/core/service/cart.service';
import { isNullOrUndefined } from 'util';
import { Shipping, SpecialDelivery, CreateQuickOrder, OrderItemsQxpress } from '../../core/models/shipping.model';
import { ShippingService } from '../../core/service/shipping.service';
import { CartItem } from 'app/core/models/cart.model';
import { environment } from '../../../environments/environment';
import { Title } from 'app/core/enum/title';
import * as jwt_decode from 'jwt-decode';
import * as moment from "moment";
import { TranslateService } from '@ngx-translate/core';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { MyContactsService } from 'app/core/service/my-contact.service';
import { pattern} from 'app/core/enum/pattern'
import { DOCUMENT, formatDate } from "@angular/common";
import { MyProfileService } from 'app/core/service/my-profile.service';
import { MyProfile } from 'app/core/models/my-profile.model';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';

interface Food {
  value: string;
  viewValue: string;
}

interface Location{
  id : number;
  name: string;
  color: string;
  // disable: boolean
}

interface ContactList{
  activity_id : number;
  id : number;
  email: string;
  first_name: string;
  phone_dial_code: string;
  phone_number: string;
}



/** @title Basic datepicker */
@Component({
  selector: 'check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CheckoutComponent implements OnInit {
  checkCopyFrom: boolean = false;
  countryCodeToName = environment.countryCodeToName;
  stateCodeToName = null;
  stateCodeToNameFormOptions = null;
  isDefaultSelfCollect = true;
  valueCheck = 0;
  checkDay = 0;
  messageMissDay = " ";
  checkDeliveryAddress = " ";
  checkDate = " ";
  disableCheckOut = false;
  selectedaaaa = 'option2';
  cartCustomerInformation: number;
  mail_phone_active = true;
  self_collect_free_active = true;
  edit_customer_information_active = false;
  deliveryAddress: FormGroup;
  customerInformation: FormGroup;
  address: DeliveryAddress;
  customer: CustomerInformation;
  shipping: Shipping;
  customerInfo: FormGroup;
  cartDeliveryAddress: number;
  shipping_id: number;
  notesForShipping: string;
  // dateforDelivery : Date;
  delivery_address_id: number;
  showAddress: DeliveryAddress;
  displayAddress: string;
  displayStateCountry: string;
  showAddressEmail: string;
  showCustomer: CustomerInformation;
  showCustomerName: string;
  showCustomerEmail: string;
  showCustomerNumber: string;
  showCustomerDiaCodePhoneNumber: string;
  showDeliveryAddressDiaCodePhoneNumber: string;
  showCustomerPhoneNumber: string;
  showAddressPhoneNumber: string;
  email_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  btnViewSummary = "VIEW SUMMARY";
  @Input() subTotal = 0;
  @Input() shipping1 = 0;
  @Input() sumTotal = 0;
  @Input() Total = 0;
  @Input() currency: string = "";
  carArr = new Array();
  arrShipping = new Array();
  arrSDShipping = new Array();
  cartShop: any;
  total_product: number;
  shipping2: any;
  date3: Date;
  minDate: Date = new Date();
  initValue: number;
  SelectedDial = 84;
  isShowInfo: boolean = false;
  isShowAddress: boolean = false;
  title = Title.LEFT;
  decoded
  roleArray : string[] = [];
  token: string;
  nation_code =  environment.entity === "MY" ? "MY" : "SG";
  city_state_code;

  shipping_location: Location[];
  loading: boolean= true; 
  is_disaled_city : boolean = false;
  shipping_location_name: string;

  //check
  checkOffice = environment.checkOffice;
  shipping_location_selected  : Location;
  isShowErrorShippingLocation : boolean =  false;
  shippingInformation : any;

  //naep
  naepShipping: number = 0;
  naepSubTotal: number = 0;
  naepTotal: number = 0;
  isCheckNaep: boolean = false;
  is_buy_for_customer : boolean = false;
  is_show_add_new_customer : boolean = false;
  contact_list : ContactList[];
  is_choose_customer : boolean = false;
  is_choose_contact_list : boolean = false;
  customerContactList : ContactList;
  is_choose_add_new : boolean = false;
  email_add_new : string = '';
  is_valid_email_add_new : boolean = false;
  is_show_invalid_add_new : boolean = false;
  is_summit_check_out : boolean = false;
  cart_id : number;
  is_has_account :boolean = false;
  is_show_customer_info : boolean  = true;
  is_advisor : boolean = false;
  customer_init_id : number;
  advisor_uuid : string;
  language_code : string;

  //check shipping special
  isShowFormShippingSpecial: boolean = false;
  minDateShipping: Date = new Date();
  selectTime: string;
  is_redemption_cart : boolean;

  publicHolidayArr = [];
  valueRadio: number;
  isCheckShowRadio1: boolean = false;
  isCheckShowRadio2: boolean = false;
  isCheckShowRadio3: boolean = false;

  timeOption = [];

  timeOptionDateAfter = [];
  minDateShip = new Date();
  isCheckBtnLater: boolean = false;
  isCheckShowRequired: boolean = false;

  timeOptionDateBefore = [];

  specificDateTimeForm: FormGroup;
  // priceShipCurrent: number = 0;
  valueShipCurrent: number = 0;
  valueShipSDPrice: number = 0;
  valueShipSD: number;
  specialDeliveryData: SpecialDelivery;
  // isCheckSpecial: boolean = false;
  isCheckButton1: boolean = false;
  isCheckButton2: boolean = false;
  isCheckButton3: boolean = false;
  isCheckShowSpecial: boolean = false;

  maxDateShip = new Date();
  getYear = (new Date()).getFullYear();

  totalWeight: number;
  shippingFee: any;
  isEntityMy: boolean;

  constructor(
    private cart: CartService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private deliveryAddressService: DeliveryAddressService,
    private customerInformationService: CustomerInformationService,
    private activedRoute: ActivatedRoute,
    private shippingService: ShippingService,
    private translateService: TranslateService,
    private contactService: MyContactsService,
    @Inject(DOCUMENT) private document: Document,
    private myProfileService: MyProfileService,
    private dialog : MatDialog) {
      this.isEntityMy = environment.entity === "MY";
    }
    

  @ViewChild(DialCodeComponent) dialcode: DialCodeComponent;

  ngOnInit(): void {
    this.totalWeight = 0;
    this.shippingFee = 0;
    this.token =  localStorage.getItem('token');
    this.currency = localStorage.getItem('currency');
    if(!isNullOrUndefined(this.token))
    {
      this.decoded = jwt_decode(this.token);
      this.roleArray = this.decoded.role;
      this.is_advisor = this.roleArray.includes('ADVISOR') ? true : false;
    }
    this.minDate.setDate(this.minDate.getDate() + 2);
    this.maxDateShip.setDate(this.maxDateShip.getDate() + 7);
    this.getListCart();

    this.minDateShip.setDate(this.minDateShip.getDate() + 3);

    this.shipping2 = 0;

    this.deliveryAddress = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      emailAddress: ['', [Validators.required, Validators.pattern(this.email_pattern)]],
      phoneNumber: ['', [Validators.required, phoneNumberValidator]],
      addressLine1: ['', [Validators.required, Validators.maxLength(40)]],
      addressLine2: ['', [Validators.required,Validators.maxLength(40)]],
      addressLine3: ['', Validators.maxLength(40)],
      postalCode: ['', Validators.required],
      stateCode: ['', Validators.required],
      countryCode: ['', Validators.required],
    });

    this.customerInformation = this._formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email_address: ['', [Validators.required, Validators.pattern(this.email_pattern)]],
      phone_number: ['', [Validators.required, phoneNumberValidator]],
    });

    this.specificDateTimeForm = this._formBuilder.group({
      specificDate1: ['', Validators.required],

      specificDate2: ['', Validators.required],
      specificTime2: ['', Validators.required],

      specificDate3: ['', Validators.required],
      specificTime3: ['', Validators.required]
    })
    
    this.stateCodeToNameFormOptions = environment.countryCodeToStates[this.nation_code];
    this.city_state_code = environment.entity === "MY" ? null: Object.keys(this.stateCodeToNameFormOptions)[0];

    this.contactService.getContactListForAdvisorBuyOrder('').subscribe(data=>{
      this.contact_list = data;
    });

    this.shippingService.getPublicHoliday(this.nation_code, this.getYear).subscribe(data => {
      data.forEach(element => {
        this.publicHolidayArr.push(new Date(element));
      });
    });

    this.specificDateTimeForm.disable();
  }
  /**
 * get cart
 * @param cartPrice 
 */
  getListCart(): Promise<any> {
    return new Promise(resolve => {
      this.cart.getCartByCustomerId().subscribe(
        respone => {
          if (!isNullOrUndefined(respone)) {

            let cartInfo = respone;
            this.cart_id = cartInfo.id;
            this.customer_init_id = cartInfo.customer_id;
            this.shippingInformation = cartInfo.shipping.shippinglocation;
            this.cartShop = cartInfo;
            this.shipping_id = cartInfo.shipping.id;
            this.showAddress = cartInfo.cart_delivery_address;
            this.delivery_address_id = cartInfo.cart_delivery_address.id;
            this.cartCustomerInformation = cartInfo.customer_information.id;
            this.showAddressEmail = this.showAddress.email;
            this.showAddressPhoneNumber = '(+' + this.showAddress.phone_dial_code + ') ' + this.showAddress.phone_number;
            this.showCustomerName = cartInfo.customer_information.last_name + ' ' + cartInfo.customer_information.first_name;
            this.showCustomerEmail = cartInfo.customer_information.email;
            this.showCustomerNumber = '(+' + cartInfo.customer_information.phone_dial_code + ') ' + cartInfo.customer_information.phone_number;
            this.showCustomerDiaCodePhoneNumber = cartInfo.customer_information.phone_dial_code;
            this.showCustomerPhoneNumber = cartInfo.customer_information.phone_number;
            this.is_buy_for_customer = cartInfo.is_buying_for_customer;
            this.is_has_account = cartInfo.is_has_account;
            this.is_show_customer_info = !this.is_has_account;
            this.is_choose_customer = true;
            this.is_choose_add_new = true;
            this.is_choose_contact_list = true;
            this.is_redemption_cart = cartInfo.is_redemption_cart;

            if (cartInfo.isCheckSpecialOnly || cartInfo.isCheckSpecialBefore || cartInfo.isCheckSpecialAfter) {
              this.isCheckShowSpecial = true;
            } else {
              this.isCheckShowSpecial = false;
            } 
            //form delivery address
            this.deliveryAddress.get('firstName').setValue(cartInfo.cart_delivery_address.first_name);
            this.deliveryAddress.get('lastName').setValue(cartInfo.cart_delivery_address.last_name);
            this.deliveryAddress.get('emailAddress').setValue(cartInfo.cart_delivery_address.email);
            this.deliveryAddress.get('phoneNumber').setValue(cartInfo.cart_delivery_address.phone_number);
            this.deliveryAddress.get('addressLine1').setValue(cartInfo.cart_delivery_address.address_line1);
            this.deliveryAddress.get('addressLine2').setValue(cartInfo.cart_delivery_address.address_line2);
            this.deliveryAddress.get('addressLine3').setValue(cartInfo.cart_delivery_address.address_line3);
            this.deliveryAddress.get('postalCode').setValue(cartInfo.cart_delivery_address.postal_code);
            this.deliveryAddress.get('stateCode').setValue(cartInfo.cart_delivery_address.state_code);
            this.deliveryAddress.get('countryCode').setValue(cartInfo.cart_delivery_address.country_code);
            this.showDeliveryAddressDiaCodePhoneNumber = cartInfo.cart_delivery_address.phone_dial_code;

            //form customer Information
            this.customerInformation.get('first_name').setValue(cartInfo.customer_information.first_name);
            this.customerInformation.get('last_name').setValue(cartInfo.customer_information.last_name);
            this.customerInformation.get('email_address').setValue(cartInfo.customer_information.email);
            this.customerInformation.get('phone_number').setValue(cartInfo.customer_information.phone_number);
            this.customerContactList = this.is_has_account ? cartInfo.customer_buy : null;
            this.edit_customer_information_active = false;
            this.total_product = cartInfo.cartItems.length;

            cartInfo.cartItems.forEach(element => {
              let cartitem = new CartItem;
              this.totalWeight += element.product_weight * element.quantity;
              cartitem.id = element.id;
              cartitem.product_name = element.product_name;
              cartitem.quantity = element.quantity;
              this.total_product += element.quantity;
              cartitem.properties = element.properties;
              cartitem.listed_price = element.listed_price;
              cartitem.promotional_price = element.promotional_price;
              cartitem.has_advisor = element.has_advisor;
              cartitem.has_special_payment = element.has_special_payment;
              cartitem.shipping_fee = element.shipping_fee;
              cartitem.currency_code = element.currency_code;
              cartitem.internal_discount_for = element.internal_discount_for;
              cartitem.internal_discount_price = element.internal_discount_price;
              cartitem.internal_discount_start_time = element.internal_discount_start_time;
              cartitem.total = element.total;
              cartitem.max_total_discount = element.max_total_discount;
              cartitem.is_naep_discount = element.is_naep_discount;
              cartitem.is_deposit = element.is_deposit;
              cartitem.is_fee = element.is_fee;
              cartitem.is_kit = element.is_kit;
              cartitem.naep_discount_price = element.naep_discount_price;
              cartitem.redemption_price = element.redemption_price;
              cartitem.sd_price = element.sd_price;

              //check naep
              if (cartitem.is_naep_discount) {
                this.isCheckNaep = true;
  
                if (element.is_fee || element.is_deposit) {
                  this.naepSubTotal = this.naepSubTotal + (element.quantity * Number(this.getPrice2(cartitem)));
                  this.naepTotal = this.naepSubTotal + this.naepShipping;
                }
                
              } else {
                this.isCheckNaep = false;
              }

              this.arrShipping.push(Number(element.shipping_fee));

              if (!CheckNullOrUndefinedOrEmpty(element.sd_price)) {
                this.arrSDShipping.push(Number(element.sd_price));
              }

              this.valueShipCurrent = Math.max.apply(Math, this.arrShipping);
              this.valueShipSD = Math.max.apply(Math, this.arrSDShipping);
              this.valueShipSDPrice = Number(this.valueShipCurrent) + Number(this.valueShipSD);

              this.carArr.push(
                cartitem
              );

              if (cartInfo.is_redemption_cart) {
                this.subTotal = this.subTotal + element.quantity * Number(cartitem.redemption_price)
                this.sumTotal = this.sumTotal + element.quantity *  Number(cartitem.redemption_price)
                this.Total = this.sumTotal;
  
              } else {
                this.subTotal = this.subTotal + element.quantity * Number(this.getPrice2(cartitem))
                this.sumTotal = this.sumTotal + element.quantity *  Number(this.getPrice2(cartitem))
                this.Total = this.sumTotal;
              }
            });

            
            this.initValue = this.Total;
            this.Total = this.Total + Number(this.shipping2);
            // this.currency = this.carArr[0].currency_code;
            this.stateCodeToName = environment.countryCodeToStates[this.showAddress.country_code];
            // this.stateCodeToNameFormOptions = environment.countryCodeToStates[this.showAddress.country_code];
            this.setDisplayAddressLine();
            this.setStateCountryLine();

            this.loading=false;

            this.shippingService.getShippingLocation().subscribe(
              data => {
                //Change position of West Malaysia
                if(data.length == 1) {
                  this.shipping_location = data; 
                }
                else {
                  this.shipping_location = moveArrayItemToNewIndex(data, 4, 0);
                }
                this.is_disaled_city = data.length > 1 ? false : true;
                if(CheckNullOrUndefinedOrEmpty(this.shippingInformation))
                {
                  this.shipping_location_selected = data.length > 1 ? null : this.shipping_location[0];
                }else{
                  this.shipping_location_selected = this.shipping_location.find(element=>{
                     return  element.id == this.shippingInformation.id
                  })
                }
              }
            )

            //form special Delivery
            if (!CheckNullOrUndefinedOrEmpty(this.cartShop.shipping.SpecialDelivery)) {
              this.self_collect_free_active = false;
              // this.isCheckSpecial = true;
              this.isDefaultSelfCollect = false;
              this.isShowFormShippingSpecial = true;
              let shipData = this.cartShop.shipping.SpecialDelivery;

              if (shipData.sd_type == "SD_ONLY") {
                this.isCheckShowRadio1 = true;
                this.isCheckButton1 = true;
                this.shipping2 = this.valueShipCurrent;
                this.Total = this.initValue + Number(this.shipping2);
                this.checkTimeDisableDate(1);

                if (!CheckNullOrUndefinedOrEmpty(shipData.select_date)) {
                  this.specificDateTimeForm.get('specificDate1').setValue(new Date(shipData.select_date));
                  this.specificDateTimeForm.get('specificDate1').enable();
                
                } else {
                  this.isCheckBtnLater = true;
                  this.specificDateTimeForm.get('specificDate1').disable();
                }

              } else if (shipData.sd_type == "SD_BEFORE") {
                this.isCheckShowRadio2 = true;
                this.isCheckButton2 = true;
                this.checkTimeDisableDate(2);

                this.shippingService.getQuickTimeSlotQXpress(shipData.select_date).subscribe(data => {
                  this.timeOptionDateBefore = data;
                  this.specificDateTimeForm.get('specificTime2').setValue(this.timeOptionDateBefore.find(time => time.DEL_TIME_SLOT == shipData.select_time));
                  this.selectTime = shipData.select_time;
                });

                this.specificDateTimeForm.get('specificDate2').setValue(new Date(shipData.select_date));
                this.specificDateTimeForm.get('specificDate2').enable();
                this.specificDateTimeForm.get('specificTime2').enable();

                //check ship
                this.shipping2 = this.valueShipSDPrice;
                this.Total = this.initValue + Number(this.shipping2);

              } else if (shipData.sd_type == "SD_AFTER") {
                this.isCheckShowRadio3 = true;
                this.isCheckButton3 = true;
                this.checkTimeDisableDate(3);

                this.shippingService.getSpTimeAfterByDate(shipData.select_date).subscribe(data => {
                  this.timeOptionDateAfter = data;
                  this.specificDateTimeForm.get('specificTime3').setValue(this.timeOptionDateAfter.find(time => time.time_slot == shipData.select_time));
                  this.selectTime = shipData.select_time;
                });

                this.specificDateTimeForm.get('specificDate3').setValue(new Date(shipData.select_date));
                this.specificDateTimeForm.get('specificDate3').enable();
                this.specificDateTimeForm.get('specificTime3').enable();

                //check ship
                this.shipping2 = this.valueShipSDPrice;
                this.Total = this.initValue + Number(this.shipping2);
              }

            }
          }
        }
      );
    });
  }

  getPrice2(cartitem : CartItem){
    return this.checkiIsHaveInternalDiscount(cartitem) === 1 ? cartitem.naep_discount_price : 
    this.checkiIsHaveInternalDiscount(cartitem) === 2 ? cartitem.internal_discount_price :
    isNullOrUndefined(cartitem.promotional_price) ? Number(cartitem.listed_price) : Number(cartitem.promotional_price)
  }

  onSubmit() {
    this.isShowAddress = true;
    if (this.deliveryAddress.invalid)
    {
      return;
    }

    this.address = new DeliveryAddress(
      this.deliveryAddress.value.firstName,
      this.deliveryAddress.value.lastName,
      this.deliveryAddress.value.emailAddress,
      this.dialcode.selectedDial,
      this.deliveryAddress.value.phoneNumber,
      this.deliveryAddress.value.addressLine1,
      this.deliveryAddress.value.addressLine2,
      this.deliveryAddress.value.addressLine3,
      this.deliveryAddress.value.postalCode,
      this.deliveryAddress.value.stateCode,
      this.deliveryAddress.value.countryCode,
    );

    this.getShippingFee();

    this.mail_phone_active = true;
    return this.deliveryAddressService.updateDeliveryAddress(this.address)
      .subscribe(
        response => {
          if (response.code == 200) {
            this.isShowAddress = false;

            this.showDeliveryAddressDiaCodePhoneNumber = response.data.phone_dial_code;
            this.delivery_address_id = response.data.id;
            this.showAddress = response.data;
            this.showAddressEmail = this.showAddress.email;
            this.showAddressPhoneNumber = '(+' + this.showAddress.phone_dial_code + ') ' + this.showAddress.phone_number;
            if (!this.showAddress.first_name) {
              this.checkDeliveryAddress = "Name in delivery address is missing.";
              this.disableCheckOut = true;
              this.valueCheck = 1;
            } else if (!this.showAddress.address_line1 || !this.showAddress.postal_code || !this.showAddress.state_code || !this.showAddress.country_code) {
              this.checkDeliveryAddress = "Address in delivery address is missing.";
              this.disableCheckOut = true;
              this.valueCheck = 1;
            } else if (!this.showAddress.email) {
              this.checkDeliveryAddress = "Email in delivery address is missing.";
              this.disableCheckOut = true;
              this.valueCheck = 1;
            } else if (!this.showAddress.phone_number) {
              this.disableCheckOut = true;
              this.checkDeliveryAddress = "Phone number in delivery address is missing.";
              this.valueCheck = 1;
            } else {
              this.stateCodeToName = environment.countryCodeToStates[this.showAddress.country_code];
              this.setDisplayAddressLine();
              this.setStateCountryLine();
              this.valueCheck = 0;
              this.disableCheckOut = false;
            }
          }
        }
      );
  }

  getInformation() {
    if (this.showAddress != undefined) {
      this.customer = new CustomerInformation();
      this.customer.first_name =   this.customerInformation.value.first_name;
      this.customer.email = this.customerInformation.value.email_address,
      this.customer.phone_dial_code =  this.dialcode.selectedDial,
      this.customer.phone_number =  this.customerInformation.value.phone_number,
      this.showCustomerName = this.customer.first_name;
      this.showCustomerEmail = this.customer.email;
      this.showCustomerNumber = '(+' + this.customer.phone_dial_code + ') ' + this.customer.phone_number;

      return this.customerInformationService.updateDeliveryAddress(this.customer, this.cartCustomerInformation.toString())
        .subscribe();

    }
  }

  onUpdateCustomerInformation() {
    this.isShowInfo = true;
    if (this.customerInformation.invalid)
    {
      return;
    }

    this.customer = new CustomerInformation();
    this.customer.first_name =   this.customerInformation.value.first_name;
    this.customer.email = this.customerInformation.value.email_address,
    this.customer.phone_dial_code =  this.dialcode.selectedDial,
    this.customer.phone_number =  this.customerInformation.value.phone_number,
    this.edit_customer_information_active = false;
    return this.customerInformationService.updateDeliveryAddress(this.customer, this.cartCustomerInformation.toString())
      .subscribe(
        response => {

          this.isShowInfo = false;

          this.showCustomerName = this.customerInformation.value.last_name + ' ' + this.customerInformation.value.first_name;
          this.showCustomerEmail = this.customerInformation.value.email_address;
          this.showCustomerNumber = '(+' + this.customer.phone_dial_code + ') ' + this.customerInformation.value.phone_number;

          this.showCustomerEmail = response.data.email;
          this.showCustomerPhoneNumber = response.data.phone_number;
          this.showCustomerDiaCodePhoneNumber = response.data.phone_dial_code;
        }
      );
  }

  onKey(event) {
    this.notesForShipping = event.target.value;
  }

  checkSelfCollect(event) {
    if (event.value == 1) {
      this.checkDeliveryAddress = "";
      this.valueCheck = 0;
      this.self_collect_free_active = true;
      this.isShowFormShippingSpecial = false;
      this.disableCheckOut = false;
      this.shipping2 = 0;
      this.Total = this.initValue + Number(this.shipping2);
      this.checkCopyFrom = false;

      this.specificDateTimeForm.disable();
      this.isCheckShowRadio1 = false;
      this.isCheckShowRadio2 = false;
      this.isCheckShowRadio3 = false;
    }
  }

  checkDeliveryByCounrier(event) {
    // this.isCheckSpecial = false;
    if (event.value == 2) {
      this.self_collect_free_active = false;
      this.shipping1 = Math.max.apply(Math, this.arrShipping);
      this.Total = this.initValue + Number(this.shipping1);
      if(this.is_has_account && !CheckNullOrUndefinedOrEmpty(this.customerContactList))
      {
        this.renderDeliveryAddress();
      }

      if (this.nation_code == 'SG') {
        if (this.cartShop.isCheckSpecialAfter || this.cartShop.isCheckSpecialBefore || this.cartShop.isCheckSpecialOnly) {
          this.isShowFormShippingSpecial = true;
        } else {
          this.isShowFormShippingSpecial = false;
        }

        if (this.cartShop.isCheckSpecialOnly) {
          this.checkTimeDisableDate(1);
          this.isCheckButton1 = true;
          this.isCheckShowRadio1 = true;
          this.specificDateTimeForm.get('specificDate1').enable();
          this.isCheckButton2 = false;
          this.isCheckShowRadio2 = false;
          this.isCheckButton3 = false;
          this.isCheckShowRadio3 = false;
        
        } else if (this.cartShop.isCheckSpecialBefore){
          this.checkTimeDisableDate(2);
          this.isCheckButton2 = true;
          this.isCheckShowRadio2 = true;
          this.specificDateTimeForm.get('specificDate2').enable();
          this.isCheckButton1 = false;
          this.isCheckShowRadio1 = false;
          this.isCheckButton3 = false;
          this.isCheckShowRadio3 = false;
        
        } else if (this.cartShop.isCheckSpecialAfter) {
          this.checkTimeDisableDate(3);
          this.isCheckButton3 = true;
          this.isCheckShowRadio3 = true;
          this.specificDateTimeForm.get('specificDate3').enable();
          this.isCheckButton2 = false;
          this.isCheckShowRadio2 = false;
          this.isCheckButton1 = false;
          this.isCheckShowRadio1 = false;
        }
      }
    }
  }

  renderDeliveryAddress()
  {
    return this.cart.updateDeliveryAddressByAdvisor(this.customerContactList.id, this.delivery_address_id, this. cart_id)
          .subscribe(
            response => {
              if (response.code == 200) {
                this.updateDeliveryAddresshandele(response.data)
                this.isShowAddress = false;
                
                this.showDeliveryAddressDiaCodePhoneNumber = response.data.phone_dial_code;
                this.delivery_address_id = response.data.id;
                this.showAddress = response.data;
                this.showAddressEmail = this.showAddress.email;
                this.showAddressPhoneNumber = '(+' + this.showAddress.phone_dial_code + ') ' + this.showAddress.phone_number;
                if (!this.showAddress.first_name) {
                  this.checkDeliveryAddress = "Name in delivery address is missing.";
                  this.disableCheckOut = true;
                  this.valueCheck = 1;
                } else if (!this.showAddress.address_line1 || !this.showAddress.postal_code || !this.showAddress.state_code || !this.showAddress.country_code) {
                  this.checkDeliveryAddress = "Address in delivery address is missing.";
                  this.disableCheckOut = true;
                  this.valueCheck = 1;
                } else if (!this.showAddress.email) {
                  this.checkDeliveryAddress = "Email in delivery address is missing.";
                  this.disableCheckOut = true;
                  this.valueCheck = 1;
                } else if (!this.showAddress.phone_number) {
                  this.disableCheckOut = true;
                  this.checkDeliveryAddress = "Phone number in delivery address is missing.";
                  this.valueCheck = 1;
                } else {
                  this.stateCodeToName = environment.countryCodeToStates[this.showAddress.country_code];
                  this.setDisplayAddressLine();
                  this.setStateCountryLine();
                  this.valueCheck = 0;
                  this.disableCheckOut = false;
                }
              }
            }
          );
  }

  renderDeliveryAddressInit(id : number)
  {
    return this.cart.updateDeliveryAddressByAdvisor(id, this.delivery_address_id, this. cart_id)
          .subscribe(
            response => {
              if (response.code == 200) {
                this.updateDeliveryAddresshandele(response.data)
                this.isShowAddress = false;
                
                this.showDeliveryAddressDiaCodePhoneNumber = response.data.phone_dial_code;
                this.delivery_address_id = response.data.id;
                this.showAddress = response.data;
                this.showAddressEmail = this.showAddress.email;
                this.showAddressPhoneNumber = '(+' + this.showAddress.phone_dial_code + ') ' + this.showAddress.phone_number;
                if (!this.showAddress.first_name) {
                  this.checkDeliveryAddress = "Name in delivery address is missing.";
                  this.disableCheckOut = true;
                  this.valueCheck = 1;
                } else if (!this.showAddress.address_line1 || !this.showAddress.postal_code || !this.showAddress.state_code || !this.showAddress.country_code) {
                  this.checkDeliveryAddress = "Address in delivery address is missing.";
                  this.disableCheckOut = true;
                  this.valueCheck = 1;
                } else if (!this.showAddress.email) {
                  this.checkDeliveryAddress = "Email in delivery address is missing.";
                  this.disableCheckOut = true;
                  this.valueCheck = 1;
                } else if (!this.showAddress.phone_number) {
                  this.disableCheckOut = true;
                  this.checkDeliveryAddress = "Phone number in delivery address is missing.";
                  this.valueCheck = 1;
                } else {
                  this.stateCodeToName = environment.countryCodeToStates[this.showAddress.country_code];
                  this.setDisplayAddressLine();
                  this.setStateCountryLine();
                  this.valueCheck = 0;
                  this.disableCheckOut = false;
                }
              }
            }
          );
  }

  updateDeliveryAddresshandele(data)
  {
    this.deliveryAddress.get('firstName').setValue(data.first_name);
    this.deliveryAddress.get('lastName').setValue(data.last_name);
    this.deliveryAddress.get('emailAddress').setValue(data.email);
    this.deliveryAddress.get('phoneNumber').setValue(data.phone_number);
    this.deliveryAddress.get('addressLine1').setValue(data.address_line1);
    this.deliveryAddress.get('addressLine2').setValue(data.address_line2);
    this.deliveryAddress.get('addressLine3').setValue(data.address_line3);
    this.deliveryAddress.get('postalCode').setValue(data.postal_code);
    this.deliveryAddress.get('stateCode').setValue(data.state_code);
    this.deliveryAddress.get('countryCode').setValue(data.country_code);
    this.showDeliveryAddressDiaCodePhoneNumber = data.phone_dial_code;
  }

  onChange(event) {
    if (event.value == 2) {
      this.messageMissDay = "";
      this.checkDay = 0;
      this.shipping2 = this.shipping1;
      this.checkCopyFrom = true;
      if (!this.showAddress.first_name) {
        // this.checkDeliveryAddress = "Name in delivery address is missing.";
        this.checkDeliveryAddress = this.translateService.instant("CHECK_OUT.CHECK_DELIVERY_NAME");
        this.disableCheckOut = true;
        this.valueCheck = 1;
      } else if (!this.showAddress.address_line1 || !this.showAddress.postal_code || !this.showAddress.state_code || !this.showAddress.country_code) {
        // this.checkDeliveryAddress = "Address in delivery address is missing.";
        this.checkDeliveryAddress = this.translateService.instant("CHECK_OUT.CHECK_DELIVERY_ADDRESS");
        this.disableCheckOut = true;
        this.valueCheck = 1;
      } else if (!this.showAddress.email) {
        // this.checkDeliveryAddress = "Email in delivery address is missing.";
        this.checkDeliveryAddress = this.translateService.instant("CHECK_OUT.CHECK_DELIVERY_EMAIL");
        this.disableCheckOut = true;
        this.valueCheck = 1;
      } else if (!this.showAddress.phone_number) {
        this.disableCheckOut = true;
        // this.checkDeliveryAddress = "Phone number in delivery address is missing.";
        this.checkDeliveryAddress = this.translateService.instant("CHECK_OUT.CHECK_DELIVERY_PHONE");
        this.valueCheck = 1;
      }
      this.getShippingFee();
    } else {
      this.shippingFee = 0;
    }
  }

  copyFromDeliveryAddress() {
    this.onUpdateCustomerInformation();
    this.showCustomerName = this.showAddress.last_name + ' ' + this.showAddress.first_name;
    this.showCustomerEmail = this.showAddressEmail;
    this.showCustomerNumber = this.showAddressPhoneNumber;
  }

  goOrderSummary() {
    this.is_summit_check_out = true;

    if (this.is_has_account && CheckNullOrUndefinedOrEmpty(this.customerContactList) && this.specificDateTimeForm.invalid){
      return;
    }

    this.isCheckShowRequired = true;
    if (this.specificDateTimeForm.invalid) {
      return;
    }

    if (this.isCheckShowRadio2) {
      let formCreate = new CreateQuickOrder();
      formCreate.orderId = '';
      formCreate.shipping_id = this.cartShop.shipping.id;
      formCreate.customerName = this.cartShop.customer_information.first_name;
      formCreate.customerPhone = this.showAddress.phone_dial_code + this.showAddress.phone_number;
      formCreate.customerZipCode =  this.showAddress.postal_code;
      formCreate.customerAddressLine1 = this.showAddress.address_line1;
      formCreate.customerAddressLine2 = this.showAddress.address_line2;
      formCreate.pickUpdate = formatDate(this.specificDateTimeForm.get('specificDate2').value, "yyyy-MM-dd", "en-US");
      formCreate.pickUpTime = this.selectTime;
   
      this.cartShop.cartItems.forEach(element => {
        let orderItemsQxpress = new OrderItemsQxpress();
  
        orderItemsQxpress.ITEM_NM = element.product_name;
        orderItemsQxpress.ITEM_ID = element.id;
        orderItemsQxpress.QTY = element.quantity;
        orderItemsQxpress.CURRENCY = element.currency_code;
        orderItemsQxpress.PURCHASE_AMT = element.listed_price;
        formCreate.orderItem.push(orderItemsQxpress);
      });
  
      this.shippingService.createQXpress(formCreate).subscribe( data => {
        if (data.code === 200) {
          this.nextOrderSummaryScreen();
        } else if (data.code === 201) {
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: data.data.ResultMsg,
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });
          
          dialogNotifi.afterClosed().subscribe(data => {
            if (data) {
              dialogNotifi.close();
            }
          });
        }
      })
    
    } else {
      this.nextOrderSummaryScreen();
    }
  }

  nextOrderSummaryScreen() {
    let specialDelivery = new SpecialDelivery();

    if (this.isShowFormShippingSpecial) {
      specialDelivery.sd_type = this.isCheckShowRadio1 ? 'SD_ONLY' : (this.isCheckShowRadio2 ? 'SD_BEFORE' : 'SD_AFTER');
      specialDelivery.shipping_id = this.shipping_id;
      specialDelivery.sd_shipping_fee = this.isEntityMy ? this.shippingFee : this.valueShipCurrent;

      if (this.isCheckBtnLater) {
        specialDelivery.select_date = undefined;
        specialDelivery.select_time = undefined;
        specialDelivery.sd_fee = 0;

      } else {
        specialDelivery.select_date = !CheckNullOrUndefinedOrEmpty(this.specificDateTimeForm.get('specificDate1').value) 
        ? formatDate(this.specificDateTimeForm.get('specificDate1').value, "yyyy-MM-dd", "en-US") 
        : (!CheckNullOrUndefinedOrEmpty(this.specificDateTimeForm.get('specificDate2').value) 
        ? formatDate(this.specificDateTimeForm.get('specificDate2').value, "yyyy-MM-dd", "en-US") 
        : formatDate(this.specificDateTimeForm.get('specificDate3').value, "yyyy-MM-dd", "en-US"));
        specialDelivery.select_time = !CheckNullOrUndefinedOrEmpty(this.specificDateTimeForm.get('specificDate1').value) ? undefined : this.selectTime;
        specialDelivery.sd_fee = this.isCheckShowRadio1 ? 0 : this.valueShipSD;
      }

    } else {
      specialDelivery = null;
    }

    let data = {
      cart_id : this.cart_id,
      is_buy_for_customer : this.is_buy_for_customer,
      is_have_account : this.is_has_account,
      customer_id : this.is_has_account ? CheckNullOrUndefinedOrEmpty(this.customerContactList.id) ? null : this.customerContactList.id : null,
      special_delivery: specialDelivery
    }
    this.cart.updateCartAdvisorBuyForCustomer(data).subscribe(response=>{
      if(response.code !== 200)
      {
        // console.log(response)
      }
    })

    if(this.shipping_location_selected == null)
    {
      this.isShowErrorShippingLocation = true;
      return ;
    }
    let deliveryMethod;
    if (this.self_collect_free_active) {
      deliveryMethod = 'SELF_COLLECT';
    } else {
      deliveryMethod = 'BY_COURRIER';
    }
    this.shipping = new Shipping(
      deliveryMethod,
      null,
      null,
      null,
      this.notesForShipping,
      this.shipping_location_selected.id
    );
    return this.shippingService.updateDeliveryAddress(this.shipping, this.shipping_id.toString()).subscribe(
      response => {
        if (response.code == 200) {
          if (this.isEntityMy) {
            localStorage.setItem('shipping', this.shippingFee);
          } else {
            localStorage.setItem('shipping', this.shipping2)
          }

          this.router.navigate(['/order-summary']);
        }
      },
      err => { console.log(err); }
    );
  }

  setFormState(event): void {
    const selectedCountryCode = event.value;
    this.stateCodeToNameFormOptions = environment.countryCodeToStates[selectedCountryCode];
  }

  keepOriginalOrder = (a, b) => a.key;

  private setDisplayAddressLine() {
    const address1 = !this.isEmptyOrNullOrUndefined(this.showAddress.address_line1) ? this.showAddress.address_line1 + ', ' : '';
    const address2 = !this.isEmptyOrNullOrUndefined(this.showAddress.address_line2) ? this.showAddress.address_line2 + ', ' : '';
    const address3 = !this.isEmptyOrNullOrUndefined(this.showAddress.address_line3) ? this.showAddress.address_line3 + ', ' : '';
    const postal = !this.isEmptyOrNullOrUndefined(this.showAddress.postal_code) ? this.showAddress.postal_code : '';

    this.displayAddress = address1 + address2 + address3 + postal;
  }

  private setStateCountryLine() {
    const state = !this.isEmptyOrNullOrUndefined(this.showAddress.state_code) ? this.stateCodeToName[this.showAddress.state_code] + ', ' : '';
    const country = !this.isEmptyOrNullOrUndefined(this.showAddress.country_code) ? this.countryCodeToName[this.showAddress.country_code] : '';

    this.displayStateCountry = state + country;
  }

  private isEmptyOrNullOrUndefined(str: string) {
    return (str === "" || str === null || str === "null" || str === undefined || str === "undefined");
  }

  checkiIsHaveInternalDiscount(product)
  {
    if(isNullOrUndefined(this.decoded))
    {
      //Not Login
      return null;
    }else{
      if(product.is_naep_discount && product.is_deposit && !isNullOrUndefined(product.naep_discount_price)) {
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

  // Advisor buy for customer
  checkCheckBoxvalue(event){
    this.is_buy_for_customer = event.checked;
    if(this.is_buy_for_customer == true)
    {
      this.edit_customer_information_active = true;
    }else{
      this.edit_customer_information_active = false;
    }
  }

  checkCustomerHasAccount(event){
    this.is_has_account = event.checked;
    if(this.is_has_account == true)
    {
      this.edit_customer_information_active = false;
      this.is_show_customer_info = false;
      this.is_choose_add_new = false;
      this.is_choose_contact_list = false;
    }else{
      this.edit_customer_information_active = true;
      this.is_show_customer_info = true;
      this.renderDeliveryAddressInit(this.customer_init_id);
    }
  }

  showAddNewCustomer(){
    this.is_show_add_new_customer = true;
  }

  async getValue(changedValue){
    this.customerContactList = changedValue.value;
    this.is_choose_customer = true;
    this.is_choose_contact_list = true;
    await this.UpdateCustomerInformation(this.customerContactList);
    if(!this.self_collect_free_active)
    {
      await this.renderDeliveryAddress()
    }
  }

  editChoose()
  {
    this.is_choose_customer = false;
    this.is_choose_contact_list = false;
    this.is_choose_add_new = false;
    this.is_show_add_new_customer = false;
  }

  getNewCustomer()
  {
    if(this.is_valid_email_add_new === false)
    {
      return;
    }else{
      
      this.cart.getNewContactInfor(this.email_add_new).subscribe(data=>{
        if(data.code === 200)
        {
          this.is_choose_add_new = true;
          this.is_choose_customer  = true;
          this.is_choose_contact_list = false;
          this.is_show_add_new_customer = false;
          let customerNew = data.data;
          customerNew["first_name"] = customerNew.firt_name;
          delete customerNew["firt_name"]
          this.customerContactList = customerNew;
          this.is_show_invalid_add_new = false;
          this.UpdateCustomerInformation(this.customerContactList);
          if(!this.self_collect_free_active)
          {
           this.renderDeliveryAddress()
          }
        }else{
          this.is_show_add_new_customer = true;
          this.customerContactList = null;
          this.is_show_invalid_add_new = true;
        }
      })
    }
    
  }

  checkValidEmail()
  {
    this.is_valid_email_add_new =pattern.email.test(this.email_add_new)
  }

  UpdateCustomerInformation(data) {
  
    this.customer = new CustomerInformation();
    this.customer.first_name =   this.customerInformation.value.first_name;
    this.customer.email = this.customerInformation.value.email_address,
    this.customer.phone_dial_code =  this.dialcode.selectedDial,
    this.customer.phone_number =  this.customerInformation.value.phone_number,
    this.edit_customer_information_active = false;
    return this.customerInformationService.updateDeliveryAddress(this.customer, this.cartCustomerInformation.toString())
      .subscribe(
        response => {
          // console.log(response)
        }
      );
  }

  async inviteToCreateAccount() {


     await this.myProfileService.getProfile().subscribe((response) => {
      this.language_code = 'en'
      if (response.code === 200) {
        this.advisor_uuid = response.userProfileData.uuid;
        this.language_code = response.userProfileData.language_code;
      }else{
        this.advisor_uuid = '';
      }

      const port = this.document.location.port
      ? `:${this.document.location.port}`
      : "";
      const registerURL = `${this.document.location.protocol}//${this.document.location.hostname}${port}/register?contact_uuid=${this.advisor_uuid}&language=${this.language_code}`;

    const isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return (
          navigator.userAgent.match(/IEMobile/i) ||
          navigator.userAgent.match(/WPDesktop/i)
        );
      },
      any: function () {
        return (
          isMobile.Android() ||
          isMobile.BlackBerry() ||
          isMobile.iOS() ||
          isMobile.Opera() ||
          isMobile.Windows()
        );
      },
    };
    // const messageText = `I%20would%20like%20to%20invite%20you%20to%20join%20me%20at%20`;
    const messageText = `Welcome%20to%20Club%20Thermomix®.%20Sign%20up%20to%20discover%20more%20about%20Thermomix®%20at%20`;

    if (isMobile.any()) {
      const shareUrl = `whatsapp://send?text=${messageText}${registerURL}`;
      location.href = shareUrl;
    } else {
      window.open(
        `https://web.whatsapp.com/send?l=en&text=${messageText}${encodeURIComponent(
          registerURL
        )}`,
        "_blank"
      );
    }
    });
    
  }

  // onChangeCheckBoxSpecial(event) {
  //   this.isShowFormShippingSpecial = event.checked;

  //   if (this.cartShop.isCheckSpecialOnly) {
  //     this.isCheckButton1 = true;
  //     this.isCheckShowRadio1 = true;
  //     this.specificDateTimeForm.get('specificDate1').enable();
  //     this.isCheckButton2 = false;
  //     this.isCheckShowRadio2 = false;
  //     this.isCheckButton3 = false;
  //     this.isCheckShowRadio3 = false;
    
  //   } else if (this.cartShop.isCheckSpecialBefore){
  //     this.isCheckButton2 = true;
  //     this.isCheckShowRadio2 = true;
  //     this.specificDateTimeForm.get('specificDate2').enable();
  //     this.isCheckButton1 = false;
  //     this.isCheckShowRadio1 = false;
  //     this.isCheckButton3 = false;
  //     this.isCheckShowRadio3 = false;
    
  //   } else if (this.cartShop.isCheckSpecialAfter) {
  //     this.isCheckButton3 = true;
  //     this.isCheckShowRadio3 = true;
  //     this.specificDateTimeForm.get('specificDate3').enable();
  //     this.isCheckButton2 = false;
  //     this.isCheckShowRadio2 = false;
  //     this.isCheckButton1 = false;
  //     this.isCheckShowRadio1 = false;
  //   }

  // }

  onChangeDateStandard() {
    this.isCheckShowRequired = false;
  }

  onChangeTime(event) {
    this.selectTime = !CheckNullOrUndefinedOrEmpty(event.value.DEL_TIME_SLOT) ? event.value.DEL_TIME_SLOT : event.value.time_slot;
  }

  onChangeRadio(event) {
    this.checkTimeDisableDate(event.value);

    this.isCheckShowRequired = false;
    this.specificDateTimeForm.setValue({
      specificDate1: '',
      specificDate2: '',
      specificTime2: '',
      specificDate3: '',
      specificTime3: ''
    })

    if (event.value == 1) {
      this.isCheckShowRadio1 = true;
      this.isCheckShowRadio2 = false;
      this.isCheckShowRadio3 = false;
      this.isCheckBtnLater = false;
      this.specificDateTimeForm.get('specificDate1').enable();
      this.specificDateTimeForm.get('specificDate2').disable();
      this.specificDateTimeForm.get('specificTime2').disable();
      this.specificDateTimeForm.get('specificDate3').disable();
      this.specificDateTimeForm.get('specificTime3').disable();
      this.shipping2 = this.valueShipCurrent;
      this.Total = this.initValue + Number(this.shipping2);

    } else if (event.value == 2) {
      this.isCheckShowRadio2 = true;
      this.isCheckShowRadio1 = false;
      this.isCheckShowRadio3 = false;
      this.isCheckBtnLater = false;
      this.specificDateTimeForm.get('specificDate1').disable();
      this.specificDateTimeForm.get('specificDate2').enable();
      this.specificDateTimeForm.get('specificTime2').disable();
      this.specificDateTimeForm.get('specificDate3').disable();
      this.specificDateTimeForm.get('specificTime3').disable();

      this.shipping2 = this.valueShipSDPrice;
      this.Total = this.initValue + Number(this.shipping2);

    } else if (event.value == 3) {
      this.isCheckShowRadio3 = true;
      this.isCheckShowRadio2 = false;
      this.isCheckShowRadio1 = false;
      this.isCheckBtnLater = false;
      this.specificDateTimeForm.get('specificDate1').disable();
      this.specificDateTimeForm.get('specificDate2').disable();
      this.specificDateTimeForm.get('specificTime2').disable();
      this.specificDateTimeForm.get('specificDate3').enable();
      this.specificDateTimeForm.get('specificTime3').disable();

      this.shipping2 = this.valueShipSDPrice;
      this.Total = this.initValue + Number(this.shipping2);
    } 
  }

  //change date after
  onChangeDateAfter() {
    let selectDateAfter = formatDate(this.specificDateTimeForm.get('specificDate3').value, "yyyy-MM-dd", "en-US");
    this.shippingService.getSpTimeAfterByDate(selectDateAfter).subscribe(data => {
      this.timeOptionDateAfter = data;
    });

    this.specificDateTimeForm.get('specificTime3').enable();
  }

  //change date before
  onChangeDateBefore() {
    let selectDateBefore = formatDate(this.specificDateTimeForm.get('specificDate2').value, "yyyy-MM-dd", "en-US");
    this.shippingService.getQuickTimeSlotQXpress(selectDateBefore).subscribe(data => {
      this.timeOptionDateBefore = data;
    });

    this.specificDateTimeForm.get('specificTime2').enable();
  }

  selectDateLater() {
    if (this.isCheckBtnLater) {
      this.isCheckBtnLater = false;
      this.specificDateTimeForm.get('specificDate1').enable();
    } else {
      this.isCheckBtnLater = true;
      this.specificDateTimeForm.get('specificDate1').setValue('');
      this.specificDateTimeForm.get('specificDate1').disable();
    }
  }

  checkTimeDisableDate(valueRadio) {
    let getTimeNow = new Date().getHours();
    let getDayNow = new Date().getDay();
    this.minDateShip = new Date();

    if (valueRadio == 1) {
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
    
    } else if (valueRadio == 2) {
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

    } else if (valueRadio == 3) {
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

  getShippingFee() {
    const stateCode = this.deliveryAddress.get('stateCode').value;
    if (!stateCode) return;
    const state = this.stateCodeToNameFormOptions[stateCode];
    const totalWeight = this.totalWeight;
    let totalPrice = 0;
    if (this.isCheckNaep) {
      totalPrice = this.naepSubTotal;
    } else {
      totalPrice = this.subTotal;
    }
    let body = {
      state,
      totalWeight,
      totalPrice
    }
    console.log(body);
    this.cart.shippingCostByWeight(body).subscribe(res => {
      if (res && res.code === 200) {
        this.shippingFee = res.data.shippingFee || 0;
      } else {
        this.shippingFee =  0;
      }
      this.Total = this.initValue + this.shippingFee;
    })
  }
}

function phoneNumberValidator(checkOutForm: FormControl) {
  if (isNaN(checkOutForm.value) === false && !checkOutForm.value.includes(' ')) {
    return null;
  }
  return { phone_number: true };
}

function moveArrayItemToNewIndex(arr, old_index, new_index) {
  if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; 
};

