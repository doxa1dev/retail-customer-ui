import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MyProfile } from 'app/core/models/my-profile.model';
import { addToCartNewNaep } from 'app/core/models/naep.model';
import { NaepPackage } from 'app/core/models/product.model';
import { CartService } from 'app/core/service/cart.service';
import { SharedService } from 'app/core/service/commom/shared.service';
import { MyProfileService } from 'app/core/service/my-profile.service';
import { NaepService } from 'app/core/service/naep.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { DialogConfirmNaepComponent } from 'app/main/common-component/dialog-confirm-naep/dialog-confirm-naep.component';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { environment } from 'environments/environment';
import { SwiperOptions } from 'swiper';
import * as jwt_decode from 'jwt-decode';
import { DialogSelectAdvisorComponent } from '../dialog-select-advisor/dialog-select-advisor.component';
import { DialogCommonButtonComponent } from 'app/main/common-component/dialog-common-button/dialog-common-button.component';

@Component({
  selector: 'app-buy-package-naep-improve',
  templateUrl: './buy-package-naep-improve.component.html',
  styleUrls: ['./buy-package-naep-improve.component.scss']
})
export class BuyPackageNaepImproveComponent implements OnInit {

  listNaepPackage = [];
  naepPackageDetail = new NaepPackage(); 
  // naepPackageActive: any;
  buttonName = 'Buy Now';
  active: boolean = false;
  storeUrl = environment.storageUrl;
  pricePackage: number = 0;
  packageId: string;
  total_product: number;
  token: string;
  is_anomynous_account: boolean = false;
  decoded: any;
  advisorID: string;
  contact_id : string;
  email_naep : string;
  swiperOptions: SwiperOptions = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      0: {
        slidesPerView: 3
      },
      400: {
        slidesPerView: 3
      },
      740: {
        slidesPerView: 4
      },
      940: {
        slidesPerView: 4
      }
    }
  }

  constructor(private naepService: NaepService,
    private router: Router,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private cart: CartService,
    private myProfileService: MyProfileService,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe((params) => {
        this.token = params.token;

        if (!CheckNullOrUndefinedOrEmpty(this.token)) {
          this.naepService.decodeTokenFromEmail(this.token).subscribe( data => {
            console.log(data,'thach')
            if(data.code === 200) {
              this.contact_id = data.data.contact_id;
              this.email_naep = data.data.email;
              const dialogRef = this.dialog.open(DialogConfirmNaepComponent, {
                disableClose: true,
                width: "550px",
                data: {
                  title: "Want to Turn Your Passion into Income?",
                  confirmMessage: `Build Your Thermomix® Business Together With ${data.data.advisor_name}, Advisor ID: ${data.data.advisor_id}`,
                  buttonLeftText: "Yes!",
                  buttonRightText: "Incorrect Recruiter"
                },
              });


              dialogRef.afterClosed().subscribe(check => {
                if (check === 'left') {
                  this.advisorID = data.data.advisor_id;
                  dialogRef.close();
                } else {
                  this.router.navigateByUrl('/store');
                }
              })
            }
          });
        } else {

          this.naepService.getListInviteAdvisor().subscribe(data => {
            if (data.length === 1) {
              const dialogRef = this.dialog.open(DialogConfirmNaepComponent, {
                disableClose: true,
                width: "550px",
                data: {
                  title: "Want to Turn Your Passion into Income?",
                  confirmMessage: `Build Your Thermomix® Business Together With ${data[0].recruiterCustomer.firt_name}, Advisor ID: ${data[0].recruiterCustomer.advisor_id_number}`,
                  buttonLeftText: "Yes!",
                  buttonRightText: "Incorrect Recruiter"
                },
              });

              dialogRef.afterClosed().subscribe(check => {
                if (check === 'left') {
                  this.advisorID = data[0].recruiterCustomer.advisor_id_number;
                  dialogRef.close();
                } else {
                  this.router.navigateByUrl('/store');
                }
              })

            } else {

              const dialogNotifi = this.dialog.open(DialogSelectAdvisorComponent, {
                disableClose: true,
                width: "500px",
                data: {
                  message:"You have been recruited by multiple Advisors. Please select the Advisor you would prefer to be your Recruiter.",
                  title:
                    "CHOOSE RECRUITER",
                  dataAdvisor: data
                },
              });

              dialogNotifi.afterClosed().subscribe(data => {
                if (!CheckNullOrUndefinedOrEmpty(data)) {
                  this.advisorID = data;
                }
              })
            }
          })
        }
      });
    }

  ngOnInit(): void {

    this.token =  localStorage.getItem('token');
    if(CheckNullOrUndefinedOrEmpty(this.token)){
      this.total_product = 0;
    } else {

      this.cart.getCartByCustomerId().subscribe((data) => {
        if (!CheckNullOrUndefinedOrEmpty(data)) {
          if (data === undefined) {
            this.total_product = 0;
          } else {
            this.total_product = data.cartItems.length;
          }
        }
      });
      this.myProfileService.getProfile().subscribe((response) => {
        if (response.code === 200) {
          const myProfile: MyProfile = response.userProfileData;
          this.is_anomynous_account = myProfile.is_anomynous_account
        }
      });
    }

    this.getNaepPackages();
  }

  onShowNaepPackage(uuid) {
    this.getNaepPackageDetail(uuid);
  }

  getNaepPackages() {
    this.naepService.getNaepPackagesV3().subscribe(data => {
      this.listNaepPackage = data;
      this.getNaepPackageDetail(this.listNaepPackage[0].uuid);
    })
  }

  getNaepPackageDetail(uuid) {
    this.naepService.getNaepPackageDetailV3(uuid).subscribe(data => {
      this.naepPackageDetail = data;
      this.packageId = this.naepPackageDetail.id;
      this.getPricePackage(data);
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
    if (CheckNullOrUndefinedOrEmpty(this.token) || (this.is_anomynous_account &&  this.total_product == 0)) {
      const dialogRef = this.dialog.open(DialogConfirmNaepComponent, {
        disableClose: true,
        width: "550px",
        data: {
          title: "SELECT BELOW TO CONTINUE",
          buttonLeftText: "NEW CUSTOMER",
          buttonRightText: "MEMBER LOG IN"
        },
      });

      dialogRef.afterClosed().subscribe(isCheck => {
        if (isCheck === 'left') {
          this.router.navigate(['/register'], {queryParams: {returnUrl: this.router.url,contact_id : this.contact_id, email_naep :this.email_naep}});

        } else if (isCheck === 'right') {
          this.router.navigate(['/login'], {queryParams: {returnUrl: this.router.url}});
        }
      })

      return;
    }

    if (this.naepPackageDetail.id != undefined) {
      //API check isvalid package

      let checkProperties = this.naepPackageDetail.naepItem.filter(product => product.is_have_properties === true);

      const dialogNotifi = this.dialog.open(DialogCommonButtonComponent, {
        disableClose: true,
        width: "550px",
        data: {
          title: "New Advisor Earning Program",
          buttonText: "YES",
          buttonColor: true,
          messageTermsConditions: true
        },
      });

      // const dialogNotifi = this.dialog.open(DialogConfirmNaepComponent, {
      //   disableClose: true,
      //   width: "550px",
      //   data: {
      //     title: "New Advisor Earning Program",
      //     buttonLeftText: "Agree",
      //     buttonRightText: "Not Agree",
      //     messageTermsConditions: true
      //   },
      // });

      dialogNotifi.afterClosed().subscribe(isCheck => {
        if (isCheck) {
          if (checkProperties.length === 0) {

            this.active = true;
            this.buttonName = "Processing...";
    
            let naep = new addToCartNewNaep();
            naep.package_id = Number(this.naepPackageDetail.id);
            naep.deposit = [];
            naep.advisor_id = Number(this.advisorID);
    
            this.naepService.checkCustomerValidToBuyPackage(this.advisorID).subscribe(checkPackage => {
              if (checkPackage.code === 200) {
                
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
                            
                             this.router.navigate(["/check-out-improve"]);  
                                     
                          } else if (data.code === 201){
                
                            let cartId = data.data.id;
                            this.active = false;
                            this.buttonName = "Buy Package";
                  
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
                
                                         this.router.navigate(["/check-out-improve"]);
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
                          this.buttonName = "Buy Package";
                          return;
                        });
                      }
                    }
                  }
                )
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
                    colorButton: false
                  },
                });
                dialogNotifi.afterClosed().subscribe(data=>{
                  this.router.navigate(['/store'])
                })
              }
            })
    
          } else {
            this.active = true;
            this.buttonName = "Processing...";
            this.router.navigate(["/advisor-earning-program/select-package-naep"], {queryParams: {uuid: this.naepPackageDetail.uuid, advisorId: this.advisorID}})
          }
        }
      }) 

    } else {
      return;
    }
  }
}
