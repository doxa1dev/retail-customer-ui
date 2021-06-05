import { Event } from './../../core/enum/event';
import { AuthService } from 'app/core/service/auth.service';
import { customer } from './../../core/models/list_recruit.model';
import { CheckNullOrUndefinedOrEmpty, RenderInformation } from 'app/core/utils/common-function';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Title } from 'app/core/enum/title';
import {
  trigger, state, style, animate, transition, useAnimation, AnimationEvent,
} from '@angular/animations';
import {
  bounceIn, bounceOut, bounceInUp, bounceInDown, fadeIn, fadeInUp,
  slideInDown, slideInUp, flipInX, shake,
} from 'ngx-animate';
import { CartService } from 'app/core/service/cart.service';

import { Observable } from 'rxjs';
import { CartItem } from 'app/core/models/cart.model';
import * as moment from "moment";
import * as jwt_decode from 'jwt-decode';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SharedService } from 'app/core/service/commom/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { DialogConfirmComponent } from '../common-component/dialog-confirm/dialog-confirm.component';
import { DeliveryAddress } from 'app/core/models/delivery-address.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { DeliveryAddressService } from 'app/core/service/delivery-address.service';
import { DialCodeComponent } from '../account/authentication/dial-code/dial-code.component';
import { ShippingService } from 'app/core/service/shipping.service';
import { CreateQuickOrder, OrderItemsQxpress, Shipping, SpecialDelivery } from 'app/core/models/shipping.model';
import { CustomerInformation } from 'app/core/models/customer-infomation.model';
import { CustomerInformationService } from 'app/core/service/customer-information.service';
import { formatDate } from '@angular/common';
import { MyContactsService } from 'app/core/service/my-contact.service';
import { isNullOrUndefined } from "util";
import { RecruitmentService } from 'app/core/service/recruitment.service';
import { OrderService } from 'app/core/service/order.service';
import { pattern} from 'app/core/enum/pattern'
import { MatExpansionPanel } from '@angular/material/expansion';
import { MyProfileService } from 'app/core/service/my-profile.service';
import { MyProfile } from 'app/core/models/my-profile.model';
import { OrderPaymentOption } from 'app/core/enum/order-payment-option.enum';
import { PaymentService } from 'app/core/service/payment.service';



@Component({
  selector: 'app-check-out-improve',
  templateUrl: './check-out-improve.component.html',
  styleUrls: ['./check-out-improve.component.scss'],
  animations: [
    trigger('bounce', [
      transition(':enter', useAnimation(bounceIn)),
      transition('void => *', useAnimation(bounceOut)),
    ]),
    trigger('error', [
      transition('* => *', useAnimation(shake)),
    ]),
  ],
})
export class CheckOutImproveComponent implements OnInit {
  constructor(
    private cart: CartService,
    private translateService: TranslateService,
    private router: Router,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private deliveryAddressService: DeliveryAddressService,
    private _formBuilder: FormBuilder,
    private shippingService: ShippingService,
    private customerInformationService: CustomerInformationService,
    private contactService: MyContactsService,
    private customerService: CustomerInformationService,
    private recruitmentService : RecruitmentService,
    private order: OrderService,
    private auth : AuthService,
    private myProfileService: MyProfileService,
    private changeDetectorRef: ChangeDetectorRef,
    private payment: PaymentService,
  ) {}

  @ViewChild(DialCodeComponent) dialcode: DialCodeComponent;
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;
  // @ViewChildren('delivery') dialcodeDL : QueryList<DialCodeComponent>;
  @ViewChildren('dialCodeABFC') dialCodeABFC : QueryList<DialCodeComponent>;
  @ViewChild('anomynousDial') anomynousDial: DialCodeComponent;
  @ViewChild('dialBuyForCustomerHasAccount') dialBuyForCustomerHasAccount: DialCodeComponent;
  @ViewChild('dialBuyForCustomerAnomynous') dialBuyForCustomerAnomynous: DialCodeComponent;
  @ViewChild('delivery') dialcodeDL : DialCodeComponent;
  @ViewChild('DeliveryAddress') deliveryTarget : HTMLElement;




  // @ViewChildren('delivery') dialcode1 :QueryList<DialCodeComponent>;

  
  @Input() subTotal = 0;
  @Input() shipping = 0;
  @Input() sumTotal = 0;
  @Input() Total = 0;
  @Input() currency: any;
  


  panelOpenState: boolean = false;
  _allExpandState = false;
  private set allExpandState (value: boolean) {
    this._allExpandState = value;
    this.togglePanels(value);
  }

  private get allExpandState (): boolean {
    return this._allExpandState;
  }
  private togglePanels(value: boolean) {
    this.viewPanels.forEach(p => value ? p.open() : p.close());
  }

  registerForm: FormGroup;
  deliveryAddress: FormGroup;
  myInformation : FormGroup;
  buyForCustomerInformation : FormGroup;
  title = Title.LEFT_LINK;

  

  arrShipping = new Array();
  storeUrl = environment.storageUrl;
  panelOpenStateCart = true;
  panelOpenStateCartDelivery = false;
  panelOpenStateCartMyOrder = false;
  panelOpenStateCartAdvisor = false;
  carArr = new Array();

  totalWeight: number;
  shippingFee: any;
  isEntityMy = environment.entity === "MY";
  cartShop: any;

  disable = false;
  total_product: number = 0;
  btnCheckOut = "CHECK OUT";
  cartDeliveryAddress: number;
  cartCustomerInformation_id: number;
  shippingID: number;
  cart_advisor_id: number;
  cart_advisor_name: number;

  cartId;
  maxOrder: number;
  decoded
  roleArray : string[] = [];
  token: string;
  isShowAdvisorInfo: boolean = true;
  
  loading: boolean = true;
  naepArray: any


  // translation
  lstEnTranslation: any[] = [];
  lstZhTranslation: any[] = [];
  lstMyTranslation: any[] = [];

  //naep
  naepShipping: number = 0;
  naepSubTotal: number = 0;
  naepTotal: number = 0;
  isCheckNaep: boolean = false;
  productFee: any;
  productKit: any;
  is_redemption_cart: boolean = false;
  disableButton: boolean = false;
  disableDecreaseButton : boolean = false;

  
  //check out
  messageMissDay = " ";
  checkDeliveryAddress = " ";
  checkDate = " ";
  checkDay = 0;

  // shipping2: any;
  checkCopyFrom: boolean = false;
  showAddress: DeliveryAddress;
  disableCheckOut = false;
  valueCheck = 0;
  isDefaultSelfCollect: boolean = false;
  isCheckSelectDeliveryOption: boolean = false;
  self_collect_free_active = true;
  isShowFormShippingSpecial: boolean = false;
  initValue: number;
  specificDateTimeForm: FormGroup;
  isCheckShowRadio1: boolean = false;
  isCheckShowRadio2: boolean = false;
  isCheckShowRadio3: boolean = false;
  nation_code =  environment.entity === "MY" ? "MY" : "SG";
  state_code_default = this.nation_code == 'SG' ? 'SG' : '';
  checkOffice = environment.checkOffice;
  shipping_location_selected  : Location;
  isShowErrorShippingLocation : boolean =  false;
  shippingInformation : any;
  publicHolidayArr = [];
  valueRadio: number;
  selectTime: string;
  anomynous_id : number;

  timeOption = [];

  timeOptionDateAfter = [];
  minDateShip = new Date();
  // isCheckBtnLater: boolean = false;
  isCheckShowRequired: boolean = false;

  timeOptionDateBefore = [];

  
  // priceShipCurrent: number = 0;
  valueShipCurrent: number = 0;
  valueShipSDPrice: number = 0;
  valueShipSD: number;
  specialDeliveryData: SpecialDelivery;
  isCheckButton1: boolean = false;
  isCheckButton2: boolean = false;
  isCheckButton3: boolean = false;
  isCheckButton4: boolean = false;
  isCheckShowSpecial: boolean = false;
  arrSDShipping = new Array();

  // order
  showDeliveryAddressDiaCodePhoneNumber: string = environment.dialcode;
  deliveryDialCode : string = environment.dialcode;
  defaultDialCode : string = environment.dialcode;
  myInformationDialCode : string = environment.dialcode;
  anomynousDialCode : string = environment.dialcode;
  dialCodeBuyForCustomerHasAccount : string = environment.dialcode;
  dialCodeBuyForCustomerAnomynous : string = environment.dialcode;
  deliveryDialCode_value : string;
  delivery_address_id: number;
  isShowAddress: boolean = false;
  showAddressEmail: string;
  showAddressPhoneNumber: string;
  stateCodeToName = null;
  stateCodeToNameFormOptions = null;
  displayAddress: string;
  city_state_code;
  displayStateCountry: string;
  countryCodeToName = environment.countryCodeToName;
  mail_phone_active = true;
  address: DeliveryAddress;
  shipping_location: Location[];
  is_disaled_city : boolean = false;
  is_buy_for_myself : boolean = true;
  is_advisor : boolean = false;
  customer_information;
  currently_customer_information;
  delivery_address;
  is_show_customer_information_form : boolean = true;
  is_show_error_customer_information_form : boolean = false;
  is_show_error_customer_information_form_by_advisor : boolean = false;
  init_customer_information ;

  display_my_information : DisplayInformation;
  is_show_delivery_address_form : boolean = true;
  is_show_error_delivery_address_form : boolean = false;
  display_delivery_address : DisplayInformation;
  customer_id : number;
  is_buy_for_customer_has_account : boolean = true;
  list_customer_from_contact_list : CustomerInformation[] = []
  is_choose_customer : boolean = false;
  is_choose_contact_list : boolean = false;
  customer_contact_list : CustomerInformation;
  entity = environment.entity;
  orderId: any;
  orderUuid: any;
  is_buy_for_customer : boolean = false;
  order_tmm;
  buy_for_customer_id : number;
  is_anomynous_customer : boolean = false;
  is_valid_advisor_buy_for_customer : boolean = false;
  is_valid_buy_by_anomynous : boolean = false;
  is_naep_cart : boolean = false;
  // advisor
  is_need_advisor: boolean = false;
  is_not_has_advisor: boolean = false;

  //Search Advisor
  advisorName: string='';
  advisorImg: string = "assets/icons/doxa-icons/UserMenu.svg";
  advisor_name: string='';
  phoneNumberFull: string='';
  isSearchAvisor: boolean = false;
  storageUrl = environment.storageUrl;
  
  
  // delivery
  minDateShipping: Date = new Date();
  maxDateShip = new Date();
  getYear = (new Date()).getFullYear();
  shippingModel: Shipping;
  customerContactList: ContactList;


  //valid
  is_valid_delivery : boolean = false;
  is_valid_order : boolean = false;
  is_valid_acvisor : boolean = false;
  is_active_pay : boolean = false;

  isDisplayConfirmtext: boolean = false;
  submitted = false;
  isDisplayError: boolean = false;
  isShowBtnSubmit : boolean = false;

  //button loading
  buttonName = 'PAY';
  active: boolean = false;
  pannelErrorIndex : number;
  is_need_assign_advisor_for_order : boolean;
  is_show_choose_contact : boolean = true;
  is_valid_email_add_new : boolean = false;
  email_add_new : string = '';
  is_show_invalid_add_new : boolean = false;


