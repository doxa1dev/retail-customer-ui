import { Component, OnInit } from '@angular/core';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Title} from 'app/core/enum/title';
import { NAEPStatus, RecruitEnum} from 'app/core/enum/recruit';
import { NaepService} from 'app/core/service/naep.service';
import { Naep} from 'app/core/models/naep.model';
import { ActivatedRoute, Router} from '@angular/router'
import * as moment from "moment";
import * as jwt_decode from 'jwt-decode';
import { MatDialog } from '@angular/material/dialog';
import { environment } from "environments/environment";
import { SharedService } from 'app/core/service/commom/shared.service';
import { CartService } from 'app/core/service/cart.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DialogCommonNaepComponent } from 'app/main/common-component/dialog-common-naep/dialog-common-naep.component';
import { DialogSelectAdvisorComponent } from '../dialog-select-advisor/dialog-select-advisor.component';
import { DialogPropertiesComponent } from '../dialog-properties/dialog-properties.component';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { DialogConfirmNaepComponent } from 'app/main/common-component/dialog-confirm-naep/dialog-confirm-naep.component';
import { DialogCommonButtonComponent } from 'app/main/common-component/dialog-common-button/dialog-common-button.component';

@Component({
  selector: 'app-naep-improve',
  templateUrl: './naep-improve.component.html',
  styleUrls: ['./naep-improve.component.scss']
})
export class NaepImproveComponent implements OnInit {

  title = Title.DOT;
  sale_in_process = NAEPStatus.PROCESS;
  sale_completed = NAEPStatus.COMPLETED;
  sale_failed = NAEPStatus.FAILED;
  dataReturn : Naep;
  recruit_status_pending  = RecruitEnum.PENDING;
  recruit_status_approved = RecruitEnum.APPROVED;
  recruit_status_rejected = RecruitEnum.REJECTED;
  total : number;
  timeTo45Days ;
  timeToEndDays : number;
  FastAndFuriusDay: Date ;
  token : string;
  decoded: any;
  // is_recruit : boolean;
  dataAdvisor: Naep;
  buttonName = "Apply for New Advisor Earning Program";
  active: boolean = false;
  buttonNameNAEP = "Click Here to fill in the NAEP Induction Form"
  storageUrl = environment.storageUrl;
  checkNaepType: boolean = false;
  dataNaepTypeSort = [];
  daysLeftEndDay: number = 0;
  companyName = environment.companyInfo.id;

  buttonMakePayment = "MAKE PAYMENT"; 
  activeMakePayment: boolean = false;
  total_product : number = 0;

  buttonPurchase = "PURCHASE"; 
  activePurchase: boolean = false;

  buttonGetReward = "GET REWARD"; 
  activeGetReward: boolean = false;

  constructor(private naepService : NaepService,
    private router : Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private sharedService: SharedService,
    private cart: CartService) {

      this.activatedRoute.queryParams.subscribe((params) => {
        this.token = params.token;
      });
    }

  ngOnInit(): void {
    this.checkEnable();

    if(!CheckNullOrUndefinedOrEmpty(this.token))
    {
      this.naepRenderData()

      // this.naepService.decodeTokenFromEmail(this.token).subscribe(data=>{
      //   if(data.code === 200)
      //   {
      //     let dataToken = data.data;
      //     if(dataToken.is_register == false )
      //     {
      //       this.router.navigate(["/register"],{queryParams : {email_naep : dataToken.email,returnUrl : 'advisor-earning-program',contact_id : dataToken.contact_id}});
      //     }else if(dataToken.is_register && dataToken.is_active == false)
      //     {
      //       this.router.navigate(["/login"]);
      //     }else if(dataToken.is_register && dataToken.is_active)
      //     {
      //       // 
      //       let token = localStorage.getItem('token');      
      //       if(CheckNullOrUndefinedOrEmpty(token))
      //       {
      //         this.router.navigate(["/login"],{queryParams : {returnUrl : 'advisor-earning-program'}});
      //       } else{
      //         this.decoded = jwt_decode(token); 
      //         if(this.decoded.email === dataToken.email)
      //         {
      //           this.naepRenderData()
      //         }else
      //         {
      //           this.router.navigate(["/login"],{queryParams : {returnUrl : 'advisor-earning-program'}});
      //         }
      //       }  
            
      //     }
      //   }
      // })
    }
    else{
      this.naepRenderData()
    }
  }

