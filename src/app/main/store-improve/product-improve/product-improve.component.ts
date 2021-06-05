import { DialogLoginNewComponent } from './../../common-component/dialog-login-new/dialog-login-new.component';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Product } from 'app/core/models/product.model';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { DialogPropertiesProductComponent } from 'app/main/common-component/dialog-properties-product/dialog-properties-product.component';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import { DialogLoginComponent } from 'app/main/common-component/dialog-login/dialog-login.component';
import { DialogConfirmComponent } from 'app/main/common-component/dialog-confirm/dialog-confirm.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CartService } from 'app/core/service/cart.service';
import { AuthService } from 'app/core/service/auth.service';
import { SharedService } from 'app/core/service/commom/shared.service';
import { MessageService } from 'primeng/api';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { Advisor } from 'app/core/models/user.model';
import { MyProfileService } from 'app/core/service/my-profile.service';
import { MyProfile } from 'app/core/models/my-profile.model';

@Component({
  selector: 'app-product-improve',
  templateUrl: './product-improve.component.html',
  styleUrls: ['./product-improve.component.scss'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProductImproveComponent implements OnInit {

  @Input() product;
  decoded: any;
  roleArray: [];
  storageUrl = environment.storageUrl;
  // checksShowHover: boolean = false;
  propertiesData;
  token: string;
  checkEmailEditVar: boolean;
  is_naep_cart: boolean = false;
  is_redemption_cart: boolean = false;
  total_product: number = 0;
  cartData: any;
  idCartAdvisor: string;
  cart_Id: any;
  total_buy: number = 0;
  maxOrder: number;
  advisor_get_from_api: Advisor;

  buttonNameAdd: string = 'Add to cart';
  activeAdd: boolean = false;

  buttonNameBuy: string = 'Buy Now';
  activeBuy: boolean = false;
  is_anomynous_account : boolean = false;
  constructor(private translateService: TranslateService,
    private router: Router, private dialog: MatDialog,
    private cartService: CartService,
    private _Auth: AuthService,
    private sharedService: SharedService,
    private messageService: MessageService,
    private myProfileService: MyProfileService,
    ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
  }

  checkEditEmail() {
    this._Auth.checkEditEmail(this.decoded.user_id).subscribe(data => {
      this.checkEmailEditVar = data
    });
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

  // get translation
  getTranslation(id: string) {
    let key = 'PRODUCT.TITLE.' + id + '';
    return this.translateService.getStreamOnTranslationChange(key);
  }

  checkHasPromotionPrice(price: string) {
    if (CheckNullOrUndefinedOrEmpty(price) || parseFloat(price) === 0) {
      return false
    }
    return true;
  }

  showProductDetail() {
    this.router.navigate(['/product-detail'], { queryParams: { id: this.product.publicId } })
  }

  checkEvent(isCheck, status) {
    if (status == 'event') {
      if (isCheck) {
        this.buttonNameBuy = 'Processing...';
        this.activeBuy = true;

      } else {
        this.buttonNameAdd = 'Processing...';
        this.activeAdd = true;
      }
    } else {
      if (isCheck) {
        this.buttonNameBuy = 'Buy Now';
        this.activeBuy = false;

      } else {
        this.buttonNameAdd = 'Add to cart';
        this.activeAdd = false;
      }
    }
  }

  getDataCreateCart() {
    if(!CheckNullOrUndefinedOrEmpty(this.token)){
      this.myProfileService.getProfile().subscribe((response) => {
        if (response.code === 200) {
          const myProfile: MyProfile = response.userProfileData;
        
          this.is_anomynous_account = myProfile.is_anomynous_account
        }
      });
    }
    
    if (!CheckNullOrUndefinedOrEmpty(this.token)) {
      this.decoded = jwt_decode(this.token);
      this.roleArray = this.decoded.role;

      this.cartService.getCartByCustomerId().subscribe(data => {
        if (!CheckNullOrUndefinedOrEmpty(data)) {
          this.is_naep_cart = data.is_naep_cart;
          this.is_redemption_cart = data.is_redemption_cart;

          this.cartData = data;
          this.idCartAdvisor = data.cart_advisor_customer_id;
          this.cart_Id = data.id;
          if (data === undefined) {
            this.total_product = 0;
          } else {
            this.total_product = data.cartItems.length;
          }
        } else {
          return;
        }
      });
      this.checkEditEmail();
      this.checkAdvisor();

    } else {
      this.total_product = 0;
    }
  }

  addToCart(isCheck) {
    if (this.product.propertiesv2.length != 0) {
      const dialogNotifi = this.dialog.open(DialogPropertiesProductComponent, {
        width: "500px",
        data: {
          product: this.product,
          decoded: this.decoded
        },
      });

      dialogNotifi.afterClosed().subscribe(dataDialog => {
        if (!CheckNullOrUndefinedOrEmpty(dataDialog)) {
          this.propertiesData = dataDialog.data;    

          this.checkCart(isCheck, this.propertiesData);
        }
      })

    } else {
      this.checkCart(isCheck, {});
    }
  }

  checkCart(isCheckEvent, properties) {

    this.token = localStorage.getItem('token');
    
    this.checkEvent(isCheckEvent, 'event');

    // No login user
    if (CheckNullOrUndefinedOrEmpty(this.token) ||  (this.is_anomynous_account &&  this.total_product == 0)) {

      const dialogRefLogin = this.dialog.open(DialogLoginNewComponent, {
        width: '350px',
        maxWidth: '75vw'
      });

      dialogRefLogin.afterClosed().subscribe(data => {
        if (data === 'signin') {
          localStorage.removeItem('token')
          this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url }});

        } else if (data === 'create') {
          localStorage.removeItem('token')
          this.router.navigate(["/register"], { queryParams: { checkUrl: this.router.url }});
        
        } 
        else if(data === 'guest')
        {
          // localStorage.removeItem('token')
          this._Auth.buyAsGuest().subscribe(response=>{
            if(response === true)
            {
              this.commonAddTocart(this.product.id, properties,isCheckEvent)
            }
          })
        }
        else {
          this.checkEvent(isCheckEvent, 'not-event');
        }
      });

    } else if (this.checkEmailEditVar) {
      const dialogRefLogin = this.dialog.open(DialogConfirmComponent, {
        width: '500px',
        data: { message: 'Your session has ended. Please log in again.', type : "APPROVED" }
      });

      dialogRefLogin.afterClosed().subscribe((data) => {
        if (data === true) {
          localStorage.removeItem('token')
          this.router.navigate(["/login"],{queryParams: { returnUrl : this.router.url }});

        } else {
          this.checkEvent(isCheckEvent, 'not-event');
        }
      });

    } else {
      //Redemption
      if(this.is_naep_cart || this.is_redemption_cart) {
        this.checkEvent(isCheckEvent, 'not-event');

        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
          width: "500px",
          data: {
            message: this.is_naep_cart ? "NAEP packages cannot be ordered with other products. Do you wish to empty your current cart first?" : 
            "Redempition product cannot be ordered with other products. Do you wish to empty your current cart first?"
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result === true) {
            const param = {
              product_id: this.product.id,
              quantity: 1,
              advisor_customer_id: !CheckNullOrUndefinedOrEmpty(this.advisor_get_from_api) 
              ? this.advisor_get_from_api.id : null,
              properties: properties,
              is_deleted: false,
            };
            //Delete cart
            this.cartService
              .deleteCartByCartId(this.cart_Id)
              .subscribe((data) => {
                //Create new cart
                this.cartService.addToCart(param).subscribe((data) => {
                  if (data.code === 200) {
                    this.sharedService.sharedMessage.subscribe(
                      (message) => (this.total_product = message)
                    );
                    this.total_product = 0;
                    this.sharedService.nextCart(this.total_product + 1);
                    this.messageService.add({ summary: 'Added to cart successfully.', severity: 'success', life: 4000});
  
                    this.checkEvent(isCheckEvent, 'not-event');

                    if (isCheckEvent) {
                      this.router.navigate(["/check-out-improve"]);
                    }
                  }
                });
              });
          } else {
            this.checkEvent(isCheckEvent, 'not-event');
            dialogRef.close;
          }
        });
        return;
      }

      if(this.checkiIsHaveInternalDiscount(this.product)) {
        //User in product detail and has discount on product.
        this.cartService.checkMaximumProduct(this.product.publicId).subscribe(response=>{
          if(response.code === 200)
          {
            this.total_buy = response.sum;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
            if(this.total_buy >= this.product.max_total_discount)
            {
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: "You have reached the limit to buy Thermomix at this price. Please check out the current cart to proceed new order.",
                  title: "CONFIRM",
                  colorButton: false,
                },
              });
              this.checkEvent(isCheckEvent, 'not-event');
              return;
            }else{
             this.commonAddTocart(this.product.id, properties, isCheckEvent);
            }
          }else{
            return;
          }
        })
      }else{
        this.cartService.checkMaximumProduct(this.product.publicId).subscribe(response=>{
          if(response.code === 200)
          {
            this.total_buy = response.sum;
            if(this.total_buy === this.product.max_total_discount && this.cartData !== undefined)
            {
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: "You have reached the limit to buy Thermomix at this price. Please check out the current card to proceed new order.",
                  title: "CONFIRM",
                  colorButton: false,
                },
              });

              this.checkEvent(isCheckEvent, 'not-event');
              return;
            }
            else{
              this.commonAddTocart(this.product.id, properties, isCheckEvent);
            }
          }
          else{
            return;
          }
        })
      }
      
    }
  }

  commonAddTocart(id, properties, isCheckEvent) {
    const param = {
      product_id: id,
      quantity: 1,
      advisor_customer_id: !CheckNullOrUndefinedOrEmpty(this.advisor_get_from_api) 
      ? this.advisor_get_from_api.id : null,
      properties: properties,
      is_deleted: false,
    };
    
    if (this.idCartAdvisor == undefined || 
      param.advisor_customer_id == this.idCartAdvisor || 
      param.advisor_customer_id == null) {
      //Add to cart
      this.cartService.addToCart(param).subscribe((data) => {
        if (data.code === 200) {
          this.sharedService.sharedMessage.subscribe(
            (message) => (this.total_product = message)
          );
          this.sharedService.nextCart(this.total_product + 1);
          this.checkEvent(isCheckEvent, 'not-event');
          this.messageService.add({ summary: 'Added to cart successfully.', severity: 'success', life: 4000});

          if (isCheckEvent) {
            this.router.navigate(["/check-out-improve"]);
          }

        } else if (data.code === 202) {
          //Check Pay Option
          this.checkEvent(isCheckEvent, 'not-event');
          const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            width: "500px",
            data: {
              message:
                // "Current shopping bag has products with different payment options. Do you wish the reset the cart?",
                "Current shopping bag has products with different payment options. Do you wish to reset the cart?",
            },
          });

          //Show dialog
          dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
              const param = {
                product_id: id,
                quantity: 1,
                advisor_customer_id: !CheckNullOrUndefinedOrEmpty(this.advisor_get_from_api) 
                ? this.advisor_get_from_api.id : null,
                properties: properties,
                is_deleted: false,
              };
              //Delete cart
              this.cartService
                .deleteCartByCartId(this.cart_Id)
                .subscribe((data) => {
                  if(data.code === 200)
                  {
                    //Create new cart
                    this.cartService.addToCart(param).subscribe((data) => {
                      if (data.code === 200) {
                        this.sharedService.sharedMessage.subscribe(
                          (message) => (this.total_product = message)
                        );
                        this.total_product = 0;
                        this.sharedService.nextCart(this.total_product + 1);
                        this.messageService.add({ summary: 'Added to cart successfully.', severity: 'success', life: 4000});
                        this.checkEvent(isCheckEvent, 'not-event');

                        if (isCheckEvent) {
                          this.router.navigate(["/check-out-improve"]);
                        }
                      }
                    });
                  }else{
                    return;
                  }
                });
            } else {
              dialogRef.close;
            }
          });
        }
        //Check Max order
        else if ( data.code === 201 && data.message === "Product exceeds max order number.") 
        {
          this.checkEvent(isCheckEvent, 'not-event');
          const dialogRef = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message:
                "Cannot order more than " +
                this.maxOrder +
                " for this product.",
              title: "CONFIRM",
              colorButton: true,
            },
          });
        }
        else if( data.code === 203){
          this.checkEvent(isCheckEvent, 'not-event');
          const dialogRef = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message:
                "Cannot add a product with different currency into an existing cart. Please choose another.",
              title: "CONFIRM",
              colorButton: true,
            },
          });
        }
      });
    } else {
      // return;
      //Show dialog
      const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        width: "500px",
        data: {
          message:
            "Not the same advisor with the item in your shopping bag. Do you wish to proceed?",
        },
      });

      //event dialog
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          const param = {
            product_id: id,
            quantity: 1,
            advisor_customer_id: !CheckNullOrUndefinedOrEmpty(this.advisor_get_from_api) 
            ? this.advisor_get_from_api.id : null,
            properties: properties,
            is_deleted: false,
          };
          //Delete cart
          this.cartService
            .deleteCartByCartId(this.cart_Id)
            .subscribe((data) => {
              //Create new cart
              this.cartService.addToCart(param).subscribe((data) => {
                if (data.code === 200) {
                  this.sharedService.sharedMessage.subscribe(
                    (message) => (this.total_product = message)
                  );
                  this.total_product = 0;
                  this.sharedService.nextCart(this.total_product + 1);
                  this.messageService.add({ summary: 'Added to cart successfully.', severity: 'success', life: 4000});

                  this.checkEvent(isCheckEvent, 'not-event');

                  if (isCheckEvent) {
                    this.router.navigate(["/check-out-improve"]);
                  }
                }
              });
            });
        } else {
          this.checkEvent(isCheckEvent, 'not-event');
          dialogRef.close;
        }
      });
    }
  }

  checkAdvisor() {
    if (this.product.hasAdvisor) {
      this._Auth.getAdvisorByCustomer().subscribe(
        (response) => {
          if (!CheckNullOrUndefinedOrEmpty(response)) {
            this.advisor_get_from_api = response;
          }
        }
      );
    }
  }
}
