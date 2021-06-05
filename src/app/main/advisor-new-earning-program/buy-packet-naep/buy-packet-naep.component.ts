import { element } from 'protractor';
import { NaepPackage} from './../../../core/models/product.model';
import { Component, OnInit } from '@angular/core';
import { Title } from 'app/core/enum/title';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { NaepService} from 'app/core/service/naep.service'
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { MatDialog} from '@angular/material/dialog';
import { addToCartNaep, addToCartNewNaep } from 'app/core/models/naep.model';
import { SharedService } from 'app/core/service/commom/shared.service';
import { environment } from 'environments/environment';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CartService } from 'app/core/service/cart.service';
import { isEmptyOrNullOrUndefined } from 'app/main/account/profile/_helper/helper-fn';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import * as moment from 'moment';
import { CartItem } from 'app/core/models/cart.model';

@Component({
  selector: 'app-buy-packet-naep',
  templateUrl: './buy-packet-naep.component.html',
  styleUrls: ['./buy-packet-naep.component.scss']
})
export class BuyPacketNaepComponent implements OnInit {

  title = Title.LEFT_LINK;
  radioValue: string = '0';
  listSpecialProduct = [];
  total_product : number;
  buttonName: string = "Buy NAEP Package";
  active: boolean = false;
  storeUrl = environment.storageUrl;
  packageSelect;
  pricePackage: number = 0;
  packageId: string;
  checkDataPackage: boolean = false;
  
  constructor(
    private router: Router,
    private naepService : NaepService,
    public  dialog    : MatDialog,
    private sharedService: SharedService,
    private cart: CartService
  ) { }

  ngOnInit(): void {
    this.getDataNaep();
  }

  radioChange(event: MatRadioChange){
    this.packageSelect = event.value;
    this.packageId = this.packageSelect.id;
  }

  getDataNaep() {
    this.naepService.getSpecialProductV2().subscribe( data =>{
      this.listSpecialProduct = data;

      this.packageSelect = this.listSpecialProduct[0];
      this.packageId = this.packageSelect.id;

      if (this.listSpecialProduct.length === 0) {
        this.checkDataPackage = false;
      } else {
        this.checkDataPackage = true;
      }
    })
  }

  getPricePackage(data) {
    this.pricePackage = this.getPricePromotion(data);

    if (data != undefined) {

      if (data.naepItem.length != 0) {
        data.naepItem.forEach( element => {
          this.pricePackage = this.pricePackage + Number(element.product.naep_discount_price);
        })
      }

      return this.pricePackage;
    }
  }

  getPricePromotion(product: NaepPackage) {
    return CheckNullOrUndefinedOrEmpty(product.promotionalPriceFee) ? Number(product.listedPriceFee) : Number(product.promotionalPriceFee);
  }

  buyNaepPackage() {
    if (this.packageSelect.id != undefined) {
      //API check isvalid package

      



      let checkProperties = this.packageSelect.naepItem.filter(product => product.is_have_properties === true);
      
      if (checkProperties.length === 0) {

        this.active = true;
        this.buttonName = "Processing...";

        let naep = new addToCartNewNaep();
        naep.package_id = this.packageSelect.id;
        naep.deposit = [];
        
        this.naepService.checkValidPackage(this.packageId).subscribe(
          checknaep => {
            if (checknaep.code === 200 && !CheckNullOrUndefinedOrEmpty(checknaep)) {
              if (checknaep.data) {
                this.naepService.createNewCartNaep(naep).subscribe( data => {

                  if (data.code === 200) {
                    this.sharedService.sharedMessage.subscribe(
                      (message) => (this.total_product = message)
                    );
                    this.sharedService.nextCart(this.total_product + 1);
                    
                    this.router.navigate(['/advisor-earning-program/buy-packet-naep-success'])  
                             
                  } else if (data.code === 201){
        
                    let cartId = data.data.id;
                    this.active = false;
                    this.buttonName = "Buy NAEP Package";
          
                    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
                      width: "550px",
                      data: {
                        message: "NAEP packages cannot be ordered with other products. Do you wish to empty your current cart first?",
                      },
                    });
          
                    dialogRef.afterClosed().subscribe( check => {
                      if (check) {
                        this.active = true;
                        this.buttonName = "Processing...";
                        
                        this.cart.deleteCartByCartId(cartId).subscribe( eCart => {
                          if (eCart.code === 200) {
        
                            this.sharedService.sharedMessage.subscribe(
                              (message) => (this.total_product = message)
                            );
                            this.sharedService.nextCart(0);
          
                            this.naepService.createNewCartNaep(naep).subscribe( data => {
                              if(data.code === 200){
                                
                                this.sharedService.sharedMessage.subscribe(
                                  (message) => (this.total_product = message)
                                );
                                this.sharedService.nextCart(this.total_product + 1);
        
                                this.router.navigate(['/advisor-earning-program/buy-packet-naep-success'])
                              } 
                              else {
                                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                  width: "500px",
                                  data: {
                                    message: data.message,
                                    title:
                                      "NOTIFICATION",
                                    colorButton: false
                                  },
                                });
          
                                dialogNotifi.afterClosed().subscribe(data =>
                                {
                                  return;
                                });                      
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                });
              } else {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "500px",
                  data: {
                    message: "The product(s) in your cart is no longer available and can not be ordered. Please go back and choose other product(s)",
                    title:
                      "NOTIFICATION",
                    colorButton: false
                  },
                });

                dialogNotifi.afterClosed().subscribe(data =>
                {
                  this.active = false;
                  this.buttonName = "Buy NAEP Package";
                  return;
                });
              }
            }
          }
        )
      } else {
        this.active = true;
        this.buttonName = "Processing...";
        this.router.navigate(["/advisor-earning-program/select-package-naep"], {queryParams: {uuid: this.packageSelect.uuid}})
      }
    } else {
      return;
    }
  }
}

