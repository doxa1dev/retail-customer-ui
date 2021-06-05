import { Product } from 'app/core/models/product.model';
import { Component, OnInit } from '@angular/core';
import { Title } from 'app/core/enum/title';
import { NaepService } from 'app/core/service/naep.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'app/core/service/commom/shared.service';
import { addToCartNaep, addToCartNewNaep, DepositProduct } from 'app/core/models/naep.model';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CartService } from "app/core/service/cart.service";
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';

export class PROPERTY {
  name: string;
  value: ArrayProperties[];
}

export class ArrayProperties {
  value: string;
  label: string;
}

export class PRODUCT{
  name : string;
  properties : PROPERTY[];
  id : number;
  has_advisor : boolean;
  is_naep_discount_product : boolean;
}
export class MODEL{
  name : string;
  value : string;
}

@Component({
  selector: 'app-select-package-naep',
  templateUrl: './select-package-naep.component.html',
  styleUrls: ['./select-package-naep.component.scss']
})
export class SelectPackageNaepComponent implements OnInit {

  
  modelGroups1 = [];
  modelGroups2 = [];
  title = Title.LEFT;
  listLanguage: [];
  listColor: [];
  // option: Number;
  listProduct: PRODUCT[] =[];
  propertiesArray: PROPERTY[] = [];
  total_product : number;
  submitted : boolean = false;
  total_properties : number = 0;
  buttonName: string = "Buy NAEP Package";
  active: boolean = false;
  packageUuid: string;
  packageId: number;
  advisorId: string;