  checkEnable(){
    let token = localStorage.getItem('token');
    if(!CheckNullOrUndefinedOrEmpty(token)){
        this.naepService.checkRecruitment().subscribe( data => {
            if(data === true)
            {
              return;
            }else{
              this.router.navigate(["/login"]);
            }
        })
 
    } else {
      this.router.navigate(["/login"]);
    }
  }
  gotoProductdetail(uuid : string)
  {
    this.router.navigate(['/product-detail'],{queryParams  : {id: uuid}})
  }

  naepRenderData()
  {
    this.naepService.getNewAdvisorEarningProgram().subscribe((data)=>{

      this.dataReturn = data;
      
      if (!this.dataReturn.is_active && this.dataReturn.status != 'SUBMIT') {

        const dialogRef = this.dialog.open(DialogCommonButtonComponent, {
          disableClose: true,
          width: "550px",
          data: {
            title: "Verify Phone and Email",
            buttonText: "NOW",
            buttonColor: true
          },
        });
        // const dialogRef = this.dialog.open(DialogConfirmNaepComponent, {
        //   disableClose: true,
        //   width: "550px",
        //   data: {
        //     title: "Verify Phone and Email",
        //     buttonLeftText: "NOW",
        //     buttonRightText: "LATER"
        //   },
        // });
  
        dialogRef.afterClosed().subscribe(isCheck => {
          if (isCheck) {
            this.router.navigate(["/my-profile"]);
          } else {
            this.router.navigate(['/store']);
          }
        })

      } else if (!this.dataReturn.is_answer && this.dataReturn.status != 'SUBMIT') {

        const dialogNotifi = this.dialog.open(DialogCommonButtonComponent, {
          disableClose: true,
          width: "500px",
          data: {
            title: "Start Churning Your Income Now",
            message: "Fill in your Business details.",
            buttonText: "OK",
            buttonColor: true
          },
        });
        // const dialogNotifi = this.dialog.open(DialogCommonNaepComponent, {
        //   disableClose: true,
        //   width: "500px",
        //   data: {
        //     title: "Start Churning Your Income Now",
        //     message: "Fill in your Business details.",
        //     buttonText: "OK",
        //     buttonColor: true
        //   },
        // });

        dialogNotifi.afterClosed().subscribe(check => {
          if (check) {
            this.router.navigate(["/advisor-earning-program/apply-new-advior-earning-program"]);
          } 
        })
      }

      if (this.dataReturn.status != "SUBMIT") {

        if (this.dataReturn.naepType.length === 1) {
          this.checkNaepType = true;

          let now = moment(moment(new Date()).format("YYYY-MM-DD"), "YYYY-MM-DD");
          let endDay = moment(moment(this.dataReturn.end_time).format("YYYY-MM-DD"), "YYYY-MM-DD");
          this.daysLeftEndDay = moment.duration(endDay.diff(now)).asDays();

        } else {
          this.checkNaepType = false;

          let type = this.dataReturn.naepType
            .sort((a, b) => b.periodLength - a.periodLength);

          let valueMax = Math.max.apply(Math, type.map(data => data.periodLength));
          this.dataNaepTypeSort = type.filter(naep => naep.periodLength < valueMax);

          let data = [];

          this.dataNaepTypeSort.forEach(item => {
            let now = moment(moment(new Date()).format("YYYY-MM-DD"), "YYYY-MM-DD");
            let endDay = moment(moment(this.dataReturn.end_time).format("YYYY-MM-DD"), "YYYY-MM-DD");
            this.daysLeftEndDay = moment.duration(endDay.diff(now)).asDays();
            let naepDay = new NaepDay();
            
            naepDay.name = item.name;
            // naepDay.dateNaep = endDay.subtract(Number(item.periodLength), 'days').format("YYYY-MM-DD");
            naepDay.dateNaep = moment(item.endDay).format("YYYY-MM-DD");
            
            let datePeriod = moment(moment(naepDay.dateNaep).format("YYYY-MM-DD"), "YYYY-MM-DD");
            naepDay.daysLeft = moment.duration(datePeriod.diff(now)).asDays();
  
            data.push(naepDay)
          })
  
          this.dataNaepTypeSort = data;
        }

        if(this.dataReturn.is_answer_question)
        {
          this.buttonNameNAEP = 'Click Here to view in the NAEP Induction Form';
        }
        else{
          this.buttonNameNAEP = 'Click Here to fill in the NAEP Induction Form';
        }
      }




      // this.FastAndFuriusDay = new Date(moment(new Date(this.dataReturn.start_time)).add(45,'days').toString());
      // let end45days   =   moment(moment(this.FastAndFuriusDay).format("YYYY-MM-DD"), "YYYY-MM-DD");
      // let completedDays = moment(moment(this.dataReturn.end_time).format("YYYY-MM-DD"), "YYYY-MM-DD");

      

      // this.timeTo45Days = moment.duration(end45days.diff(now)).asDays();
      // this.timeToEndDays = moment.duration(completedDays.diff(now)).asDays();


    });
    this.naepService.checkIsBuyNaep().subscribe(data=>{
      this.total = data;
      // this.total = 0
    }) 
  }