  ngOnInit(): void {

    this.totalWeight = 0;
    this.shippingFee = 0;

    this.getListCart(true);

    this.token =  localStorage.getItem('token');
    if(!CheckNullOrUndefinedOrEmpty(this.token))
    {
      this.decoded = jwt_decode(this.token);
      this.roleArray = this.decoded.role;
      
      this.is_advisor  = this.roleArray.includes('ADVISOR') ? true: false;


      this.myProfileService.getProfile().subscribe((response) => {
        if (response.code === 200) {
          const myProfile: MyProfile = response.userProfileData;
          this.is_anomynous_customer = myProfile.is_anomynous_account
        }
        
      });
    }

    this.maxDateShip.setDate(this.maxDateShip.getDate() + 7);
    this.minDateShip.setDate(this.minDateShip.getDate() + 3);


    this.deliveryAddress = this._formBuilder.group({
      firstName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.pattern(pattern.email)]],
      phoneNumber: ['', [Validators.required, phoneNumberValidator]],
      addressLine1: ['', [Validators.required, Validators.maxLength(40)]],
      addressLine2: ['', [Validators.required,Validators.maxLength(40)]],
      addressLine3: ['', Validators.maxLength(40)],
      postalCode: ['', Validators.required],
      stateCode: [this.state_code_default, Validators.required],
      countryCode: ['', Validators.required],
    });

    this.myInformation = this._formBuilder.group({
      firstName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.pattern(pattern.email)]],
      phoneNumber: ['', [Validators.required, phoneNumberValidator]],
      addressLine1: ['', [Validators.required, Validators.maxLength(40)]],
      addressLine2: ['', [Validators.required, Validators.maxLength(40)]],
      addressLine3: ['', [Validators.required, Validators.maxLength(40)]],
      postalCode: ['', Validators.required],
      stateCode: ['', Validators.required],
      countryCode: ['', Validators.required],
    });

    this.buyForCustomerInformation = this._formBuilder.group({
      firstName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.pattern(pattern.email)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(pattern.phone_number)]],
      addressLine1: ['', [ Validators.required,Validators.maxLength(40)]],
      addressLine2: ['', [Validators.required,Validators.maxLength(40)]],
      addressLine3: ['', [Validators.required,Validators.maxLength(40)]],
      postalCode: ['',Validators.required],
      stateCode: ['',Validators.required],
      countryCode: ['', Validators.required],
    });

    this.stateCodeToNameFormOptions = environment.countryCodeToStates[this.nation_code];
    this.city_state_code = environment.entity === "MY" ? null: Object.keys(this.stateCodeToNameFormOptions)[0];
    // this.city_state_code = environment.entity === "MY" ? null: Object.keys(this.stateCodeToNameFormOptions)[0];

    this.specificDateTimeForm = this._formBuilder.group({
      specificDate1: [''],

      specificDate2: ['', Validators.required],
      specificTime2: ['', Validators.required],

      specificDate3: ['', Validators.required],
      specificTime3: ['', Validators.required]
    })


    this.contactService.getContactListForAdvisorBuyOrder('').subscribe(data=>{
      this.list_customer_from_contact_list = data;
    });

    this.registerForm = this._formBuilder.group({
      advisor_name: ['', Validators.required],
      advisor_id: ['', Validators.required],
      remark_phone: ['', ],
    });  

    this.shippingService.getPublicHoliday(this.nation_code, this.getYear).subscribe(data => {
      data.forEach((element, index) => {
        this.publicHolidayArr.push(new Date(element));

        if (index === data.length - 1) {
          // this.publicHolidayArr.push(new Date('2021-05-21'));

          this.checkTimeDisableDate(1);
        }
      });
    });

    this.specificDateTimeForm.disable();
  }


  // INIT DATA

  getListCart(is_update_customer_from_profile : boolean): Promise<any> {
    this.subTotal = 0;
    this.sumTotal = 0;
    this.Total = 0;
    this.total_product = 0;
    this.carArr = [];
    return new Promise((resolve) => {
      this.cart.getCartByCustomerId().subscribe((respone) => {
        this.loading= false;
        if (!CheckNullOrUndefinedOrEmpty(respone)) {
          let cartInfo = respone;
          this.cartId = cartInfo.id;
          this.customer_id = cartInfo.customer_id;
          // this.cartShop = respone;
          this.cartDeliveryAddress = cartInfo.cart_delivery_address.id;
          this.cartCustomerInformation_id = cartInfo.customer_information.id;
          this.customer_information = cartInfo.customer_information;
          this.currently_customer_information = cartInfo.customer_information;
          this.init_customer_information = cartInfo.customer_information;
          this.delivery_address =cartInfo.cart_delivery_address;
          this.shippingID = cartInfo.shipping.id;
          this.cart_advisor_id = cartInfo.cart_advisor_customer_id;
          this.is_need_advisor = cartInfo.is_need_advisor;
          this.display_my_information = this.renderDisplayInformation(this.customer_information);
          // this.display_delivery_address = this.renderDisplayInformation(cartInfo.cart_delivery_address);
          this.showAddress = cartInfo.cart_delivery_address;
          this.showAddressEmail = this.showAddress.email;
          this.showAddressPhoneNumber = '(+' + this.showAddress.phone_dial_code + ') ' + this.showAddress.phone_number;
          this.cart_advisor_name = cartInfo.cart_advisor_customer_name;
          this.customerContactList = cartInfo.is_has_account ? cartInfo.customer_buy : null;
          
          if (this.cart_advisor_id == null && this.cart_advisor_name == null) {
            this.isShowAdvisorInfo = false;
          }
          if (cartInfo.cart_advisor_customer_id == undefined) {
            this.is_not_has_advisor = true;
            this.cart_advisor_id = null;
          }
          this.cartShop = cartInfo;
          //form special Delivery
          if (!CheckNullOrUndefinedOrEmpty(this.cartShop.shipping.SpecialDelivery)) {
            this.self_collect_free_active = false;
            // this.isCheckSpecial = true;
            // this.isDefaultSelfCollect = false;
            this.isShowFormShippingSpecial = true;
            let shipData = this.cartShop.shipping.SpecialDelivery;

            if (shipData.sd_type == "SD_ONLY") {
              this.isCheckShowRadio1 = true;
              this.isCheckButton1 = true;
              this.shipping = this.valueShipCurrent;
              this.Total = this.initValue + Number(this.shipping);
              this.checkTimeDisableDate(1);

              if (!CheckNullOrUndefinedOrEmpty(shipData.select_date)) {
                this.specificDateTimeForm.get('specificDate1').setValue(new Date(shipData.select_date));
                this.specificDateTimeForm.get('specificDate1').enable();
              
              } else {
                // this.isCheckBtnLater = true;
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
              this.shipping = this.valueShipSDPrice;
              this.Total = this.initValue + Number(this.shipping);

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
              this.shipping = this.valueShipSDPrice;
              this.Total = this.initValue + Number(this.shipping);
           
            } else if (shipData.sd_type == "SD_ONLY_LATER") {
              this.isCheckButton4 = true;
              this.shipping = this.valueShipCurrent;
              this.Total = this.initValue + Number(this.shipping);
            }

          }
          this.is_redemption_cart = respone.is_redemption_cart;
          this.delivery_address_id = cartInfo.cart_delivery_address.id;
   
          cartInfo.cartItems.forEach((element) => {
            let cartitem = new CartItem();
            if (!element.is_fee)
              this.totalWeight += element.product_weight * element.quantity;
            cartitem.id = element.id;
            cartitem.product_name = element.product_name;
            cartitem.quantity = element.quantity;
            this.total_product += element.quantity;
            cartitem.properties =[] as any;
            cartitem.currency_code = element.currency_code;
            if(!CheckNullOrUndefinedOrEmpty(element.properties)){
              Object.keys(element.properties).forEach(function (key)
              {
                cartitem.properties.push({ name: key, value: element.properties[key]})
              });
            }
            cartitem.listed_price = element.listed_price;
            cartitem.promotional_price = element.promotional_price;
            cartitem.has_advisor = element.has_advisor;
            cartitem.has_special_payment = element.has_special_payment;
            cartitem.shipping_fee = element.shipping_fee;
            cartitem.cover_photo_key = element.cover_photo_key;
            cartitem.max_order_number = element.max_order_number;
            cartitem.internal_discount_for = element.internal_discount_for;
            cartitem.internal_discount_price = element.internal_discount_price;
            cartitem.internal_discount_start_time = element.internal_discount_start_time;
            cartitem.total = element.total;
            cartitem.max_total_discount = element.max_total_discount;
            cartitem.is_naep_discount = element.is_naep_discount;
            cartitem.naep_discount_price = element.naep_discount_price;
            cartitem.is_deposit = element.is_deposit;
            cartitem.is_fee = element.is_fee;
            cartitem.is_kit = element.is_kit;
            cartitem.naep_advisor_kit = element.naep_advisor_kit;
            cartitem.product_weight = element.product_weight;
            cartitem.host_gift_id = element.host_gift_id;
            this.is_naep_cart = this.is_naep_cart || element.is_naep_discount;
            this.stateCodeToName = environment.countryCodeToStates[this.showAddress.country_code];

            this.setDisplayAddressLine();
            this.setStateCountryLine();

            if (element.is_redemption_price) {
              this.disableDecreaseButton = true;
              this.disableButton = true;
            }
            cartitem.redemption_price = element.redemption_price;

            if (cartitem.is_naep_discount) {
              this.isCheckNaep = true;

              if (element.is_fee || element.is_deposit) {
                this.naepSubTotal = this.naepSubTotal + (element.quantity * Number(this.rederPriceProduct(cartitem)));
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

            this.arrShipping.push(Number(element.shipping_fee));
            this.carArr.push(cartitem);
            if (cartInfo.is_redemption_cart) {
              this.subTotal = this.subTotal + element.quantity * Number(cartitem.redemption_price)
              this.sumTotal = this.sumTotal + element.quantity *  Number(cartitem.redemption_price)
              this.Total = this.sumTotal;

            } else {
              this.subTotal = this.subTotal + element.quantity * Number(this.rederPriceProduct(cartitem))
              this.sumTotal = this.sumTotal + element.quantity *  Number(this.rederPriceProduct(cartitem))
              this.Total = this.sumTotal;
            }

            // get list translation of cartItem
            element.translations.forEach(translation => {
              if (translation.language_code === 'en') {
                let obj = {};
                obj["CartItemID"] = cartitem.id;
                obj["Title"] = translation.translated_title;
                this.lstEnTranslation.push(obj);
              } else if (translation.language_code === 'en') {
                let obj = {};
                obj["CartItemID"] = cartitem.id;
                obj["Title"] = translation.translated_title;
                this.lstZhTranslation.push(obj);
              } else if (translation.language_code === 'my') {
                let obj = {};
                obj["CartItemID"] = cartitem.id;
                obj["Title"] = translation.translated_title;
                this.lstMyTranslation.push(obj);
              }
            })
          });

          // set translation language
          this.translateService.getTranslation('en').subscribe(() => {
            let objEnTranslation = {
              "CART": {}
            }
            objEnTranslation["CART"][this.cartId] = {};
            objEnTranslation["CART"][this.cartId]["CART_ITEM"] = {};
            this.lstEnTranslation.forEach(translate => {
              objEnTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]] = {};
              objEnTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]]["PRODUCT_TITLE"] = translate["Title"];
            });
            // set english langugae
            this.translateService.setTranslation('en', objEnTranslation, true);

            /** --------------- */
            this.translateService.getTranslation('en').subscribe(() => {
              let objZhTranslation = {
                "CART": {}
              }
              objZhTranslation["CART"][this.cartId] = {};
              objZhTranslation["CART"][this.cartId]["CART_ITEM"] = {};
              this.lstZhTranslation.forEach(translate => {
                objZhTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]] = {};
                objZhTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]]["PRODUCT_TITLE"] = translate["Title"];
              });
              // set chinese langugae
              this.translateService.setTranslation('en', objZhTranslation, true);

              /** --------------- */
              this.translateService.getTranslation('my').subscribe(() => {
                let objMyTranslation = {
                  "CART": {}
                }
                objMyTranslation["CART"][this.cartId] = {};
                objMyTranslation["CART"][this.cartId]["CART_ITEM"] = {};
                this.lstMyTranslation.forEach(translate => {
                  objMyTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]] = {};
                  objMyTranslation["CART"][this.cartId]["CART_ITEM"][translate["CartItemID"]]["PRODUCT_TITLE"] = translate["Title"];
                });
                // set malay langugae
                this.translateService.setTranslation('my', objMyTranslation, true);
              })
            })
          })
          
          this.naepArray= this.carArr.filter((element)=>{
            return element.is_naep_discount === true;
          })

          this.productFee = this.naepArray.filter(product => product.is_fee === true)
          this.productKit = this.naepArray.filter(product => product.is_kit === true)

          // if (this.arrShipping.indexOf(0) != -1) {
          //   this.shipping = 0;
          // } else {
          //   this.shipping = Math.max.apply(Math, this.arrShipping);
          // }

          this.initValue = this.Total;
          // this.Total = !this.isEntityMy ? (this.Total + Number(this.shipping)) : (this.Total + this.shippingFee);
          this.currency = this.carArr[0].currency_code;

          if(is_update_customer_from_profile)
          {
            if(!CheckNullOrUndefinedOrEmpty(this.decoded))
            {
              this.myProfileService.getProfile().subscribe(response => {
          
                if (response.code === 200) {
                  const myProfile: MyProfile = response.userProfileData;
                  let myInformation = new CustomerInformation();
                  myInformation.first_name = myProfile.firt_name;
                  myInformation.email =  myProfile.email;
                  myInformation.phone_dial_code =  myProfile.phone_dial_code;
                  myInformation.phone_number = myProfile.phone_number;
                  myInformation.address_line1 = myProfile.address_line1;
                  myInformation.address_line2 = myProfile.address_line2;
                  myInformation.address_line3 = myProfile.address_line3;
                  myInformation.postal_code = myProfile.postal_code;
                  myInformation.state_code  = myProfile.state_code ;
                  myInformation.state_code  = this.nation_code == "SG" ? "SG" : myProfile.state_code ;
                  myInformation.country_code = this.nation_code; 
                  myInformation.is_update_profile = false;
                  if(!CheckNullOrUndefinedOrEmpty(this.customer_information))
                  {
                    return this.customerInformationService.updateCustmerInformation(myInformation, this.customer_information.id.toString()).subscribe(data=>{
                      if(data.code === 200)
                      {
                        this.rederCustomerInformation(data.data);
                        this.currently_customer_information = data.data;
                      }
                  }); 
                  }
                  
                }
              });
            }
          }
        }
      });
    });
  }

  rederCustomerInformation(data)
  {

    this.is_show_customer_information_form = true;
    this.myInformation.get('firstName').setValue(data.first_name);
    this.myInformation.get('emailAddress').setValue(data.email);
    this.myInformation.get('phoneNumber').setValue(data.phone_number);
    this.myInformation.get('addressLine1').setValue(data.address_line1);
    this.myInformation.get('addressLine2').setValue(data.address_line2);
    this.myInformation.get('addressLine3').setValue(data.address_line3);
    this.myInformation.get('postalCode').setValue(data.postal_code);
    this.myInformation.get('stateCode').setValue(data.state_code);
    this.myInformation.get('countryCode').setValue(data.country_code);
    this.myInformationDialCode = data.phone_dial_code;
  }


  rederDeliveryAddress()
  {
    this.is_show_delivery_address_form = true;
    this.deliveryAddress.get('firstName').setValue(this.delivery_address.first_name);
    this.deliveryAddress.get('emailAddress').setValue(this.delivery_address.email);
    this.deliveryAddress.get('phoneNumber').setValue(this.delivery_address.phone_number);
    this.deliveryAddress.get('addressLine1').setValue(this.delivery_address.address_line1);
    this.deliveryAddress.get('addressLine2').setValue(this.delivery_address.address_line2);
    this.deliveryAddress.get('addressLine3').setValue(this.delivery_address.address_line3);
    this.deliveryAddress.get('postalCode').setValue(this.delivery_address.postal_code);
    this.deliveryAddress.get('stateCode').setValue(this.delivery_address.state_code);
    this.deliveryAddress.get('countryCode').setValue(this.delivery_address.country_code);
    this.showDeliveryAddressDiaCodePhoneNumber = this.delivery_address.phone_dial_code;
  }

  renderDisplayInformation(data)
  {
    let dataReturn : DisplayInformation = {
      name : data.first_name,
      address : RenderInformation(data),
      email : data.email,
      phone_number : `(+${data.phone_dial_code}) ` + data.phone_number
    };
    return  dataReturn;
  }

  setFormState(event): void {
    const selectedCountryCode = event.value;
    this.stateCodeToNameFormOptions = environment.countryCodeToStates[selectedCountryCode];
  }

  getTranslation(cartId: string, cartItemId: string) {
    let key = 'CART.' + cartId + '.CART_ITEM.' + cartItemId + '.PRODUCT_TITLE';
    return this.translateService.getStreamOnTranslationChange(key);
  }

  


  // SHOPPING - BAG


  removeProductCart(id) {
    this.cart.removeCartItemById(id).subscribe((respone) => {
      if (respone.code == 200) {
        let carArrRemove = this.carArr.filter(function (e) {
          return e.id === id;
        });
        if (carArrRemove.length > 0) {
          let quantity = carArrRemove[0].quantity;
          this.sharedService.sharedMessage.subscribe(
            (message) => (this.total_product = message)
          );
          this.sharedService.nextCart(this.total_product - quantity);
        }
        this.carArr = this.carArr.filter(function (e) {
          return e.id !== id;
        });
        if (this.carArr.length == 0) {
          this.cart.deleteCartByCartId(this.cartId).subscribe();
        }
        this.updateShipping();
        this.subTotalCalculate();
        this.sumToTalPrice();
      }else if(respone.code == 203){
        const dialogRef = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
            "Shopping bag has products with different payment options if you remove this product.",
            title:
            "CONFIRM",
            colorButton: true
          },
        });
      }
    });
  }


  updateCartItemByQuantity(id, quantity){
    this.cart.updateCartItemByQuantity(id, quantity).subscribe((data) => {
      
      if (data.code === 200) {
        data.quantity = quantity;
        
      } 
      else if (data.code === 201 && data.message == "Product exceeds max order number.") {
        const dialogRef = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message: this.translateService.instant('SHOPPING_BAG.CANNOT_ORDER') + 
                      this.maxOrder + 
                      this.translateService.instant('SHOPPING_BAG.FOR_THIS_PRODUCT'),
            title: this.translateService.instant('SHOPPING_BAG.CONFIRM'),
            colorButton: true
          },
        });
        
      }
    });
  }

  
  increaseItem(cartPrice, id, quantity) {   
    this.disableButton = true;
    this.carArr.forEach((product) => {
      if(this.checkiIsHaveInternalDiscount(product) !== 2)
      {
        if (product.id == id) {
          this.cart.updateCartItemByQuantity(id, quantity).subscribe(data=>{
            if(data.code === 200)
            {
              product.quantity++
              quantity = product.quantity;
              product.total = product.total + 1;
              this.sharedService.sharedMessage.subscribe(
                (message) => (this.total_product = message)
              );
              this.sharedService.nextCart(this.total_product + 1);
              this.totalWeight += product.product_weight;
              this.subTotal = this.subTotal + Number(cartPrice);
              this.initValue = this.subTotal;

              if (!this.isEntityMy) {
                this.Total = this.subTotal + Number(this.shipping);
              } else {
                this.getShippingFee();
              }
              this.disableButton = false;
            }else{
                const dialogRef = this.dialog.open(CommonDialogComponent, {
                  width: "500px",
                  data: {
                    message:
                    "Cannot order more than " + product.max_order_number + " for this product.",
                    title:
                    "CONFIRM",
                    colorButton: true
                  },
                });
                this.disableButton = false;
            }
          })
        }
      } else {
        if (product.id == id) {
          if(product.total === product.max_total_discount)
          {
            const dialogRef = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: this.translateService.instant('SHOPPING_BAG.REACHED_THE_LIMIT'),
                title: this.translateService.instant('SHOPPING_BAG.CONFIRM'),
                colorButton: false
              },
            });
            this.disableButton = false;
          }else{
            this.cart.updateCartItemByQuantity(id, quantity).subscribe(data=>{
              if(data.code === 200)
              {
                product.quantity++
                quantity = product.quantity;
                product.total = product.total + 1;
                this.sharedService.sharedMessage.subscribe(
                  (message) => (this.total_product = message)
                );
                this.totalWeight += product.product_weight;
                this.sharedService.nextCart(this.total_product + 1);
                this.subTotal = this.subTotal + Number(cartPrice);
                this.initValue = this.subTotal;
                if (!this.isEntityMy) {
                  this.Total = this.subTotal + Number(this.shipping);
                } else {
                  this.getShippingFee();
                }
                this.disableButton = false;
              }else{
                  const dialogRef = this.dialog.open(CommonDialogComponent, {
                    width: "500px",
                    data: {
                      message:
                      "Cannot order more than " + product.max_order_number + " for this product.",
                      title:
                      "CONFIRM",
                      colorButton: true
                    },
                  });
                  this.disableButton = false;
              }
            })
          }
          
        }
      }
    });

  }

  
  decreaseItem(cartPrice, id, quantity) {
    this.disableDecreaseButton = true;
    this.carArr.forEach((product) => {
      if (product.id == id) {
        if (product.quantity <= 1) {
          this.disableDecreaseButton = false;
          return;
        } else {
          this.cart.updateCartItemByQuantityDescrease(product.id, quantity).subscribe(data=>{
            if(data.code === 200){
              product.quantity--;
              quantity = product.quantity;
              product.total = product.total - 1;
              this.totalWeight -= product.product_weight;
              this.subTotal = this.subTotal - Number(cartPrice);
              this.initValue = this.subTotal;

              if (!this.isEntityMy) {
                this.Total = this.subTotal + Number(this.shipping);
              } else {
                this.getShippingFee();
              }
              this.sharedService.sharedMessage.subscribe(
                (message) => (this.total_product = message)
              );
              this.sharedService.nextCart(this.total_product - 1);
              this.disableDecreaseButton = false;
            }else{
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: data.data,
                  title:
                  "CONFIRM",
                  colorButton: true
                },
              });
              this.disableDecreaseButton = false;
            }
          })
        }
      }
    });
  }

  updateShipping() {
    this.totalWeight = 0;
    this.arrShipping = new Array();
    this.carArr.forEach((cartItem) => {
      this.arrShipping.push(Number(cartItem.shipping_fee));
      this.totalWeight += cartItem.product_weight;
    });
    if (this.arrShipping.indexOf(0) != -1) {
      this.shipping = 0;
      this.shippingFee = 0;
    } else {
      this.shipping = Math.max.apply(Math, this.arrShipping);
      if (this.isEntityMy) {
        this.getShippingFee();
      }
    }
  }

  
  removeProductCartNAEP()
  {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: { message: this.translateService.instant('SHOPPING_BAG.REMOVE_NAEP_PACKAGE'), type : "REJECTED" }
      
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result === true){
        return this.cart.deleteNaep(this.cartId).subscribe(data=>{
          if(data.code === 200){ 
            this.naepArray.forEach(element=>{
              this.carArr = this.carArr.filter(product=>{
                return product.id != element.id
              })
            })
            
            let cart_number = this.total_product - this.naepArray.length;
            this.sharedService.nextCart(cart_number);
            if(cart_number === 0)
            {
              this.cart.deleteCartByCartId(this.cartId).subscribe();
            }
            this.naepArray = new Array();
            this.updateShipping();
            this.subTotalCalculate();
            this.sumToTalPrice();
          }else{
            return;
          }
        })
      }else{
        dialogRef.close();
      }
    })
  }

  subTotalCalculate() {
    this.subTotal = 0;
    this.carArr.forEach((cartItem) => {
      if (cartItem.id != null) {
        this.subTotal =
          this.subTotal +
        cartItem.quantity * Number(this.rederPriceProduct(cartItem))
      }
    });
    if (this.isEntityMy) {
      this.getShippingFee();
    }
  }

  sumToTalPrice() {
    this.Total = !this.isEntityMy ? (this.subTotal + this.shipping) : (this.subTotal + this.shippingFee);
  }

  rederPriceProduct(cartitem : CartItem){
    return this.checkiIsHaveInternalDiscount(cartitem) === 1 ? cartitem.naep_discount_price : 
    this.checkiIsHaveInternalDiscount(cartitem) === 2 ? cartitem.internal_discount_price :
    CheckNullOrUndefinedOrEmpty(cartitem.promotional_price) ? Number(cartitem.listed_price) : Number(cartitem.promotional_price)
  }

  checkiIsHaveInternalDiscount(product)
  {

    if(CheckNullOrUndefinedOrEmpty(this.decoded))
    {
      //Not Login
      return null;
    }else{
      if(product.is_naep_discount && product.is_deposit && !CheckNullOrUndefinedOrEmpty(product.naep_discount_price)){
        //Customer NAEP
        return 1
      }else if(CheckNullOrUndefinedOrEmpty(product.internal_discount_for))
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
    if (CheckNullOrUndefinedOrEmpty(price) || parseFloat(price) === 0)
    {
      return false
    }
    return true;
  }



  // DELIVERY 

  checkSelfCollect(event) {
    if (event.value == 1) {
      this.checkDeliveryAddress = "";
      this.valueCheck = 0;
      this.self_collect_free_active = true;
      this.isShowFormShippingSpecial = false;
      this.disableCheckOut = false;
      this.shipping = 0;
      this.Total = this.initValue + Number(this.shipping);
      this.checkCopyFrom = false;
      this.specificDateTimeForm.disable();
      // this.isCheckBtnLater = false;
      this.isCheckShowRadio1 = false;
      this.isCheckShowRadio2 = false;
      this.isCheckShowRadio3 = false;
      this.isCheckButton4 = false;

      let getYearNow = (new Date()).getFullYear();
      this.shippingService.getPublicHoliday(this.nation_code, getYearNow).subscribe(data => {
        this.publicHolidayArr = [];

        data.forEach((element, index) => {
          this.publicHolidayArr.push(new Date(element));

          if (index === data.length - 1) {
            // this.publicHolidayArr.push(new Date('2021-06-03'));
  
            this.checkTimeDisableDate(event.value);
          }
        });
      });
    }
  }

  checkDeliveryByCounrier(event) {
    if (event.value == 2) {
      this.self_collect_free_active = false;

      if (this.arrShipping.indexOf(0) != -1) {
        this.shipping = 0;
      } else {
        this.shipping = Math.max.apply(Math, this.arrShipping);
      }
      // this.shipping = Math.max.apply(Math, this.arrShipping);
      if (!this.isEntityMy) {
        this.Total = this.initValue + Number(this.shipping);
      } else {
        this.getShippingFee();
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

          this.shipping = this.valueShipSDPrice;
          this.Total = this.initValue + Number(this.shipping);
        
        } else if (this.cartShop.isCheckSpecialAfter) {
          this.checkTimeDisableDate(3);
          this.isCheckButton3 = true;
          this.isCheckShowRadio3 = true;
          this.specificDateTimeForm.get('specificDate3').enable();
          this.isCheckButton2 = false;
          this.isCheckShowRadio2 = false;
          this.isCheckButton1 = false;
          this.isCheckShowRadio1 = false;

          this.shipping = this.valueShipSDPrice;
          this.Total = this.initValue + Number(this.shipping);
        }
      }
    }
  }

  // selectDateLater() {
  //   if (this.isCheckBtnLater) {
  //     this.isCheckBtnLater = false;
  //     this.specificDateTimeForm.get('specificDate1').enable();
  //   } else {
  //     this.isCheckBtnLater = true;
  //     this.specificDateTimeForm.get('specificDate1').setValue('');
  //     this.specificDateTimeForm.get('specificDate1').disable();
  //   }
  // }

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
    
    } else if (valueRadio == 2) {
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
            this.minDateShip.setDate(this.minDateShip.getDate() + 6);
          }
          break;
        case 3:
          if (getTimeNow < 16) {
            this.minDateShip.setDate(this.minDateShip.getDate() + 5);
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
            this.minDateShip.setDate(this.minDateShip.getDate() + 6);
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

    // console.log('1', formatDate(this.minDateShip, "yyyy-MM-dd", "en-US"));
    this.checkPublicHoliday(valueRadio, getTimeNow);
  }

  checkPublicHoliday(valueRadio, timeNow) {
    let dateNow = new Date(formatDate(new Date(), "yyyy-MM-dd", "en-US")).getTime();
    let dateMin = new Date(this.minDateShip).getTime();

    this.publicHolidayArr.forEach(date => {
      let datePH = new Date(date).getTime();
      //Check public holiday between date now and date min ship
      if ( datePH >= dateNow && datePH <= dateMin) {
        //Check Sunday, Saturday
        if (new Date(date).getDay() != 0 && new Date(date).getDay() != 6) {
          // Check Friday
          if (new Date(date).getDay() == 5) {

            if (formatDate(date, "yyyy-MM-dd", "en-US") == formatDate(dateNow, "yyyy-MM-dd", "en-US")) {
              //Check before 4pm and after 4pm
              if (timeNow < 16) {
                this.minDateShip.setDate(this.minDateShip.getDate() + 1);
                //check method delivery
                this.move1MoreDayShip(valueRadio);
              }
  
            } else {
              if (valueRadio != 2) {
                this.minDateShip.setDate(this.minDateShip.getDate() + 2);
              }              
            }
          } 
          //Check public holiday = current
          else if (formatDate(date, "yyyy-MM-dd", "en-US") == formatDate(dateNow, "yyyy-MM-dd", "en-US")) {
            //Check before 4pm and after 4pm
            if (timeNow < 16) {
              this.minDateShip.setDate(this.minDateShip.getDate() + 1);
              //check method delivery
              this.move1MoreDayShip(valueRadio);
            }

          } else {
            //public holiday = lock date
            this.minDateShip.setDate(this.minDateShip.getDate() + 1);

            //check method delivery
            this.move1MoreDayShip(valueRadio);
          }
        }
      }
    })

    // console.log(formatDate(this.minDateShip, "yyyy-MM-dd", "en-US"))
  }

  move1MoreDayShip(valueRadio) {
    let getDay = new Date(this.minDateShip).getDay();

    if (valueRadio == 2) {
      if (getDay == 6) {
        this.minDateShip.setDate(this.minDateShip.getDate() + 2);
      } else if (getDay == 0) {
        this.minDateShip.setDate(this.minDateShip.getDate() + 1);
      }

    } else if (valueRadio == 1) {
      if (getDay == 0) {
        this.minDateShip.setDate(this.minDateShip.getDate() + 2);
      } else if (getDay == 1) {
        this.minDateShip.setDate(this.minDateShip.getDate() + 1);
      }

    } else if (valueRadio == 3) {
      if (getDay == 0) {
        this.minDateShip.setDate(this.minDateShip.getDate() + 1);
      }
    }
  }

  // checkPublicHoliday(valueRadio, timeNow) {
  //   let dateNow = new Date(formatDate(new Date(), "yyyy-MM-dd", "en-US")).getTime();
  //   let dateMin = new Date(this.minDateShip).getTime();
  //   let listDatePH = [];

  //   this.publicHolidayArr.forEach(date => {
  //     let datePH = new Date(date).getTime();
  //     //Check public holiday between date now and date min ship
  //     if ( datePH >= dateNow && datePH <= dateMin) {
  //       //Check 0: Sunday, 6: Saturday
  //       if (new Date(date).getDay() != 0 && new Date(date).getDay() != 6) {
  //         // Check 1: Friday
  //         if (new Date(date).getDay() == 5) {
  //           listDatePH.push(date);
  //         } 
  //         //Check public holiday = current
  //         else if (formatDate(date, "yyyy-MM-dd", "en-US") == formatDate(dateNow, "yyyy-MM-dd", "en-US")) {
  //           //Check before 4pm and after 4pm
  //           if (timeNow < 16) {
  //             listDatePH.push(date);
  //           }

  //         } else {
  //           //public holiday = lock date
  //           listDatePH.push(date);
  //         }
  //       }
  //     }
  //   })
  //   console.log(listDatePH)
  //   this.minDateShip.setDate(this.minDateShip.getDate() + listDatePH.length + 1);
  //   console.log('jihihi', this.minDateShip.getDay())

  // }

  onYearChange(event) {

    if (Number(event.year) != this.getYear) {
      this.getYear = event.year;

      this.shippingService.getPublicHoliday(this.nation_code, event.year).subscribe(data => {
        this.publicHolidayArr = [];
        data.forEach(element => {
          this.publicHolidayArr.push(new Date(element));
        });
      });
    }
  }
  
  onChangeRadio(event) {
    let getYearNow = (new Date()).getFullYear();

    this.shippingService.getPublicHoliday(this.nation_code, getYearNow).subscribe(data => {
      this.publicHolidayArr = [];
      data.forEach((element, index) => {
        this.publicHolidayArr.push(new Date(element));
        
        if (index === data.length - 1) {
          // this.publicHolidayArr.push(new Date('2021-06-03'));

          this.checkTimeDisableDate(event.value);
        }
      });
    });



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
      this.isCheckButton4 = false;
      // this.isCheckBtnLater = false;
      this.specificDateTimeForm.get('specificDate1').enable();
      this.specificDateTimeForm.get('specificDate2').disable();
      this.specificDateTimeForm.get('specificTime2').disable();
      this.specificDateTimeForm.get('specificDate3').disable();
      this.specificDateTimeForm.get('specificTime3').disable();
      this.shipping = this.valueShipCurrent;
      this.Total = this.initValue + Number(this.shipping);

    } else if (event.value == 2) {
      this.isCheckShowRadio2 = true;
      this.isCheckShowRadio1 = false;
      this.isCheckShowRadio3 = false;
      this.isCheckButton4 = false;
      // this.isCheckBtnLater = false;
      this.specificDateTimeForm.get('specificDate1').disable();
      this.specificDateTimeForm.get('specificDate2').enable();
      this.specificDateTimeForm.get('specificTime2').disable();
      this.specificDateTimeForm.get('specificDate3').disable();
      this.specificDateTimeForm.get('specificTime3').disable();

      this.shipping = this.valueShipSDPrice;
      this.Total = this.initValue + Number(this.shipping);

    } else if (event.value == 3) {
      this.isCheckShowRadio3 = true;
      this.isCheckShowRadio2 = false;
      this.isCheckShowRadio1 = false;
      this.isCheckButton4 = false;
      // this.isCheckBtnLater = false;
      this.specificDateTimeForm.get('specificDate1').disable();
      this.specificDateTimeForm.get('specificDate2').disable();
      this.specificDateTimeForm.get('specificTime2').disable();
      this.specificDateTimeForm.get('specificDate3').enable();
      this.specificDateTimeForm.get('specificTime3').disable();

      this.shipping = this.valueShipSDPrice;
      this.Total = this.initValue + Number(this.shipping);

    } else if (event.value == 4) {
      this.isCheckShowRadio1 = false;
      this.isCheckShowRadio2 = false;
      this.isCheckShowRadio3 = false;
      this.isCheckButton4 = true;

      this.shipping = this.valueShipCurrent;
      this.Total = this.initValue + Number(this.shipping);
      this.specificDateTimeForm.disable();
    }
  }

  
  onChangeDateStandard() {
    this.isCheckShowRequired = false;
  }

  onChangeDateBefore() {
    let selectDateBefore = formatDate(this.specificDateTimeForm.get('specificDate2').value, "yyyy-MM-dd", "en-US");
    this.shippingService.getQuickTimeSlotQXpress(selectDateBefore).subscribe(data => {
      this.timeOptionDateBefore = data;
    });

    this.specificDateTimeForm.get('specificTime2').enable();
  }

  onChangeDateAfter() {
    let selectDateAfter = formatDate(this.specificDateTimeForm.get('specificDate3').value, "yyyy-MM-dd", "en-US");
    this.shippingService.getSpTimeAfterByDate(selectDateAfter).subscribe(data => {
      this.timeOptionDateAfter = data;
    });

    this.specificDateTimeForm.get('specificTime3').enable();
  }

  onChangeTime(event) {
    this.selectTime = !CheckNullOrUndefinedOrEmpty(event.value.DEL_TIME_SLOT) ? event.value.DEL_TIME_SLOT : event.value.time_slot;
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

    this.cart.shippingCostByWeight(body).subscribe(res => {
      if (res && res.code === 200) {
        this.shippingFee = res.data.shippingFee || 0;
      } else {
        this.shippingFee =  0;
      }

      if (this.isCheckNaep) {
        this.naepTotal = this.naepSubTotal + this.shippingFee;
      } else {
        this.Total = this.subTotal + this.shippingFee;
      }
    })
  }

  onChangeShippingMethod(event) {
    this.isDefaultSelfCollect = true;
    this.isCheckSelectDeliveryOption = false;

    if (event.value == 2) {
      this.messageMissDay = "";
      this.checkDay = 0;
      // this.shipping2 = this.shipping1;
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
      if (this.isEntityMy) {
        this.getShippingFee();
      }

    } else {
      this.shippingFee = 0;
      if (this.isCheckNaep) {
        this.naepTotal = this.naepSubTotal + this.shippingFee;
      } else {
        this.Total = this.subTotal + this.shippingFee;
      }
    }
  }

  



  // MY ORDER
  is_show_same_email : boolean = false;

  checkValidEmail()
  {
    this.is_valid_email_add_new = pattern.email.test(this.email_add_new)
  }

  async geCustomerInforFromContact(changedValue){

    let data  = changedValue.value;
   
    this.is_show_choose_contact = false;
    this.is_show_customer_information_form = true;
    this.buyForCustomerInformation.get('firstName').setValue(data.first_name);
    this.buyForCustomerInformation.get('emailAddress').setValue(data.email);
    this.buyForCustomerInformation.get('phoneNumber').setValue(data.phone_number);
    this.buyForCustomerInformation.get('addressLine1').setValue(data.address_line1);
    this.buyForCustomerInformation.get('addressLine2').setValue(data.address_line2);
    this.buyForCustomerInformation.get('addressLine3').setValue(data.address_line3);
    this.buyForCustomerInformation.get('postalCode').setValue(data.postal_code);
    this.buyForCustomerInformation.get('stateCode').setValue( this.nation_code == 'SG' ? 'SG' : data.state_code);
    this.buyForCustomerInformation.get('countryCode').setValue(this.nation_code);
    this.is_choose_contact_list = false;
    this.dialCodeBuyForCustomerHasAccount = data.phone_dial_code;
    this.buy_for_customer_id = data.id;
    this.is_show_error_customer_information_form = false;
  }; 

  

  chooseFromContact()
  {
    this.is_show_choose_contact = true;
  }


  
  getCustomerFromInputEmail()
  {
    if(this.is_valid_email_add_new === false)
    {
      return;
    }else{
      
      this.cart.getNewContactInfor(this.email_add_new).subscribe(data=>{
        if(data.code === 200)
        {
          this.is_choose_contact_list = false;
          this.is_show_choose_contact = false;
          this.is_show_customer_information_form = true;

          let customerNew = data.data;
          this.is_show_invalid_add_new = false;
          this.is_show_same_email = false;
          this.buyForCustomerInformation.get('firstName').setValue(customerNew.firt_name);
          this.buyForCustomerInformation.get('emailAddress').setValue(customerNew.email);
          this.buyForCustomerInformation.get('phoneNumber').setValue(customerNew.phone_number);
          this.dialCodeBuyForCustomerHasAccount = customerNew.phone_dial_code;
          this.buy_for_customer_id = customerNew.id
          if(!CheckNullOrUndefinedOrEmpty(customerNew.address))
          {
            this.buyForCustomerInformation.get('addressLine1').setValue(customerNew.address.address_line1);
            this.buyForCustomerInformation.get('addressLine2').setValue(customerNew.address.address_line2);
            this.buyForCustomerInformation.get('addressLine3').setValue(customerNew.address.address_line3);
            this.buyForCustomerInformation.get('postalCode').setValue(customerNew.address.postal_code);
            this.buyForCustomerInformation.get('stateCode').setValue(customerNew.address.state_code);
            this.buyForCustomerInformation.get('countryCode').setValue(customerNew.address.country_code);
          }
          else{
            this.buyForCustomerInformation.get('stateCode').setValue( this.nation_code == 'SG' ? 'SG' : null);
            this.buyForCustomerInformation.get('countryCode').setValue(this.nation_code);
          }
        }else if(data.code === 203){
          // this.is_show_same_email = true;
          // this.is_show_invalid_add_new = false;
          const dialogRef = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: "You are not able to key in your own email, please try another.",
              title: "NOTICE",
              colorButton: false,
            },
          });
          dialogRef.afterClosed().subscribe(data=>{
            return;
          })

        }
        else if (data.code === 201){ 
          // this.is_show_invalid_add_new = true;
          // this.is_show_same_email = false;
          const dialogRef = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: "This person has not yet been a Club member, please try another.",
              title: "NOTICE",
              colorButton: false,
            },
          });
          dialogRef.afterClosed().subscribe(data=>{
            return;
          })
        }else if(data.code === 202)
        {
          const dialogRef = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: "This user has been an advisor, please try another.",
              title: "NOTICE",
              colorButton: false,
            },
          });
          dialogRef.afterClosed().subscribe(data=>{
            return;
          })
        }
      })
    }
    
  }

  

  checkChangeBuyForMySelf(event)
  {
    
    if (event.value == 2) {
      this.is_buy_for_myself = false;
      this.is_buy_for_customer_has_account = true;
      this.is_show_choose_contact = true;
    }else if(event.value == 1)
    {

      this.is_buy_for_myself = true;
      this.rederCustomerInformation(this.init_customer_information);
      this.onUpdateCustomerInformation()
      this.is_show_customer_information_form = true;

    }
  }

  renderDeliveryAddressInit(id : number)
  {
    return this.cart.updateDeliveryAddressByAdvisor(id, this.delivery_address_id, this.cartId)
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

  checkIsClubMember(event)
  {
    if(event.value == 1) //Advisor buy for customer have account
    {
      this.is_show_choose_contact = true;
      this.is_buy_for_customer_has_account = true;
      this.is_show_error_customer_information_form_by_advisor = false;
    }
    else // Advisor buy for customer don't have account
    {
      this.email_add_new = ''
      this.is_buy_for_customer_has_account = false;
      // this.buyForCustomerInformation.reset();
      this.buyForCustomerInformation.get('firstName').setValue('');
      this.buyForCustomerInformation.get('emailAddress').setValue('');
      this.buyForCustomerInformation.get('phoneNumber').setValue('');
      this.buyForCustomerInformation.get('addressLine1').setValue('');
      this.buyForCustomerInformation.get('addressLine2').setValue('');
      this.buyForCustomerInformation.get('addressLine3').setValue('');
      this.buyForCustomerInformation.get('postalCode').setValue('');
      this.buyForCustomerInformation.get('stateCode').setValue(this.nation_code == 'SG' ? 'SG' : '');
      this.buyForCustomerInformation.get('countryCode').setValue(this.nation_code);
      this.is_show_customer_information_form = true;
      this.is_show_error_customer_information_form_by_advisor = false;


    }
  }


  onUpdateCustomerInformation() {
    let is_update_profile = this.is_buy_for_myself;
    if (this.myInformation.invalid)
    {
      this.is_show_error_customer_information_form = true;
      return;
    }
      this.is_show_error_customer_information_form = false;
      let myInformation = new CustomerInformation();
      myInformation.first_name = this.myInformation.value.firstName;
      myInformation.email =  this.myInformation.value.emailAddress;
      // myInformation.phone_dial_code =  this.dialcode.selectedDial;
      myInformation.phone_dial_code =  this.myInformationDialCode;

      myInformation.phone_number = this.myInformation.value.phoneNumber;
      myInformation.address_line1 = this.myInformation.value.addressLine1;
      myInformation.address_line2 = this.myInformation.value.addressLine2;
      myInformation.address_line3 = this.myInformation.value.addressLine3;
      myInformation.postal_code = this.myInformation.value.postalCode;
      myInformation.state_code  = this.myInformation.value.stateCode;
      myInformation.country_code =  this.myInformation.value.countryCode;
      myInformation.is_update_profile = is_update_profile;
      myInformation.customer_id =  this.customer_id;
      
      return this.customerInformationService.updateCustmerInformation(myInformation, this.customer_information.id.toString())
        .subscribe(
          response => {
            if(response.code === 200)
            {
              this.is_show_customer_information_form = false;
              this.customer_information = response.data;
              this.display_my_information = this.renderDisplayInformation(response.data);
              this.currently_customer_information = response.data;
              this.init_customer_information = response.data;
            }
          }
      ); 
  }

  onUpdateForAnomynousCustomer()
  {
    if (this.buyForCustomerInformation.invalid)
    {
      this.is_show_error_customer_information_form_by_advisor = true;
      return;
    }else{

      this.anomynousDialCode = this.anomynousDial.SelectedDial;
      this.is_show_error_customer_information_form_by_advisor = false;
      let customerInformation = new CustomerInformation();
      customerInformation.first_name = this.buyForCustomerInformation.value.firstName;
      customerInformation.email =  this.buyForCustomerInformation.value.emailAddress;
      customerInformation.phone_dial_code =   this.anomynousDialCode;
      customerInformation.phone_number = this.buyForCustomerInformation.value.phoneNumber;
      customerInformation.address_line1 = this.buyForCustomerInformation.value.addressLine1;
      customerInformation.address_line2 = this.buyForCustomerInformation.value.addressLine2;
      customerInformation.address_line3 = this.buyForCustomerInformation.value.addressLine3;
      customerInformation.postal_code = this.buyForCustomerInformation.value.postalCode;
      customerInformation.state_code  = this.buyForCustomerInformation.value.stateCode;
      customerInformation.country_code =  this.buyForCustomerInformation.value.countryCode;
      customerInformation.customer_id =  this.customer_id;
      return this.customerInformationService.updateCustmerInformationForAnomynous(customerInformation, this.customer_information.id.toString())
        .subscribe(
          response => {
            if(response.code === 200)
            {
              this.is_show_customer_information_form = false;
              this.customer_information = response.data;
              this.display_my_information = this.renderDisplayInformation(response.data);
              this.currently_customer_information = response.data;
              this.is_valid_buy_by_anomynous = true;
            }
            if(response.code === 201)
            {
              const dialogRef = this.dialog.open(DialogConfirmComponent, {
                width: "500px",
                data: {
                  message: "This email or phone number already exists. Please log in or try another one.",
                  type : "COMMON",
                  btnYes : "LOG IN",
                  btnNo : "TRY ANOTHER",
                  titleDialog : "NOTICE",
                  classSuccess : true 
                },
              });

              dialogRef.afterClosed().subscribe(result =>
              {
                if (result === true)
                {
                  localStorage.removeItem('token')
                  this.router.navigate(['login'])
                } else
                {
                  dialogRef.close();
                }
              })
            }
          }
      ); 
    }
  }


  onUpdateCustomerInformationByAdvisorAnomynous(){
    let is_update_profile = this.is_buy_for_myself;
    if (this.buyForCustomerInformation.invalid)
    {
      this.is_show_error_customer_information_form_by_advisor = true;
      return;
    }
      this.is_show_error_customer_information_form_by_advisor = false;
      let customerInformation = new CustomerInformation();
      customerInformation.first_name = this.buyForCustomerInformation.value.firstName;
      customerInformation.email =  this.buyForCustomerInformation.value.emailAddress;
      customerInformation.phone_dial_code =  environment.dialcode;
      customerInformation.phone_number = this.buyForCustomerInformation.value.phoneNumber;
      customerInformation.address_line1 = this.buyForCustomerInformation.value.addressLine1;
      customerInformation.address_line2 = this.buyForCustomerInformation.value.addressLine2;
      customerInformation.address_line3 = this.buyForCustomerInformation.value.addressLine3;
      customerInformation.postal_code = this.buyForCustomerInformation.value.postalCode;
      customerInformation.state_code  = this.buyForCustomerInformation.value.stateCode;
      customerInformation.country_code =  this.buyForCustomerInformation.value.countryCode;
      customerInformation.is_update_profile = is_update_profile;
      customerInformation.customer_id =  this.customer_id;
      customerInformation.is_create_account = false;
      return this.customerInformationService.updateCustmerInformation(customerInformation, this.customer_information.id.toString())
        .subscribe(
          response => {
            if(response.code === 200)
            {
              this.is_valid_advisor_buy_for_customer = true;
              this.is_choose_contact_list = true;
              this.is_show_customer_information_form = false;
              this.customer_information = response.data;
              this.display_my_information = this.renderDisplayInformation(response.data);
              this.currently_customer_information = response.data;
              this.buy_for_customer_id = !CheckNullOrUndefinedOrEmpty(response.customer_id) ? response.customer_id : !this.is_buy_for_myself ? this.buy_for_customer_id : null
            }
            if(response.code === 205)
            {
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: "This email or phone number already exists. Please try another one.",
                  title: "CONFIRM",
                  colorButton: false,
                },
              });
              dialogRef.afterClosed().subscribe(data=>{
                this.pannelErrorIndex = 2;
                this.openPannelToShowError(this.pannelErrorIndex)
              })
            }
          }
      ); 
  }
  is_show_close = false;

  onUpdateCustomerInformationByAdvisor() {
    let is_update_profile = this.is_buy_for_myself;
    if (this.buyForCustomerInformation.invalid)
    {
      this.is_show_error_customer_information_form_by_advisor = true;
      return;
    }
      this.is_show_error_customer_information_form_by_advisor = false;
      this.dialCodeBuyForCustomerHasAccount = !CheckNullOrUndefinedOrEmpty(this.dialBuyForCustomerHasAccount) ?  this.dialBuyForCustomerHasAccount.SelectedDial : this.dialCodeBuyForCustomerHasAccount;
      let customerInformation = new CustomerInformation();
      customerInformation.first_name = this.buyForCustomerInformation.value.firstName;
      customerInformation.email =  this.buyForCustomerInformation.value.emailAddress;
      customerInformation.phone_dial_code =  this.dialCodeBuyForCustomerHasAccount
      customerInformation.phone_number = this.buyForCustomerInformation.value.phoneNumber;
      customerInformation.address_line1 = this.buyForCustomerInformation.value.addressLine1;
      customerInformation.address_line2 = this.buyForCustomerInformation.value.addressLine2;
      customerInformation.address_line3 = this.buyForCustomerInformation.value.addressLine3;
      customerInformation.postal_code = this.buyForCustomerInformation.value.postalCode;
      customerInformation.state_code  = this.buyForCustomerInformation.value.stateCode;
      customerInformation.country_code =  this.buyForCustomerInformation.value.countryCode;
      customerInformation.is_update_profile = is_update_profile;
      customerInformation.customer_id =  this.customer_id;
      customerInformation.is_create_account = false;
      return this.customerInformationService.updateCustmerInformation(customerInformation, this.customer_information.id.toString())
        .subscribe(
          response => {
            if(response.code === 200)
            {
              this.is_show_close = true;
              this.is_valid_advisor_buy_for_customer = true;
              this.is_choose_contact_list = this.is_buy_for_customer_has_account;
              this.is_show_customer_information_form = false;
              this.customer_information = response.data;
              this.display_my_information = this.renderDisplayInformation(response.data);
              this.currently_customer_information = response.data;
              this.buy_for_customer_id = !CheckNullOrUndefinedOrEmpty(response.customer_id) ? response.customer_id : !this.is_buy_for_myself ? this.buy_for_customer_id : null
            }
            if(response.code === 205)
            {
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: "This email or phone number already exists. Please try another one.",
                  title: "CONFIRM",
                  colorButton: false,
                },
              });
              dialogRef.afterClosed().subscribe(data=>{
                this.pannelErrorIndex = 2;
                this.openPannelToShowError(this.pannelErrorIndex)
              })
            }
          }
      ); 
  }
  updateDeliveryCheckbox(event){
    if(event.checked)
    {
      if(this.is_buy_for_myself && !this.is_anomynous_customer)
      {
          this.deliveryAddress.get('firstName').setValue(this.myInformation.value.firstName);
          this.deliveryAddress.get('emailAddress').setValue(this.myInformation.value.emailAddress);
          this.deliveryAddress.get('phoneNumber').setValue(this.myInformation.value.phoneNumber);
          this.deliveryAddress.get('addressLine1').setValue(this.myInformation.value.addressLine1);
          this.deliveryAddress.get('addressLine2').setValue(this.myInformation.value.addressLine2);
          this.deliveryAddress.get('addressLine3').setValue(this.myInformation.value.addressLine3);
          this.deliveryAddress.get('postalCode').setValue(this.myInformation.value.postalCode);
          this.deliveryAddress.get('stateCode').setValue(this.myInformation.value.stateCode);
          this.deliveryAddress.get('countryCode').setValue(this.myInformation.value.countryCode);
          this.deliveryDialCode =  this.myInformationDialCode
      }else{
        this.deliveryAddress.get('firstName').setValue(this.buyForCustomerInformation.value.firstName);
        this.deliveryAddress.get('emailAddress').setValue(this.buyForCustomerInformation.value.emailAddress);
        this.deliveryAddress.get('phoneNumber').setValue(this.buyForCustomerInformation.value.phoneNumber);
        this.deliveryAddress.get('addressLine1').setValue(this.buyForCustomerInformation.value.addressLine1);
        this.deliveryAddress.get('addressLine2').setValue(this.buyForCustomerInformation.value.addressLine2);
        this.deliveryAddress.get('addressLine3').setValue(this.buyForCustomerInformation.value.addressLine3);
        this.deliveryAddress.get('postalCode').setValue(this.buyForCustomerInformation.value.postalCode);
        this.deliveryAddress.get('stateCode').setValue(this.buyForCustomerInformation.value.stateCode);
        this.deliveryAddress.get('countryCode').setValue(this.buyForCustomerInformation.value.countryCode);
        this.deliveryDialCode = this.is_anomynous_customer ? 
        this.renderDialCode(this.anomynousDial,this.anomynousDialCode) : this.renderDialCode(this.dialBuyForCustomerAnomynous,this.dialCodeBuyForCustomerHasAccount) 
      }

        this.address = new DeliveryAddress(
          this.deliveryAddress.value.firstName,
          this.deliveryAddress.value.lastName,
          this.deliveryAddress.value.emailAddress,
          this.deliveryDialCode,
          this.deliveryAddress.value.phoneNumber,
          this.deliveryAddress.value.addressLine1,
          this.deliveryAddress.value.addressLine2,
          this.deliveryAddress.value.addressLine3,
          this.deliveryAddress.value.postalCode,
          this.deliveryAddress.value.stateCode,
          this.deliveryAddress.value.countryCode,
        );
        this.mail_phone_active = true;
        return this.deliveryAddressService.updateDeliveryAddress(this.address)
          .subscribe(
            response => {
              if (response.code == 200) {
                this.is_show_delivery_address_form = true;
                this.display_delivery_address = this.renderDisplayInformation(response.data);
              }
            }
          );
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

  changedropdownDialCodeForDeliveryAddress(event)
  {
    this.deliveryDialCode = event.srcElement.value;
  }
  changedropdownDialCode(event)
  {
    this.deliveryDialCode = event.srcElement.value;
  }

  onSubmitDeliveryAddress() {
    // this.changeDetectorRef.detectChanges()
    // if(this.dialcodeDL.toArray().length > 0)
    // {
    //   this.deliveryDialCode =  this.dialcodeDL.toArray()[0].selectedDial;
    // }
    this.deliveryDialCode = this.renderDialCode(this.dialcodeDL,this.deliveryDialCode)
    if (this.deliveryAddress.invalid)
    {
      this.is_show_error_delivery_address_form = true;
      this.is_show_delivery_address_form = true;

      return;
    }

    this.address = new DeliveryAddress(
      this.deliveryAddress.value.firstName,
      this.deliveryAddress.value.lastName,
      this.deliveryAddress.value.emailAddress,
      this.deliveryDialCode,
      this.deliveryAddress.value.phoneNumber,
      this.deliveryAddress.value.addressLine1,
      this.deliveryAddress.value.addressLine2,
      this.deliveryAddress.value.addressLine3,
      this.deliveryAddress.value.postalCode,
      this.deliveryAddress.value.stateCode,
      this.deliveryAddress.value.countryCode,
    );
    this.mail_phone_active = true;

    if (this.isEntityMy) {
      this.getShippingFee();
    }

    return this.deliveryAddressService.updateDeliveryAddress(this.address)
      .subscribe(
        response => {
          if (response.code == 200) {
            this.is_show_delivery_address_form = false;
            this.display_delivery_address = this.renderDisplayInformation(response.data);
          }
        }
      );
  }

  
  private setDisplayAddressLine() {
    const address1 = !CheckNullOrUndefinedOrEmpty(this.showAddress.address_line1) ? this.showAddress.address_line1 + ', ' : '';
    const address2 = !CheckNullOrUndefinedOrEmpty(this.showAddress.address_line2) ? this.showAddress.address_line2 + ', ' : '';
    const address3 = !CheckNullOrUndefinedOrEmpty(this.showAddress.address_line3) ? this.showAddress.address_line3 + ', ' : '';
    const postal = !CheckNullOrUndefinedOrEmpty(this.showAddress.postal_code) ? this.showAddress.postal_code : '';

    this.displayAddress = address1 + address2 + address3 + postal;
  }


  private setStateCountryLine() {
    const state = !CheckNullOrUndefinedOrEmpty(this.showAddress.state_code) ? this.stateCodeToName[this.showAddress.state_code] + ', ' : '';
    const country = !CheckNullOrUndefinedOrEmpty(this.showAddress.country_code) ? this.countryCodeToName[this.showAddress.country_code] : '';

    this.displayStateCountry = state + country;
  }
 

  // ADVISOR ORDER

  get f() { return this.registerForm.controls}

  searchAdvisorId(value) {
    this.isDisplayConfirmtext = false;
    this.isSearchAvisor = false
    if (value === '') {
      this.registerForm.get('advisor_name').setValue('');
      this.registerForm.get('remark_phone').setValue('');
      this.advisorImg = "./../../../assets/icons/UserMenu.svg";
      return;
    }

    this.customerService.searchAdvisorByAdvisorId(value).subscribe((data) => {
        if (!CheckNullOrUndefinedOrEmpty(data)) {
          this.isSearchAvisor = true
          this.registerForm.get('advisor_name').setValue(data.advisorName);
          this.registerForm.get('remark_phone').setValue(data.phoneNumberFull);
          if (!CheckNullOrUndefinedOrEmpty(data.advisorPhotoKey)) {
            this.advisorImg = this.storageUrl + data.advisorPhotoKey;
          }
          else {
            this.advisorImg = "./../../../assets/icons/UserMenu.svg";
          }
        } else {
          this.registerForm.get('advisor_name').setValue('');
          this.registerForm.get('remark_phone').setValue('');
          this.advisorImg = "";
        }
      });
  }


  submitRemark() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.isDisplayError = true;
      return;
    }
    this.cart.remarkAdvisor(this.cartId,this.registerForm.value.advisor_id,
      this.registerForm.value.advisor_name, this.registerForm.value.remark_phone).subscribe(data=>{
        if(data.code === 200)
        {
          this.isDisplayError = false;
          this.isShowBtnSubmit = true;
          this.isDisplayConfirmtext = true;
          this.is_need_assign_advisor_for_order = false;
          return
        }
    })
  }


  // CREATE ORDER
  is_summit_button_pay = false;
  errorArea : string;

  checkActiveToPay()
  {
    if (!this.isDefaultSelfCollect) {
      this.isCheckSelectDeliveryOption = true;
      this.pannelErrorIndex = 1;
      this.errorArea = "delivetyOption";
      
      return false;
    }

    if( this.specificDateTimeForm.invalid)
    {
      this.pannelErrorIndex = 1;
      this.isCheckShowRequired = true;
      this.errorArea = "delivetyOption"
      return false;
    }
    
    if(this.is_buy_for_myself == true && this.myInformation.invalid && !this.is_anomynous_customer)
    {
      this.pannelErrorIndex = 2;
      this.is_show_customer_information_form = true;
      this.is_show_error_customer_information_form = true;
      this.errorArea = 'myInformation'
      return false;
    }
   
    if(this.is_buy_for_myself && this.is_anomynous_customer && this.buyForCustomerInformation.invalid)
    {
      this.is_show_customer_information_form = true;
      this.is_show_error_customer_information_form_by_advisor = true;
      this.errorArea = 'myOrder';
      this.pannelErrorIndex = 2;
      return false;
    }

    if(!this.is_buy_for_myself && this.is_buy_for_customer_has_account && !this.is_choose_contact_list)
    {
      this.is_show_choose_contact = true;
      this.pannelErrorIndex = 2;
      this.errorArea = 'myOrder';
      return false;
    }
    if(!this.is_buy_for_myself && !this.is_buy_for_customer_has_account && this.buyForCustomerInformation.invalid)
    {
      this.is_show_customer_information_form = true;
      this.is_show_error_customer_information_form_by_advisor = true;
      this.errorArea = 'myOrder';
      this.pannelErrorIndex = 2;
      return false;
    }
    if(this.shipping_location_selected == null)
    {
      
      this.isShowErrorShippingLocation = true;
      this.pannelErrorIndex = 2;
      this.errorArea = 'shipping-location';
      return false;
    }
    if(this.is_buy_for_myself == true && !this.self_collect_free_active && this.deliveryAddress.invalid && !this.is_anomynous_customer)
    {

      this.is_show_delivery_address_form = true;
      this.pannelErrorIndex = 2;
      this.is_show_error_delivery_address_form = true;
      this.errorArea = 'deliveryAddress'
      return false;
    }
    if(!this.self_collect_free_active && this.deliveryAddress.invalid)
    {
      this.is_show_delivery_address_form = true;
      this.is_show_error_delivery_address_form = true;
      this.pannelErrorIndex = 2;
      this.errorArea = 'deliveryAddress'
      return false;
    }
    if(this.is_need_advisor == true && CheckNullOrUndefinedOrEmpty(this.cart_advisor_id) && !this.isDisplayConfirmtext && this.carArr[0].is_naep_discount === false && !this.is_redemption_cart)
    {
      this.is_need_assign_advisor_for_order = true;
      this.pannelErrorIndex = 3;
      this.errorArea = 'advisorArea'
      return false;
    }

    this.pannelErrorIndex = null
   return true
  }

  createOrder() {
    this.buttonName = "Processing...";
    this.active = true;
    this.allExpandState = false;
    

    if (!this.checkActiveToPay())
    {
      this.is_summit_button_pay = true;
      this.buttonName = "PAY";
      this.active = false;
      
      this.openPannelToShowError(this.pannelErrorIndex,this.errorArea)
      
      return;
    }
    else {


      let valid_to_create_order = true;

      if(!this.self_collect_free_active)
      {
        this.onSubmitDeliveryAddress();
      }
      if(this.is_buy_for_myself && !this.is_anomynous_customer)
      {
        this.onUpdateCustomerInformation()
      }
      if(!this.is_buy_for_myself && this.is_buy_for_customer_has_account )
      {
        this.onUpdateCustomerInformationByAdvisor()
      }


      if(!this.is_buy_for_myself && !this.is_buy_for_customer_has_account)
      {
        valid_to_create_order = false;
        if (this.buyForCustomerInformation.invalid)
        {
          this.is_show_error_customer_information_form_by_advisor = true;
          return;
        }
          this.is_show_error_customer_information_form_by_advisor = false;
          this.dialCodeBuyForCustomerAnomynous  = this.renderDialCode(this.dialBuyForCustomerAnomynous,this.dialCodeBuyForCustomerAnomynous);
          let customerInformation = new CustomerInformation();
          customerInformation.first_name = this.buyForCustomerInformation.value.firstName;
          customerInformation.email =  this.buyForCustomerInformation.value.emailAddress;
          customerInformation.phone_dial_code =  this.dialCodeBuyForCustomerAnomynous;
          customerInformation.phone_number = this.buyForCustomerInformation.value.phoneNumber;
          customerInformation.address_line1 = this.buyForCustomerInformation.value.addressLine1;
          customerInformation.address_line2 = this.buyForCustomerInformation.value.addressLine2;
          customerInformation.address_line3 = this.buyForCustomerInformation.value.addressLine3;
          customerInformation.postal_code = this.buyForCustomerInformation.value.postalCode;
          customerInformation.state_code  = this.buyForCustomerInformation.value.stateCode;
          customerInformation.country_code =  this.buyForCustomerInformation.value.countryCode;
          customerInformation.is_update_profile = false;
          customerInformation.customer_id =  this.customer_id;
          customerInformation.is_create_account = true;
          return this.customerInformationService.updateCustmerInformation(customerInformation, this.customer_information.id.toString())
            .subscribe(
              response => {
                if(response.code === 200)
                {
                  this.is_choose_contact_list = false;
                  this.is_show_customer_information_form = false;
                  this.customer_information = response.data;
                  this.display_my_information = this.renderDisplayInformation(response.data);
                  this.currently_customer_information = response.data;
                  this.buy_for_customer_id =  customerInformation.is_create_account? response.customer_id : this.buy_for_customer_id
                  this.createOrderStepBookingSD()
                }
                if(response.code === 205)
                {
                  this.buttonName = "PAY";
                  this.active = false;

                  const dialogRef = this.dialog.open(CommonDialogComponent, {
                    width: "500px",
                    data: {
                      message: "This email or phone number already exists. Please try another one.",
                      title: "CONFIRM",
                      colorButton: false,
                    },
                  });
                  dialogRef.afterClosed().subscribe(data=>{
                    this.pannelErrorIndex = 2;
                    this.errorArea = "myOrder";
                    this.openPannelToShowError(this.pannelErrorIndex,this.errorArea)
                  })
                  return;
                }
              }
          ); 
      }
      if(this.is_anomynous_customer)
      {
        valid_to_create_order = false;
        if (this.buyForCustomerInformation.invalid)
        {
          this.is_show_error_customer_information_form_by_advisor = true;
          return;
        }else{
          this.anomynousDialCode = !CheckNullOrUndefinedOrEmpty(this.anomynousDial ) ?  this.anomynousDial.SelectedDial : this.anomynousDialCode;
          this.is_show_error_customer_information_form_by_advisor = false;
          let customerInformation = new CustomerInformation();
          customerInformation.first_name = this.buyForCustomerInformation.value.firstName;
          customerInformation.email =  this.buyForCustomerInformation.value.emailAddress;
          customerInformation.phone_dial_code =   this.anomynousDialCode;
          customerInformation.phone_number = this.buyForCustomerInformation.value.phoneNumber;
          customerInformation.address_line1 = this.buyForCustomerInformation.value.addressLine1;
          customerInformation.address_line2 = this.buyForCustomerInformation.value.addressLine2;
          customerInformation.address_line3 = this.buyForCustomerInformation.value.addressLine3;
          customerInformation.postal_code = this.buyForCustomerInformation.value.postalCode;
          customerInformation.state_code  = this.buyForCustomerInformation.value.stateCode;
          customerInformation.country_code =  this.buyForCustomerInformation.value.countryCode;
          customerInformation.customer_id =  this.customer_id;
          return this.customerInformationService.updateCustmerInformationForAnomynous(customerInformation, this.customer_information.id.toString())
            .subscribe(
              response => {
                if(response.code === 200)
                {
                  this.is_show_customer_information_form = false;
                  this.customer_information = response.data;
                  this.display_my_information = this.renderDisplayInformation(response.data);
                  this.currently_customer_information = response.data;
                  this.auth.updateAnomynousInfor(customerInformation).subscribe(response1=>{
                    if(response1.code === 200)
                    {

                      localStorage.setItem('token',response1.data)
                      this.createOrderStepBookingSD()

                    }else if(response1.code === 202)
                    {
                      this.anomynous_id = response1.anomynous;
                      this.createOrderStepBookingSD()
                    }
                  })
                }
                if(response.code === 201)
                {
                  this.buttonName = "PAY";
                  this.active = false;
                  this.pannelErrorIndex = 2;
                  this.errorArea = "myOrder";
                  this.openPannelToShowError(this.pannelErrorIndex,this.errorArea)

                  if(response.code === 201)
                  {
                    this.buttonName = "PAY";
                    this.active = false;

                    const dialogRef = this.dialog.open(DialogConfirmComponent, {
                      width: "500px",
                      data: {
                        message: "This email or phone number already exists. Please log in or try another one.",
                        type : "COMMON",
                        btnYes : "LOG IN",
                        btnNo : "TRY ANOTHER",
                        titleDialog : "NOTICE",
                        classSuccess : true
                      },
                    });
                  
                    dialogRef.afterClosed().subscribe(result =>
                    {
                      if (result === true)
                      {
                        localStorage.removeItem('token')
                        this.router.navigate(['login'])
                      } else
                      {
                        dialogRef.close();
                      }
                    })
                  }
                }
              }
          ); 
        }
      }

      if(valid_to_create_order)
      {
        this.createOrderStepBookingSD()
      }else{
        return;
      }
    }
  }


  createOrderStepBookingSD()
  {
    // this.deliveryDialCode =  this.dialcodeDL.toArray()[0].selectedDial;
    if (this.isCheckShowRadio2) {

      let formCreate = new CreateQuickOrder();
      formCreate.orderId = '';
      formCreate.shipping_id = this.cartShop.shipping.id;
      formCreate.customerName = this.deliveryAddress.value.firstName;
      formCreate.customerPhone =       this.renderDialCode(this.dialcodeDL,this.deliveryDialCode) + this.deliveryAddress.value.phoneNumber;
      formCreate.customerZipCode =  this.deliveryAddress.value.postalCode;
      formCreate.customerAddressLine1 = this.deliveryAddress.value.addressLine1;
      formCreate.customerAddressLine2 = this.deliveryAddress.value.addressLine2;
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
          this.createOrderStepUpdateBuyForCustomer();
        } else if (data.code === 201) {
          this.buttonName = "PAY";
          this.active = false;

          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message: data.data.ResultMsg,
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });

          this.is_show_delivery_address_form = true;
          
          this.openPannelToShowError(2)
          
          dialogNotifi.afterClosed().subscribe(data => {
            if (data) {
              dialogNotifi.close();
            }
          });
        }
      })
    
    } else {
      this.createOrderStepUpdateBuyForCustomer();
    }
  }


  createOrderStepUpdateBuyForCustomer() {

    let specialDelivery = new SpecialDelivery();

    if (this.isShowFormShippingSpecial) {
      specialDelivery.sd_type = this.isCheckShowRadio1 ? 'SD_ONLY' : (this.isCheckShowRadio2 ? 'SD_BEFORE' : (this.isCheckShowRadio3 ? 'SD_AFTER' : 'SD_ONLY_LATER'));
      specialDelivery.shipping_id = this.shippingID;
      specialDelivery.sd_shipping_fee = this.isEntityMy ? this.shippingFee : this.valueShipCurrent;

      if (this.isCheckButton4) {
        specialDelivery.select_date = undefined;
        specialDelivery.select_time = undefined;
        specialDelivery.sd_fee = 0;

      } else {
        if (this.isCheckShowRadio1) {
          specialDelivery.select_date = !CheckNullOrUndefinedOrEmpty(this.specificDateTimeForm.get('specificDate1').value) 
          ? formatDate(this.specificDateTimeForm.get('specificDate1').value, "yyyy-MM-dd", "en-US") : undefined;
          specialDelivery.select_time = undefined;
          specialDelivery.sd_fee = 0;

        } else {
          specialDelivery.select_date = !CheckNullOrUndefinedOrEmpty(this.specificDateTimeForm.get('specificDate2').value) 
          ? formatDate(this.specificDateTimeForm.get('specificDate2').value, "yyyy-MM-dd", "en-US") 
          : formatDate(this.specificDateTimeForm.get('specificDate3').value, "yyyy-MM-dd", "en-US");
          specialDelivery.select_time = this.selectTime;
          specialDelivery.sd_fee = this.valueShipSD;
        }
      }

    } else {
      specialDelivery = null;
    }

    let data = {
      cart_id : this.cartId,
      is_buy_for_customer : !this.is_buy_for_myself,
      is_have_account : this.is_buy_for_customer_has_account,
      customer_id : !this.is_buy_for_myself ?  this.buy_for_customer_id : this.anomynous_id ,
      special_delivery: specialDelivery
    }
    this.cart.updateCartAdvisorBuyForCustomer(data).subscribe(response=>{
      if(response.code === 200)
      {
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
        this.shippingModel = new Shipping(
          deliveryMethod,
          null,
          null,
          null,
          null,
          this.shipping_location_selected.id
        );
        return this.shippingService.updateDeliveryAddress(this.shippingModel, this.shippingID.toString()).subscribe(
          response => {
            if (response.code == 200) {
              this.createOrderStepCheckInvalidPackage()
            }
          },
          err => { console.log(err); }
        );
        
      } else {

        this.buttonName = 'PAY';
        this.active = false;

        this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message: response.data,
            title:
              "NOTIFICATION",
            colorButton: false
          },
        })
      }
    })
  }
  

  openPannelToShowError(indexError,nameError?)
  {
    this.viewPanels.forEach((element,index)=>{
      if(index === indexError)
      {
        element.open()
      }
    })
    if(!CheckNullOrUndefinedOrEmpty(nameError))
    {
      this._ScrollToError(nameError)
    }

  }

  async openPannelButton(indexShow : number){

    this.viewPanels.forEach((element,index)=>{
      if(index === indexShow)
      {
        element.open()
      }else{
        element.close()
      }
    })
  }
  

  
  createOrderStepCheckInvalidPackage() {
    if(this.isCheckNaep)
    {
      this.recruitmentService.checkInvalidPackage(this.cartId).subscribe(data=>{
        if(data.code === 200)
        { 
          if(data.data.is_active == true)
          {
            this.createOrderStepCheckInvalidProduct()
          }else{
            this.buttonName = "PAY";
            this.active = false;

            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'The package in your cart is no longer available and cannot be ordered. Please choose other package.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(data => {
              if (data == true) {
                this.sharedService.nextCart(0);
                this.router.navigate(['/store']);
              }
            })
          }
        }
      })
    }else{
      this.createOrderStepCheckInvalidProduct()
    }
  }


  createOrderStepCheckInvalidProduct()
  {
    this.cart.checkCartHasInActiveProduct(this.cartId, this.total_product).subscribe(data => {
      if (data.code === 200) {        
        this.createOrderStepAfterCheck()
      } 
      else if(data.code === 201)
      {
        this.buttonName = "PAY";
        this.active = false;

        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              'The package in your cart contain inactive product. Please choose other package.',
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data => {
          if (data == true) {
            this.sharedService.nextCart(0);
            this.router.navigate(['/store']);
          }
        })
      }
      else if(data.code === 204)
      {
        this.buttonName = "PAY";
        this.active = false;
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              'We removed this product in your cart This product no longer available. Please contact admin TMM.',
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data => {
          if (data == true) {
            this.sharedService.nextCart(0);
            this.router.navigate(['/store']);
          }
        })
      }
      else if(data.code === 205)
      {
        this.buttonName = "PAY";
        this.active = false;
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
            'The product in your cart is no longer available and cannot be ordered. Please choose other products.',
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data => {
          if (data == true) {
            this.sharedService.nextCart(0);
            this.router.navigate(['/store']);
          }
        })
      }
      else if (data.code === 207) {
        this.getListCart(false);
        let listNameRemoveProduct = "";
        data.data.forEach(element => {
          listNameRemoveProduct += element.product_product_name + " ";
        })
        // Show message 
        this.buttonName = "PAY";
        this.active = false;

        const dialogRef = this.dialog.open(DialogConfirmComponent, {
          width: '500px',
          data: {
            message: `We removed the product ${listNameRemoveProduct} in your cart because 
          it is no longer active on store. Do you want to proceed to payment?`, type: "APPROVED"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.sharedService.nextCart(this.total_product);
            this.createOrderStepAfterCheck();
          } else {
            this.sharedService.nextCart(this.total_product);
            this.router.navigate(['/store']);

            // dialogRef.close();
          }
        })
        // Call Api to update cart
      } 
      else {
        //Show message
        this.buttonName = "PAY";
        this.active = false;
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              'An error occurred. Please try again later.',
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(data => {
          return;
        })

      }
    })
  }



  createOrderStepAfterCheck() {


    let formCreateOrder = {
      advisor_customer_id: this.cart_advisor_id,
      delivery_address_id: Number(this.delivery_address_id),
      customer_information_id: Number(this.customer_information.id),
      shipping_fee: this.isEntityMy ? this.shippingFee : (this.isCheckNaep ? this.naepShipping : this.shipping),
      subtotal: this.isCheckNaep ? this.naepSubTotal : this.subTotal,
      total_amount: this.isCheckNaep ? this.naepTotal : this.Total,
      shipping_id: Number(this.shippingID),

    };
    this.order.createOrder(formCreateOrder,this.is_redemption_cart).subscribe(data => {
      if (data.code === 200) {
        this.orderId = data.data.id;
        this.orderUuid = data.data.uuid;
        this.order_tmm = data.data.order_tmm;
       
        this.MoveToPaymentOption(formCreateOrder);
        
        this.sharedService.nextCart(0);
      }
    });
  }

  MoveToPaymentOption(formCreateOrder) {
    if (this.entity === 'MY' && formCreateOrder.total_amount != 0  && !this.is_redemption_cart) {
      this.router.navigate(['/payment-options-full'], { queryParams: { id: this.orderId, uuid: this.orderUuid } });
    } else if (this.entity !== 'MY' && formCreateOrder.total_amount != 0  && !this.is_redemption_cart){
      this.router.navigate(['/select-payment'], { queryParams: { orderId: this.orderId, uuid: this.orderUuid} });
    } else if (formCreateOrder.total_amount == 0 && !this.is_redemption_cart){
      const formPayment = {
        order_id: this.orderId,
        payment_amount: formCreateOrder.total_amount,
        payment_method: 'OFFICE',
        payment_gateway: 'OFFICE',
        paymentOption: OrderPaymentOption.FULL,
        is_singlePayment: '',
        singlePaymentOrderLineGifts: '',
      };
  
      this.payment.createPayment(formPayment).subscribe((res) => {
        if (res.code === 200) {
          this.updateStatusPayment();
          this.router.navigate(['/payment-done'], { queryParams: { orderId: this.orderId, uuid: this.orderUuid} });
        }
      })
    }
  }

  updateStatusPayment() {
    return this.order
      .updateStatus(this.orderId, "TO_VERIFY" ).subscribe();
  }

  scroll(el: HTMLElement) {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    el.scrollIntoView();
  }

  _ScrollToError(name) {

    setTimeout(() => {
      let element = document.getElementById(name);
      element.scrollIntoView({behavior : 'smooth' });
    }, 500);
  }

}


//COMMON FUNCTION

function phoneNumberValidator(checkOutForm: FormControl) {
  if(!CheckNullOrUndefinedOrEmpty(checkOutForm.value)){
    if (isNaN(checkOutForm.value) === false && !checkOutForm.value.includes(' ')) {
      return null;
    }
    return { phone_number: true };
  }
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




//MODAL
interface Location{
  id : number;
  name: string;
  color: string;
}

interface DisplayInformation{
  name : string;
  address : string;
  email : string;
  phone_number : string;
}

interface ContactList {
  activity_id : number;
  id : number;
  email: string;
  first_name: string;
  phone_dial_code: string;
  phone_number: string;
}