  constructor(
    private naepService: NaepService,
    public activatedRoute: ActivatedRoute,
    public  dialog    : MatDialog,
    private sharedService: SharedService,
    private router: Router,
    private cart: CartService
    ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.packageUuid = params.uuid;
      this.advisorId = params.advisorId;
    })

    this.naepService.getNaepPackageDetail(this.packageUuid).subscribe(
      data => {

        if (data.listDepositProperties.length > 0) {
          this.packageId = data.naepPackageId;
          
          data.listDepositProperties.forEach(element => {
            let product = new PRODUCT();
            product.id = element.product.id;
            product.name = element.product.product_name;
            product.properties = [];
            product.has_advisor = element.product.has_advisor;
            // product.is_naep_discount_product = element.is_naep_discount_product

            let size = Object.keys(element.product.properties).length;
            if(size > 0){
              for (let key in  element.product.properties)
              {
                let value =  element.product.properties[key];
                let property = new PROPERTY();
                property.name = key;
                property.value = [];

                value.forEach(element =>
                {
                  property.value.push({ value: element, label: element })
                })

                product.properties.push(property);
              }
            }
            this.total_properties += product.properties.length;
            this.listProduct.push(product)
          });
        }
      }
    )

    // this.naepService.getDataNaepProductOptions(this.option).subscribe(
    //   data => {
    //     if (data.length > 0) {
    //       data.forEach(element => {
    //         let product = new PRODUCT();
    //         product.name = element.product.product_name;
    //         product.properties = [];
    //         product.has_advisor = element.product.has_advisor;
    //         product.id = element.product.id;
    //         product.is_naep_discount_product = element.is_naep_discount_product
    //         let size = Object.keys(element.product.properties).length;
    //         if(size > 0){
    //           for (let key in  element.product.properties)
    //           {
    //             let value =  element.product.properties[key];
    //             let property = new PROPERTY();
    //             property.name = key;
    //             property.value = [];
    //             value.forEach(element =>
    //             {
    //               property.value.push({ value: element, label: element })
    //             })
    //             product.properties.push(property);
    //           }
    //         }
    //         this.total_properties += product.properties.length;
    //         this.listProduct.push(product)
    //       });
    //     }      
    //   }
    // )
  }

  // addToCartNaep() {
  //   this.submitted = true;

  //   if(this.modelGroups1.length < this.total_properties )
  //   {
  //     return;
  //   }
  //   if(this.listProduct.length === 1)
  //   {
  //     let addNaepCart = [];
  //     let product = new addToCartNaep()
  //     product.product_id = this.listProduct[0].id;
  //     product.properties = {};
  //     for(let i = 0; i < this.listProduct[0].properties.length ; i++)
  //     {
  //       product.properties[this.listProduct[0].properties[i].name] = this.modelGroups1[i]
  //     }
  //     product.has_advisor = this.listProduct[0].has_advisor;
  //     addNaepCart.push(product)
  //     this.naepService.CreateCartNaep(addNaepCart).subscribe(data=>{
  //       if(data.code === 200){
  //         this.sharedService.sharedMessage.subscribe(
  //           (message) => (this.total_product = message)
  //         );
  //         this.sharedService.nextCart(this.total_product + 1);
  //         this.active = true;
  //         this.buttonName = "Processing...";
  //         this.router.navigate(['/advisor-earning-program/buy-packet-naep-success'])
  //       }
  //       else{
  //         const dialogNotifi = this.dialog.open(CommonDialogComponent, {
  //           width: "500px",
  //           data: {
  //             message:data.data,
  //             title:
  //               "NOTIFICATION",
  //             colorButton: false
  //           },
  //         });
  //         dialogNotifi.afterClosed().subscribe(data =>
  //         {
  //           return;
  //         })
  //       }
  //     })
  //   }else if(this.listProduct.length === 2)
  //   {
  //     let addNaepCart = [];
  //     this.listProduct.forEach((element,index)=>{
  //       let product = new addToCartNaep()
  //       product.product_id = element.id;
  //       product.properties = {};
  //       for(let i = 0; i < this.listProduct[index].properties.length ; i++)
  //       {
  //         product.properties[this.listProduct[index].properties[i].name] = this.modelGroups1[2*index + i]
  //       }
  //       product.has_advisor = element.has_advisor;
  //       product.is_naep_discount_product = element.is_naep_discount_product;
  //       addNaepCart.push(product)
  //     })      
  //     this.naepService.CreateCartNaep(addNaepCart).subscribe(data=>{
  //       if(data.code === 200){
  //         this.sharedService.sharedMessage.subscribe(
  //           (message) => (this.total_product = message)
  //         );
  //         this.sharedService.nextCart(this.total_product + 2);
  //         this.active = true;
  //         this.buttonName = "Processing...";
  //         this.router.navigate(['/advisor-earning-program/buy-packet-naep-success'])
  //       }
  //       else{
  //         const dialogNotifi = this.dialog.open(CommonDialogComponent, {
  //           width: "500px",
  //           data: {
  //             message:data.data,
  //             title:
  //               "NOTIFICATION",
  //             colorButton: false
  //           },
  //         });
  //         dialogNotifi.afterClosed().subscribe(data =>
  //         {
  //           return;
  //         })
  //       }
  //     })
  //   }
  // }

  addToCartNaep() {
    this.submitted = true;

    if(this.modelGroups1.length < this.total_properties )
    {
      return;
    } else {

      let naep = new addToCartNewNaep();
      naep.package_id = this.packageId;
      naep.deposit = [];
      naep.advisor_id = Number(this.advisorId);

      this.active = true;
      this.buttonName = "Processing...";

      this.naepService.checkCustomerValidToBuyPackage(this.advisorId).subscribe(checkPackage => {
        if (checkPackage.code === 200) {
          this.naepService.checkValidPackage(this.packageId).subscribe(
            checknaep => {
              if (checknaep.code === 200 && !CheckNullOrUndefinedOrEmpty(checknaep)) {
                if (checknaep.data) {
    
                  this.listProduct.forEach((element,index)=>{
    
                    let depositProduct = new DepositProduct()
                    depositProduct.product_id = element.id;
                    depositProduct.properties = {};
            
                    for(let i = 0; i < this.listProduct[index].properties.length ; i++)
                    {
                      depositProduct.properties[this.listProduct[index].properties[i].name] = this.modelGroups1[2*index + i]
                    }
            
                    naep.deposit.push(depositProduct)
                  })  
            
                  this.naepService.createNewCartNaep(naep).subscribe( data => {
                    if(data.code === 200){
            
                      this.sharedService.sharedMessage.subscribe(
                        (message) => (this.total_product = message)
                      );
                      this.sharedService.nextCart(this.total_product + 1);
            
                       this.router.navigate(["/check-out-improve"]);
            
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
            
                                  this.active = true;
                                  this.buttonName = "Processing...";
                                   this.router.navigate(["/check-out-improve"]);
                                  
                                  this.sharedService.sharedMessage.subscribe(
                                    (message) => (this.total_product = message)
                                  );
                                  this.sharedService.nextCart(this.total_product + 1);
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
                                  })                      
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
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
            })
        } else {
          this.active = false;
          this.buttonName = "Buy Package";
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            disableClose : true,
            width: "500px",
            data: {
              message: "You don't have permission to join and buy naep package. Please contact your advisor.",
              title:
                "NOTIFICATION",
              colorButton: false,
            },
          });
          dialogNotifi.afterClosed().subscribe(data=>{
            this.router.navigate(['/store'])
          })
        }
      })
    }
  } 
}