  goToApplyForm(){
    if(this.dataReturn.is_select_advisor === false)
    {
      this.naepService.getListInviteAdvisor().subscribe(
        data => {
          this.dataAdvisor = data;
          if (data.length === 1 ) {
            // if(this.dataReturn.status === "SUBMIT")
            // {
              this.router.navigate(["/advisor-earning-program/apply-new-advior-earning-program"], {queryParams: {advisorID: this.dataAdvisor[0].recruiterCustomer.id}})
            // }else if(this.dataReturn.status === "APPLY")
            // {
            //   this.router.navigate(['/advisor-earning-program/buy-packet-naep'])
            // }
          } 
          else {
            const dialogNotifi = this.dialog.open(DialogSelectAdvisorComponent, {
              width: "500px",
              data: {
                message:"You have been recruited by multiple Advisors. Please select the Advisor you would prefer to be your Recruiter.",
                title:
                  "CHOOSE RECRUITER",
                dataAdvisor: this.dataAdvisor
              },
            });
          }
        }
      )
    } 
    else
    {
      this.router.navigate(['/advisor-earning-program/buy-packet-naep'])
    }
  }

  goToNaepForm()
  {
    if(this.dataReturn.is_answer_question) {
      this.router.navigate(['/advisor-earning-program/form-view'])
    } else {
      this.router.navigate(['/advisor-earning-program/induction-form-one'])
    }
  }

  viewTermsConditions() {
    if (this.companyName === 'SG') {
      let url = this.router.serializeUrl(this.router.createUrlTree(['naep-terms-conditions-sg']));
      window.open(url, '_blank');
    } else if (this.companyName === 'MY') {
      let url = this.router.serializeUrl(this.router.createUrlTree(['naep-terms-conditions-my']))
      window.open(url, '_blank')
    }
  }

  getGift(dataGift) {
    this.buttonGetReward = "Processing...";
    this.activeGetReward = true;

    if (!CheckNullOrUndefinedOrEmpty(dataGift)) {
      if (!CheckNullOrUndefinedOrEmpty(dataGift.properties)) {
        const dialogNotifi = this.dialog.open(DialogPropertiesComponent, {
          disableClose: true,
          width: "500px",
          data: {
            properties: dataGift.properties,
            image: dataGift.imageProduct,
            name: dataGift.nameProduct,
            price: 0,
            currency: this.dataReturn.currency
          },
        });

        dialogNotifi.afterClosed().subscribe( dataDialog => {
          if (!CheckNullOrUndefinedOrEmpty(dataDialog)) {
            let createRedemptionGiftCartDto = new CreateRedemptionGiftCartDto();
            createRedemptionGiftCartDto.product_id = Number(dataGift.productId);
            createRedemptionGiftCartDto.sale_type_id = Number(dataGift.saleTypeId);
            createRedemptionGiftCartDto.properties = dataDialog.data;

            this.naepService.createCartGiftNaep(createRedemptionGiftCartDto).subscribe( data => {
              if (data.code === 200) {
                this.sharedService.sharedMessage.subscribe(
                  (message) => (this.total_product = message)
                );
                this.sharedService.nextCart(this.total_product + 1);
                
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "500px",
                  data: {
                    message: data.data,
                    title:
                      "NOTIFICATION",
                    colorButton: false
                  },
                });

                // let index = this.dataReturn.naepType.findIndex(element=>{
                //   return element.saleTypeId == dataGift.saleTypeId
                // })
                // this.dataReturn.naepType.splice(index, 1);
              this.dataReturn.gift = null;
                

                this.buttonGetReward = "GET REWARD";
                this.activeGetReward = false;
              
              } else if (data.code === 201) {
                this.buttonGetReward = "GET REWARD";
                this.activeGetReward = false;
                let cartId = data.data.id;
              
                const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
                  width: "550px",
                  data: {
                    message: "Redemption package cannot be ordered with other products. Do you wish to empty your current cart first?",
                  },
                });
              
                dialogRef.afterClosed().subscribe( check => {
                  if (check) {
                    this.buttonGetReward = "Processing...";
                    this.activeGetReward = true;
                  
                    this.cart.deleteCartByCartId(cartId).subscribe( eCart => {
                      if (eCart.code === 200) {
    
                        this.sharedService.sharedMessage.subscribe(
                          (message) => (this.total_product = message)
                        );
                        this.sharedService.nextCart(0);
                        
                        this.naepService.createCartGiftNaep(createRedemptionGiftCartDto).subscribe( data => {
                          if (data.code === 200) {
                            this.sharedService.sharedMessage.subscribe(
                              (message) => (this.total_product = message)
                            );
                            this.sharedService.nextCart(this.total_product + 1);
                            
                            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                              width: "500px",
                              data: {
                                message: data.data,
                                title:
                                  "NOTIFICATION",
                                colorButton: false
                              },
                            });
    
                            let index = this.dataReturn.naepType.findIndex(element=>{
                              return element.saleTypeId == dataGift.saleTypeId
                            })
                            this.dataReturn.naepType.splice(index, 1);

                            this.buttonGetReward = "GET REWARD";
                            this.activeGetReward = false;
                          
                          } else {
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
            })

          } else {
            this.buttonGetReward = "GET REWARD";
            this.activeGetReward = false;
          }
        })

      } else {

        let createRedemptionGiftCartDto = new CreateRedemptionGiftCartDto();
        createRedemptionGiftCartDto.product_id = Number(dataGift.productId);
        createRedemptionGiftCartDto.sale_type_id = Number(dataGift.saleTypeId);
        createRedemptionGiftCartDto.properties = {};

        this.naepService.createCartGiftNaep(createRedemptionGiftCartDto).subscribe( data => {
          if (data.code === 200) {
            this.sharedService.sharedMessage.subscribe(
              (message) => (this.total_product = message)
            );
            this.sharedService.nextCart(this.total_product + 1);
            
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: data.data,
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });

            // let index = this.dataReturn.naepType.findIndex(element=>{
            //   return element.saleTypeId == dataGift.saleTypeId
            // })
            // this.dataReturn.naepType.splice(index, 1);
            this.dataReturn.gift = null;
          
            this.buttonGetReward = "GET REWARD";
            this.activeGetReward = false;
          
          } else if (data.code === 201) {
            this.buttonGetReward = "GET REWARD";
            this.activeGetReward = false;
            let cartId = data.data.id;
          
            const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
              width: "550px",
              data: {
                message: "Redemption package cannot be ordered with other products. Do you wish to empty your current cart first?",
              },
            });
          
            dialogRef.afterClosed().subscribe( check => {
              if (check) {
                this.buttonGetReward = "Processing...";
                this.activeGetReward = true;
              
                this.cart.deleteCartByCartId(cartId).subscribe( eCart => {
                  if (eCart.code === 200) {

                    this.sharedService.sharedMessage.subscribe(
                      (message) => (this.total_product = message)
                    );
                    this.sharedService.nextCart(0);
                    
                    this.naepService.createCartGiftNaep(createRedemptionGiftCartDto).subscribe( data => {
                      if (data.code === 200) {
                        this.sharedService.sharedMessage.subscribe(
                          (message) => (this.total_product = message)
                        );
                        this.sharedService.nextCart(this.total_product + 1);
                        
                        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                          width: "500px",
                          data: {
                            message: data.data,
                            title:
                              "NOTIFICATION",
                            colorButton: false
                          },
                        });

                        let index = this.dataReturn.naepType.findIndex(element=>{
                          return element.saleTypeId == dataGift.saleTypeId
                        })
                        this.dataReturn.naepType.splice(index, 1);
                        
                        this.buttonGetReward = "GET REWARD";
                        this.activeGetReward = false;
                      
                      } else {
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
        })
      }
    }
  }

  makePayment() {
    this.buttonMakePayment = "Processing...";
    this.activeMakePayment = true;
    let createRedemptionRefundCart = new CreateRedemptionRefundCart();
    createRedemptionRefundCart.product_id = Number(this.dataReturn.product_id);
    createRedemptionRefundCart.redemption_price = this.dataReturn.priceRefund;

    this.naepService.newCreateCartByRefundProduct(createRedemptionRefundCart).subscribe( data => {
      if (data.code === 200) {
        this.sharedService.sharedMessage.subscribe(
          (message) => (this.total_product = message)
        );
        this.sharedService.nextCart(this.total_product + 1);

        this.dataReturn.refund_status = 'PENDING';
        this.dataReturn.is_refund = false;

        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message: data.data,
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });

        this.buttonMakePayment = "MAKE PAYMENT";
        this.activeMakePayment = false;

      } else if (data.code === 201) {
        this.buttonMakePayment = "MAKE PAYMENT";
        this.activeMakePayment = false;
        let cartId = data.data.id;

        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
          width: "550px",
          data: {
            message: "Redemption package cannot be ordered with other products. Do you wish to empty your current cart first?",
          },
        });

        dialogRef.afterClosed().subscribe( check => {
          if (check) {
            this.buttonMakePayment = "Processing...";
            this.activeMakePayment = true;

            this.cart.deleteCartByCartId(cartId).subscribe( eCart => {
              if (eCart.code === 200) {
                
                this.sharedService.sharedMessage.subscribe(
                  (message) => (this.total_product = message)
                );
                this.sharedService.nextCart(0);

                this.naepService.newCreateCartByDiscountProduct(createRedemptionRefundCart).subscribe( data => {
                  if (data.code === 200) {
                    this.sharedService.sharedMessage.subscribe(
                      (message) => (this.total_product = message)
                    );
                    this.sharedService.nextCart(this.total_product + 1);

                    this.dataReturn.refund_status = 'PENDING';
                    this.dataReturn.is_refund = false;

                    const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                      width: "500px",
                      data: {
                        message: data.data,
                        title:
                          "NOTIFICATION",
                        colorButton: false
                      },
                    });
                    
                    this.buttonMakePayment = "MAKE PAYMENT";
                    this.activeMakePayment = false;

                  } else {
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

          } else {
            this.buttonMakePayment = "MAKE PAYMENT";
            this.activeMakePayment = false;
          }
        })
      }
    })
  }

  purchase() {
    this.buttonPurchase = "Processing...";
    this.activePurchase = true;

    if (!CheckNullOrUndefinedOrEmpty(this.dataReturn.payback_product)) {
      if (!CheckNullOrUndefinedOrEmpty(this.dataReturn.payback_product.properties)) {
        const dialogNotifi = this.dialog.open(DialogPropertiesComponent, {
          disableClose: true,
          width: "500px",
          data: {
            properties: this.dataReturn.payback_product.properties,
            image: this.dataReturn.payback_product.image,
            name: this.dataReturn.payback_product.productName,
            price: this.dataReturn.priceRefund,
            currency: this.dataReturn.currency
          },
        });
    
        dialogNotifi.afterClosed().subscribe( dataDialog => {

          if (!CheckNullOrUndefinedOrEmpty(dataDialog)) {
            let createRedemptionDiscountCartDto = new CreateRedemptionDiscountCartDto();
            createRedemptionDiscountCartDto.product_id = Number(this.dataReturn.payback_product.id);
            createRedemptionDiscountCartDto.redemption_price = this.dataReturn.priceRefund;
            createRedemptionDiscountCartDto.properties = dataDialog.data;

            this.naepService.newCreateCartByDiscountProduct(createRedemptionDiscountCartDto).subscribe( data => {
              if (data.code === 200) {
                this.sharedService.sharedMessage.subscribe(
                  (message) => (this.total_product = message)
                );
                this.sharedService.nextCart(this.total_product + 1);
                
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "500px",
                  data: {
                    message: data.data,
                    title:
                      "NOTIFICATION",
                    colorButton: false
                  },
                });

                this.dataReturn.refund_status = 'PENDING';
              
                this.buttonPurchase = "PURCHASE";
                this.activePurchase = false;
              
              } else if (data.code === 201) {
                this.buttonPurchase = "PURCHASE";
                this.activePurchase = false;
                let cartId = data.data.id;
              
                const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
                  width: "550px",
                  data: {
                    message: "Redemption package cannot be ordered with other products. Do you wish to empty your current cart first?",
                  },
                });
              
                dialogRef.afterClosed().subscribe( check => {
                  if (check) {
                    this.buttonPurchase = "Processing...";
                    this.activePurchase = true;
                  
                    this.cart.deleteCartByCartId(cartId).subscribe( eCart => {
                      if (eCart.code === 200) {
    
                        this.sharedService.sharedMessage.subscribe(
                          (message) => (this.total_product = message)
                        );
                        this.sharedService.nextCart(0);
                        
                        this.naepService.newCreateCartByDiscountProduct(createRedemptionDiscountCartDto).subscribe( data => {
                          if (data.code === 200) {
                            this.sharedService.sharedMessage.subscribe(
                              (message) => (this.total_product = message)
                            );
                            this.sharedService.nextCart(this.total_product + 1);
                            
                            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                              width: "500px",
                              data: {
                                message: data.data,
                                title:
                                  "NOTIFICATION",
                                colorButton: false
                              },
                            });
    
                            this.dataReturn.refund_status = 'PENDING';
                            this.buttonPurchase = "PURCHASE";
                            this.activePurchase = false;
                          
                          } else {
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

                  } else {
                    this.buttonPurchase = "PURCHASE";
                    this.activePurchase = false;
                  }
                })
              }
            })

          } else {
            this.buttonPurchase = "PURCHASE";
            this.activePurchase = false;
            dialogNotifi.close();
          }
        });
      
      } else {

        let createRedemptionDiscountCartDto = new CreateRedemptionDiscountCartDto();
        createRedemptionDiscountCartDto.product_id = Number(this.dataReturn.payback_product.id);
        createRedemptionDiscountCartDto.redemption_price = this.dataReturn.priceRefund;
        createRedemptionDiscountCartDto.properties = {};

        this.naepService.newCreateCartByDiscountProduct(createRedemptionDiscountCartDto).subscribe( data => {
          if (data.code === 200) {
            this.sharedService.sharedMessage.subscribe(
              (message) => (this.total_product = message)
            );
            this.sharedService.nextCart(this.total_product + 1);
            
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message: data.data,
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
          
            this.dataReturn.refund_status = 'PENDING';
            this.buttonPurchase = "PURCHASE";
            this.activePurchase = false;
          
          } else if (data.code === 201) {
            this.buttonPurchase = "PURCHASE";
            this.activePurchase = false;
            let cartId = data.data.id;
          
            const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
              width: "550px",
              data: {
                message: "Redemption package cannot be ordered with other products. Do you wish to empty your current cart first?",
              },
            });
          
            dialogRef.afterClosed().subscribe( check => {
              if (check) {
                this.buttonPurchase = "Processing...";
                this.activePurchase = true;
              
                this.cart.deleteCartByCartId(cartId).subscribe( eCart => {
                  if (eCart.code === 200) {

                    this.sharedService.sharedMessage.subscribe(
                      (message) => (this.total_product = message)
                    );
                    this.sharedService.nextCart(0);
                    
                    this.naepService.newCreateCartByDiscountProduct(createRedemptionDiscountCartDto).subscribe( data => {
                      if (data.code === 200) {
                        this.sharedService.sharedMessage.subscribe(
                          (message) => (this.total_product = message)
                        );
                        this.sharedService.nextCart(this.total_product + 1);
                        
                        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                          width: "500px",
                          data: {
                            message: data.data,
                            title:
                              "NOTIFICATION",
                            colorButton: false
                          },
                        });

                        this.dataReturn.refund_status = 'PENDING';
                        this.buttonPurchase = "PURCHASE";
                        this.activePurchase = false;
                      
                      } else {
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

              } else {
                this.buttonPurchase = "PURCHASE";
                this.activePurchase = false;
              }
            })
          }
        })
      }
    }
  }
}

export class NaepDay {
  name: string;
  daysLeft: number;
  dateNaep: string;
}

export class CreateRedemptionRefundCart {
  product_id : number;
  redemption_price : number;
}

export class CreateRedemptionDiscountCartDto {
  product_id : number;
  redemption_price : number;
  properties: {};
}

export class CreateRedemptionGiftCartDto {
  product_id : number;
  sale_type_id : number;
  properties: {};
}

