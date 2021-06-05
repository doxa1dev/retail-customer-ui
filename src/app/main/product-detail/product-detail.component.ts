import { DialogLoginNewComponent } from './../common-component/dialog-login-new/dialog-login-new.component';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  SkipSelf,
  Optional,
  Inject
} from "@angular/core";
import { SelectItem } from "primeng/api";
import { NgxGalleryOptions } from "@kolkov/ngx-gallery";
import { NgxGalleryImage } from "@kolkov/ngx-gallery";
import { NgxGalleryAnimation } from "@kolkov/ngx-gallery";
import { ProductService } from "../../core/service/product.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { CartService } from "app/core/service/cart.service";
import { DOCUMENT, Location } from "@angular/common";
import { SharedService } from "app/core/service/commom/shared.service";
import { AutofillMonitor } from "@angular/cdk/text-field";
import { AuthService } from "../../core/service/auth.service";
import { environment } from "environments/environment";
import { TranslateService } from '@ngx-translate/core';
import * as moment from "moment";
import ImageZoom from "js-image-zoom"
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { isNullOrUndefined, isArray, isObject } from "util";
import { CommonDialogComponent } from "../common-dialog/common-dialog.component";
import { MessageService } from 'primeng/api'
import { Title } from 'app/core/enum/title';
import { Advisor} from 'app/core/models/user.model';
import { DialogConfirmComponent} from 'app/main/common-component/dialog-confirm/dialog-confirm.component';
import * as jwt_decode from 'jwt-decode';
import { Product } from 'app/core/models/product.model';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { DialogLoginComponent } from "../common-component/dialog-login/dialog-login.component";
import Swiper, { SwiperOptions } from "swiper";
import SwiperCore, {
  Thumbs, Zoom 
} from 'swiper/core';
import { element } from "protractor";
import { MyProfileService } from 'app/core/service/my-profile.service';
import { MyProfile } from 'app/core/models/my-profile.model';

SwiperCore.use([Thumbs, Zoom])
export class Galery {
  small: string;
  medium: string;
  big: string;
  constructor(small: string, medium: string, big: string) {
    this.small = small;
    this.medium = medium;
    this.big = big;
  }
}
export class PROPERTY
{
  name : string;
  value: ArrayProperties[];
}
export class ArrayProperties{
  value : string;
  label : string;
}
export class Category{
  id : string;
  name : string;
}

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ProductDetailComponent implements OnInit {

  zoomOptions = {
    // zoomWidth: 330,
    fillContainer: true,
    offset: { vertical: 0,horizontal: 10},
    zoomPosition:"original"
    // width: 400,
    // zoomWidth: 500,
    // offset: {vertical: 0, horizontal: 10}
  };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private _location: Location,
    private _cartService: CartService,
    private sharedService: SharedService,
    private _Auth: AuthService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private messageService: MessageService,
    private translateService: TranslateService,
    private myProfileService: MyProfileService,



  ) {
  }  
  // translation
  product_detail_translations;
  lstEnCategory: any[] = [];
  lstZhCategory: any[] = [];
  lstMyCategory: any[] = [];

  // title = Title.;
  modelGroups = [];
  storageUrl = environment.storageUrl;
  languages: SelectItem[] = [];
  selectedlanguage: string;
  productData = {} as any;
  imageUrl = [] as any;
  product_id: string;
  data: any;
  numberProducts: Observable<number>;
  disable = false;
  total_product: number = 0;
  AddToCartForm: FormGroup;
  AdvisorImg = "assets/icons/ICON/UserMenu.svg"
  advisor_user_id: number = null;
  showMessage: boolean;
  showDialog: boolean;
  cart_Id: any;
  maxOrder: number;
  idCartAdvisor: string;
  token: string;
  advisor_uuid: string; 
  is_advisor : boolean = false;
  buttonName:string = "Add to Cart";
  active: boolean = false;
  termandcondition : string;
  propertiesArray: PROPERTY[] = [];
  images  = [] as any;
  hasAdvisor : boolean;
  showTerm : boolean;
  categoryList : Category[] = [];
  // disabledButton : boolean;
  checkbox : boolean = false;
  advisor_get_from_api : Advisor;
  total_buy : number = 0;
  cartData : any; 
  isShowInviteButton: boolean; 
  is_naep_cart : boolean = false;
  is_redemption_cart : boolean = false;
  // galleryImages: Galery[] = [];
  // galleryImagesShow: Galery[] = [];
  decoded
  roleArray : [];
  advisor_invited_uuid : string;
  checkEmailEditVar: boolean;
  // galleryOptions : NgxGalleryOptions[] = [
  //   {
  //     width: "100%",
  //     height: "400px",
  //     thumbnailsColumns: 3,
  //     arrowPrevIcon: "no",
  //     arrowNextIcon: "no",
  //     imageAnimation: NgxGalleryAnimation.Slide,
  //     preview: false,
  //     thumbnailsPercent: 20,
  //     imageSize: 'contain'
  //   },
  //   {
  //     breakpoint: 768,
  //     width: "100%",
  //     height: "400px",
  //     imagePercent: 80,
  //     thumbnailsPercent: 25,
  //     thumbnailsColumns: 4,
  //     thumbnailsMargin: 20,
  //     thumbnailMargin: 20,
  //     imageAnimation: NgxGalleryAnimation.Slide,
  //     preview: false,
  //     thumbnailSize:'contain'
  //   },
  // ];

  swiperOptions: SwiperOptions = {
    // zoom: true,
    slidesPerView: 1,
    breakpoints: {
      0: {
        spaceBetween: 10
      },
      600: {
        spaceBetween: 20
      },
      960: {
        spaceBetween: 50
      },
      1920: {
        spaceBetween: 60
      }
    }
  }

  swiperOptionsThumbs: SwiperOptions = {
    slidesPerView: 3,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    scrollbar: {draggable: true},
    breakpoints: {
      0: {
        spaceBetween: 5
      }
    }
  }

  thumbsSwiper: any;
  galleryImages = [];

  /** translation */
  objEnTranslationProduct: any = {};
  objZhTranslationProduct: any = {};
  objMyTranslationProduct: any = {};
  lstEnTranslationCategory: any[] = [];
  lstZhTranslationCategory: any[] = [];
  lstMyTranslationCategory: any[] = [];
  is_anomynous_account : boolean = false

  ngOnInit() {
    this.AddToCartForm = this._formBuilder.group({
      advisor_id: [""],
      advisor_name: ["", isValidAdvisorID],
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.product_id = params.id;
      this.advisor_uuid = CheckNullOrUndefinedOrEmpty(params.advisor_uuid) ? null : params.advisor_uuid;
    });

    this.productService.getProductDetail(this.product_id).subscribe(
      (response) => {
        if (response.status === 200) {
          this.productData = response.data;
          this.product_detail_translations = response.data.product_detail_translations;
          // set translation details
          for (const translation of this.product_detail_translations) {
            if (translation.language_code === 'en') {
              this.objEnTranslationProduct["PRODUCT_DETAIL"] = {};
              this.objEnTranslationProduct["PRODUCT_DETAIL"][translation.product_id] = {};
              this.objEnTranslationProduct["PRODUCT_DETAIL"][translation.product_id]["TITLE"] = translation.title;
              this.objEnTranslationProduct["PRODUCT_DETAIL"][translation.product_id]["DESCRIPTION"] = translation.description;
            }
            else if (translation.language_code === 'en') {
              this.objZhTranslationProduct["PRODUCT_DETAIL"] = {};
              this.objZhTranslationProduct["PRODUCT_DETAIL"][translation.product_id] = {};
              this.objZhTranslationProduct["PRODUCT_DETAIL"][translation.product_id]["TITLE"] = translation.title;
              this.objZhTranslationProduct["PRODUCT_DETAIL"][translation.product_id]["DESCRIPTION"] = translation.description;
            }
            else if (translation.language_code === 'my') {
              this.objMyTranslationProduct["PRODUCT_DETAIL"] = {};
              this.objMyTranslationProduct["PRODUCT_DETAIL"][translation.product_id] = {};
              this.objMyTranslationProduct["PRODUCT_DETAIL"][translation.product_id]["TITLE"] = translation.title;
              this.objMyTranslationProduct["PRODUCT_DETAIL"][translation.product_id]["DESCRIPTION"] = translation.description;
            }
          }
          
          this.productData.category.forEach(category => {
            category.translations.forEach(translation => {
              if (translation.language.language_code === 'en') {
                let obj = {};
                obj["CategoryId"] = translation.category_id;
                obj["Title"] = translation.translated_title;
                this.lstEnTranslationCategory.push(obj);
              } else if (translation.language.language_code === 'en') {
                let obj = {};
                obj["CategoryId"] = translation.category_id;
                obj["Title"] = translation.translated_title;
                this.lstZhTranslationCategory.push(obj);
              } else if (translation.language.language_code === 'my') {
                let obj = {};
                obj["CategoryId"] = translation.category_id;
                obj["Title"] = translation.translated_title;
                this.lstMyTranslationCategory.push(obj);
              }
            }) 
          })

          // set english language
          if (!isNullOrUndefined(this.objEnTranslationProduct["PRODUCT_DETAIL"])) {
            this.translateService.getTranslation('en').subscribe(() => {
              this.objEnTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
              this.lstEnTranslationCategory.forEach(element => {
                this.objEnTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
              });
              this.translateService.setTranslation('en', this.objEnTranslationProduct, true);
              
              // set chinese language
              if (!isNullOrUndefined(this.objZhTranslationProduct["PRODUCT_DETAIL"])) {
                this.translateService.getTranslation('en').subscribe(() => {
                  this.objZhTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                  this.lstZhTranslationCategory.forEach(element => {
                    this.objZhTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                  });
                  this.translateService.setTranslation('en', this.objZhTranslationProduct, true);
                  // console.log(this.objZhTranslationProduct);
                  // set malay language
                  if (!isNullOrUndefined(this.objMyTranslationProduct["PRODUCT_DETAIL"])) {
                    this.translateService.getTranslation('my').subscribe(() => {
                      this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                      this.lstMyTranslationCategory.forEach(element => {
                        this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                      });
                      this.translateService.setTranslation('my', this.objMyTranslationProduct, true);
                    });
                  } 
                  else if (isNullOrUndefined(this.objMyTranslationProduct["PRODUCT_DETAIL"]) && this.lstMyTranslationCategory.length > 0) {
                    this.objMyTranslationProduct["PRODUCT_DETAIL"] = {};
                    this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id] = {};
                    this.translateService.getTranslation('my').subscribe(() => {

                      this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                      this.lstMyTranslationCategory.forEach(element => {
                        this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                      });
                      this.translateService.setTranslation('my', this.objMyTranslationProduct, true);
                      // console.log(this.objMyTranslationProduct);
                      // set malay language
                        if (!isNullOrUndefined(this.objMyTranslationProduct["PRODUCT_DETAIL"])) {
                          this.translateService.getTranslation('my').subscribe(() => {
                            this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                            this.lstMyTranslationCategory.forEach(element => {
                              this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                            });
                            this.translateService.setTranslation('my', this.objMyTranslationProduct, true);
                          });
                        } 
                        else if (isNullOrUndefined(this.objMyTranslationProduct["PRODUCT_DETAIL"]) && this.lstMyTranslationCategory.length > 0) {
                          this.objMyTranslationProduct["PRODUCT_DETAIL"] = {};
                          this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id] = {};
                          this.translateService.getTranslation('my').subscribe(() => {

                            this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                            this.lstMyTranslationCategory.forEach(element => {
                              this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                            });
                            this.translateService.setTranslation('my', this.objMyTranslationProduct, true);
                          });
                        }
                    });
                  }
                });
              } 
              else if (isNullOrUndefined(this.objZhTranslationProduct["PRODUCT_DETAIL"]) && this.lstZhTranslationCategory.length > 0) {
                this.objZhTranslationProduct["PRODUCT_DETAIL"] = {};
                this.objZhTranslationProduct["PRODUCT_DETAIL"][this.productData.id] = {};
                this.translateService.getTranslation('en').subscribe(() => {

                  this.objZhTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                  this.lstZhTranslationCategory.forEach(element => {
                    this.objZhTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                  });
                  this.translateService.setTranslation('en', this.objZhTranslationProduct, true);
                  
                  // set malay language
                  if (!isNullOrUndefined(this.objMyTranslationProduct["PRODUCT_DETAIL"])) {
                    this.translateService.getTranslation('my').subscribe(() => {
                      this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                      this.lstMyTranslationCategory.forEach(element => {
                        this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                      });
                      this.translateService.setTranslation('my', this.objMyTranslationProduct, true);
                      
                    });
                  } 
                  else if (isNullOrUndefined(this.objMyTranslationProduct["PRODUCT_DETAIL"]) && this.lstMyTranslationCategory.length > 0) {
                    this.objMyTranslationProduct["PRODUCT_DETAIL"] = {};
                    this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id] = {};
                    this.translateService.getTranslation('my').subscribe(() => {

                      this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                      this.lstMyTranslationCategory.forEach(element => {
                        this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                      });
                      this.translateService.setTranslation('my', this.objMyTranslationProduct, true);
                      
                    });
                  }
                });
              }
            });
          } 
          else if (isNullOrUndefined(this.objEnTranslationProduct["PRODUCT_DETAIL"]) && this.lstEnTranslationCategory.length > 0) {
            this.objEnTranslationProduct["PRODUCT_DETAIL"] = {};
            this.objEnTranslationProduct["PRODUCT_DETAIL"][this.productData.id] = {};
            this.translateService.getTranslation('en').subscribe(() => {

              this.objEnTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
              this.lstEnTranslationCategory.forEach(element => {
                this.objEnTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
              });
              this.translateService.setTranslation('en', this.objEnTranslationProduct, true);
              
              // set chinese language
              if (!isNullOrUndefined(this.objZhTranslationProduct["PRODUCT_DETAIL"])) {
                this.translateService.getTranslation('en').subscribe(() => {
                  this.objZhTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                  this.lstZhTranslationCategory.forEach(element => {
                    this.objZhTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                  });
                  this.translateService.setTranslation('en', this.objZhTranslationProduct, true);
                  
                  // set malay language
                  if (!isNullOrUndefined(this.objMyTranslationProduct["PRODUCT_DETAIL"])) {
                    this.translateService.getTranslation('my').subscribe(() => {
                      this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                      this.lstMyTranslationCategory.forEach(element => {
                        this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                      });
                      this.translateService.setTranslation('my', this.objMyTranslationProduct, true);
                      
                    });
                  } 
                  else if (isNullOrUndefined(this.objMyTranslationProduct["PRODUCT_DETAIL"]) && this.lstMyTranslationCategory.length > 0) {
                    this.objMyTranslationProduct["PRODUCT_DETAIL"] = {};
                    this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id] = {};
                    this.translateService.getTranslation('my').subscribe(() => {

                      this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                      this.lstMyTranslationCategory.forEach(element => {
                        this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                      });
                      this.translateService.setTranslation('my', this.objMyTranslationProduct, true);
                      
                    });
                  }
                });
              } 
              else if (isNullOrUndefined(this.objZhTranslationProduct["PRODUCT_DETAIL"]) && this.lstZhTranslationCategory.length > 0) {
                this.objZhTranslationProduct["PRODUCT_DETAIL"] = {};
                this.objZhTranslationProduct["PRODUCT_DETAIL"][this.productData.id] = {};
                this.translateService.getTranslation('en').subscribe(() => {

                  this.objZhTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                  this.lstZhTranslationCategory.forEach(element => {
                    this.objZhTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                  });
                  this.translateService.setTranslation('en', this.objZhTranslationProduct, true);
                  
                  // set malay language
                  if (!isNullOrUndefined(this.objMyTranslationProduct["PRODUCT_DETAIL"])) {
                    this.translateService.getTranslation('my').subscribe(() => {
                      this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                      this.lstMyTranslationCategory.forEach(element => {
                        this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                      });
                      this.translateService.setTranslation('my', this.objMyTranslationProduct, true);
                      
                    });
                  } 
                  else if (isNullOrUndefined(this.objMyTranslationProduct["PRODUCT_DETAIL"]) && this.lstMyTranslationCategory.length > 0) {
                    this.objMyTranslationProduct["PRODUCT_DETAIL"] = {};
                    this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id] = {};
                    this.translateService.getTranslation('my').subscribe(() => {

                      this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"] = {};
                      this.lstMyTranslationCategory.forEach(element => {
                        this.objMyTranslationProduct["PRODUCT_DETAIL"][this.productData.id]["CATEGORY"]["TITLE_" + element["CategoryId"]] = element["Title"];
                      });
                      this.translateService.setTranslation('my', this.objMyTranslationProduct, true);
                      
                    });
                  }
                });
              }
            });
          }

          //create Form 
          this.maxOrder = response.data.max_order_number;



          //Set validator if product has advisor
          if (this.productData.has_advisor) {
            if(!isNullOrUndefined(this.token)){
              this._Auth.getAdvisorByCustomer().subscribe(
                (response)=>{
                  if(!CheckNullOrUndefinedOrEmpty(response)){
                    this.advisor_get_from_api = response;
                    this.AddToCartForm.get("advisor_id").setValue(this.advisor_get_from_api.id);
                    this.AddToCartForm.get("advisor_name").setValue(this.advisor_get_from_api.name);
                    this.AdvisorImg = isNullOrUndefined(this.advisor_get_from_api.avatar) ?   this.AdvisorImg  : this.storageUrl +this.advisor_get_from_api.avatar;
                    this.advisor_invited_uuid = this.advisor_get_from_api.uuid;
                    this.is_advisor = true;
                  }else{
                    if(this.is_advisor == false)
                    {
                      this._Auth.getReferenceAdvisor(this.advisor_uuid).subscribe((response)=>{
                        if(!CheckNullOrUndefinedOrEmpty(response)){
                          this.advisor_get_from_api = response;
                          this.AddToCartForm.get("advisor_id").setValue(this.advisor_get_from_api.id);
                          this.AddToCartForm.get("advisor_name").setValue(this.advisor_get_from_api.name);
                          this.AdvisorImg = isNullOrUndefined(this.advisor_get_from_api.avatar) ?   this.AdvisorImg  : this.storageUrl +this.advisor_get_from_api.avatar;
                        }
                      })
                    }
                  }
                }
              );
            }else{
              if(!CheckNullOrUndefinedOrEmpty(this.advisor_uuid )){
                this._Auth.getReferenceAdvisor(this.advisor_uuid).subscribe((response)=>{
                  if(!CheckNullOrUndefinedOrEmpty(response)){
                    this.advisor_get_from_api = response;
                    this.AddToCartForm.get("advisor_id").setValue(this.advisor_get_from_api.id);
                    this.AddToCartForm.get("advisor_name").setValue(this.advisor_get_from_api.name);
                    this.AdvisorImg = isNullOrUndefined(this.advisor_get_from_api.avatar) ?   this.AdvisorImg  : this.storageUrl +this.advisor_get_from_api.avatar;
                  }
                })
              }
            }
            
          }


          this.termandcondition = response.data.terms_and_conditions_link;
          this.showTerm = (this.termandcondition === undefined || this.termandcondition === null || this.termandcondition === '')
          
          
          let size = Object.keys(this.productData.properties).length;
          if(size > 0){
            for (let key in this.productData.properties)
            {
              let value = this.productData.properties[key];
              let property = new PROPERTY();
              property.name = key;
              property.value = [];
              value.forEach(element =>
              {
                property.value.push({ value: element, label: element })
              })
              this.propertiesArray.push(property);
            }
          }
          

          //Get Category 

          this.productData.category.forEach(cate=>{
            if (cate.is_active === true){
              this.categoryList.push({id  : cate.id, name : cate.category_name})
            }
          });


        }

        
        this.productData.attachments.forEach(element=>{
          if (element.is_deleted === false && element.is_cover_photo === true)
          {
            this.images.push(element)
          }
        })

        this.productData.attachments.forEach(element =>
        {
          if (element.is_deleted === false && element.is_cover_photo === false)
          {
            this.images.push(element)
          }
        })
        
        // this.images.forEach(element=>{
        //   this.galleryImages.push(new Galery(this.storageUrl + element.storage_key, this.storageUrl + element.storage_key, this.storageUrl + element.storage_key))
        // })
        // return this.galleryImagesShow = this.galleryImages;

        this.images.forEach(element => {
          this.galleryImages.push(this.storageUrl + element.storage_key);  
        });
      },

      (err) => console.log(err)
    );

    
    this.token =  localStorage.getItem('token');
    if(!isNullOrUndefined(this.token))
    {
      this.decoded = jwt_decode(this.token);
      this.roleArray = this.decoded.role;
      this.isShowInviteButton = true;

        this.cartService.getCartByCustomerId().subscribe(data=>{
          if (!CheckNullOrUndefinedOrEmpty(data)) {
            this.is_naep_cart = data.is_naep_cart;
            this.is_redemption_cart = data.is_redemption_cart
          } else {
            return;
          }
        })
        
      

      const decoded = jwt_decode(this.token);
      // console.log(decoded)

      const role = decoded.role.indexOf("ADVISOR")
      //check advisor
      if (role === -1) {
        this.isShowInviteButton = false
      }

      this.checkEditEmail();

    } else {
      this.isShowInviteButton = false;
    }

    if(CheckNullOrUndefinedOrEmpty(this.token)){
      this.total_product = 0;
    } else {
      this._cartService.getCartByCustomerId().subscribe((data) => {
        if (!CheckNullOrUndefinedOrEmpty(data)) {
          this.cartData = data;
          this.idCartAdvisor = data.cart_advisor_customer_id;
          this.cart_Id = data.id;
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


  }

  mouseMoveImage() {
    let index = CheckNullOrUndefinedOrEmpty(this.thumbsSwiper.clickedIndex) ? 0 : this.thumbsSwiper.clickedIndex;
    console.log(this.thumbsSwiper.clickedIndex)
    new ImageZoom(document.getElementsByClassName('swiper-image')[index], this.zoomOptions);
    // console.log(document.getElementById("image-zoom"))
    // let mySwiper = new Swiper('.swiper-container', this.swiperOptions);
    // let swiperSlide = document.getElementsByClassName('swiper-image');
    // console.log(mySwiper)
    // mySwiper[0].zoom.in();
    // for(let index = 0; index < swiperSlide.length; index++){
    //   swiperSlide[index].addEventListener('mouseover',function(e){
    //     // this.swiperOptions.zoom.in();

    //     mySwiper[0].zoom.in();
    //   })

    //   swiperSlide[index].addEventListener('mouseout',function(e){
    //     // this.swiperOptions.zoom.in();
    //     mySwiper[0].zoom.out();
    //   })
    // }
  }

  // mouseLeaveImage() {
  //   let mySwiper = new Swiper('.swiper-container', this.swiperOptions);

  //   mySwiper[0].zoom.out();
  // }


  // get transltion
  getTranslation(productId: string, categoryId: string, choosen: number) {
    let key = "PRODUCT_DETAIL.";
    if (choosen === 1) { // get translation product title
      key = key + productId + '.' + 'TITLE'; 
    } else if (choosen === 2) { // get translation product description
      key = key + productId + '.' + 'DESCRIPTION'; 
    } else if (choosen === 3) { // get translation category title of prooduct
      key = key + productId + '.' + 'CATEGORY.' + 'TITLE_' + categoryId; 
    }
    return this.translateService.getStreamOnTranslationChange(key);
  }

  getStaticTranslation(key: string) {
    return this.translateService.getStreamOnTranslationChange(key);
  }

  back() {
    if (!CheckNullOrUndefinedOrEmpty(localStorage.getItem('returnUrl'))) {
      localStorage.removeItem('returnUrl');
      this.router.navigate(["/store"]);
    } else if (!CheckNullOrUndefinedOrEmpty(localStorage.getItem('checkLogin'))) {
      localStorage.removeItem('checkLogin');
      this.router.navigate(["/store"]);
    } 
    else {
      this._location.back();
    }
  }

  continueShopping() {
    this.router.navigate(["/store"]);
  }


  checkiIsHaveInternalDiscount(product : Product)
  {
    if(isNullOrUndefined(this.decoded))
    {
      return false;
    }else{
      if(isNullOrUndefined(product.internal_discount_for))
      {
        return false;
      }else{
        let isDiscount : boolean = false;
        this.roleArray.forEach(role=>{
          if(product.internal_discount_for.includes(role)  && (moment(new Date()).format("YYYY-MM-DD") >= moment(product.internal_discount_start_time).format("YYYY-MM-DD") ) && product.sum < product.max_total_discount){
            isDiscount = true;
          }
        })
        return isDiscount;
      }
    }

  }

  checkEditEmail(){
    this._Auth.checkEditEmail(this.decoded.user_id).subscribe(data=>{
      this.checkEmailEditVar = data
    });
  }
 
  addToCart(id) {
    this.active = true;
    this.buttonName = "Processing...";
    this.token = localStorage.getItem('token');


    // No login user
    if(CheckNullOrUndefinedOrEmpty(this.token) || (this.is_anomynous_account &&  this.total_product == 0)){
      const dialogRefLogin = this.dialog.open(DialogLoginNewComponent, {
        width: '350px',
        maxWidth: '75vw'
      });

      dialogRefLogin.afterClosed().subscribe( data => {

        if (data === 'signin') {
          localStorage.removeItem('token')
          this.router.navigate(["/login"], {queryParams : {returnUrl : this.router.url}});
        
        } else if (data === 'create') {
          localStorage.removeItem('token')
          const arr = this.router.url.split('&');
          this.router.navigate(["/register"], {queryParams : {checkUrl : arr[0], advisor_uuid: this.advisor_uuid }});
        } 
        else if(data === 'guest')
        {
          // localStorage.removeItem('token')
          this._Auth.buyAsGuest().subscribe(response=>{
          if(response === true)
          {
            this.commonAddTocart(id)
          }
          })
        }
        
        else {
          this.active = false;
          this.buttonName = 'Add to cart';
        }
      });

    }else if(this.checkEmailEditVar){
      const dialogRefLogin = this.dialog.open(DialogConfirmComponent, {
        width: '500px',
        data: { message: 'Your session has ended. Please log in again.', type : "APPROVED" }
      });
      dialogRefLogin.afterClosed().subscribe((data) => {
        if (data === true) {
          localStorage.removeItem('token')
          this.router.navigate(["/login"],{queryParams : {returnUrl : this.router.url}});
        }else{
          this.active = false;
          this.buttonName = "Add to cart";
        }
      });
    } else {
      // Login user

      // if(this.is_refund_cart)
      // {
      //   this.active = false;
      //   this.buttonName = "Add to cart";
      //   const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      //     width: "500px",
      //     data: {
      //       message:
      //         "Redemption packages cannot be ordered with other products. Do you wish to empty your current cart first?",
      //     },
      //   });
      // }

      if(this.is_naep_cart || this.is_redemption_cart)
      {

        this.active = false;
        this.buttonName = "Add to cart";
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
          width: "500px",
          data: {
            message: this.is_naep_cart ? "NAEP packages cannot be ordered with other products. Do you wish to empty your current cart first?" : 
            "Redempition product cannot be ordered with other products. Do you wish to empty your current cart first?"
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result === true) {
            let propertiesOfProduct  = {} as any;
            for(let i = 0; i < this.propertiesArray.length ; i++)
            {
              propertiesOfProduct[this.propertiesArray[i].name] = this.modelGroups[i];
            }
            const param = {
              product_id: id,
              quantity: 1,
              advisor_customer_id:
                this.AddToCartForm.value.advisor_id !== ""
                  ? this.AddToCartForm.value.advisor_id
                  : null,
              properties: propertiesOfProduct,
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
  
                    this.active = false;
                    this.buttonName = "Add to cart";
                  }
                });
              });
          } else {
            this.active = false;
            this.buttonName = "Add to cart";
            dialogRef.close;
          }
        });
        return;
      }



      if(this.checkiIsHaveInternalDiscount(this.productData))
      {
        //User in product detail and has discount on product.
        this._cartService.checkMaximumProduct(this.product_id).subscribe(response=>{
          if(response.code === 200)
          {
            this.total_buy = response.sum;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
            if(this.total_buy >= this.productData.max_total_discount)
            {
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: "You have reached the limit to buy Thermomix at this price. Please check out the current cart to proceed new order.",
                  title: "CONFIRM",
                  colorButton: false,
                },
              });
              this.active = false;
              this.buttonName = "Add to cart";
              return;
            }else{
             this.commonAddTocart(id);
            }
          }else{
            return;
          }
        })
      }else{
        this._cartService.checkMaximumProduct(this.product_id).subscribe(response=>{
          if(response.code === 200)
          {
            this.total_buy = response.sum;
            if(this.total_buy === this.productData.max_total_discount &&  this.cartData !== undefined)
            {
              const dialogRef = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message: "You have reached the limit to buy Thermomix at this price. Please check out the current card to proceed new order.",
                  title: "CONFIRM",
                  colorButton: false,
                },
              });
              this.active = false;
              this.buttonName = "Add to cart";
              return;
            }
            else{
              this.commonAddTocart(id);
            }
          }
          else{
            return;
          }
        })
      }
      
    }
  }

  commonAddTocart(id)
  {
    let propertiesOfProduct  = {} as any;
    for(let i = 0; i < this.propertiesArray.length ; i++)
    {
      propertiesOfProduct[this.propertiesArray[i].name] = this.modelGroups[i];
    }

    const param = {
      product_id: id,
      quantity: 1,
      advisor_customer_id:
        this.AddToCartForm.value.advisor_id !== ""
          ? this.AddToCartForm.value.advisor_id
          : null,
      properties: propertiesOfProduct,
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
          this.active = false;
          this.buttonName = "Add to cart";
          this.messageService.add({ summary: 'Added to cart successfully.', severity: 'success', life: 4000});
        }else if (data.code === 202) {
          //Check Pay Option
          this.active = false;
          this.buttonName = "Add to cart";
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
                advisor_customer_id:
                  this.AddToCartForm.value.advisor_id !== ""
                    ? this.AddToCartForm.value.advisor_id
                    : null,
                properties: propertiesOfProduct,
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
          this.active = false;
          this.buttonName = "Add to cart";
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
          this.active = false;
          this.buttonName = "Add to cart";
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
            advisor_customer_id:
              this.AddToCartForm.value.advisor_id !== ""
                ? this.AddToCartForm.value.advisor_id
                : null,
            properties: propertiesOfProduct,
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

                  this.active = false;
                  this.buttonName = "Add to cart";
                }
              });
            });
        } else {
          this.active = false;
          this.buttonName = "Add to cart";
          dialogRef.close;
        }
      });
    }
  }
  
  goToCategory(categoryID : string)
  {
    this.router.navigate(['list-products'], { queryParams: { categoryId: categoryID }})
  }
  
  checkHasPromotionPrice(price: string)
  {
    if (isNullOrUndefined(price) || parseFloat(price) === 0)
    {
      return false
    }
    return true;
  }

  inviteCustomer() {
    const port = this.document.location.port
    ? `:${this.document.location.port}`
    : "";
    const registerURL = `${this.document.location.protocol}//${this.document.location.hostname}${port}/product-detail?id=${this.product_id}&advisor_uuid=${this.advisor_invited_uuid}`;
  
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

    const messageText = `Get%20the%20World's%20smartest%20all-in-one%20super%20kitchen%20machine,%20Thermomix®%20TM6,%20from%20this:%20`;

    if (isMobile.any()) {
      const shareUrl = `whatsapp://send?text=${messageText}${encodeURIComponent(registerURL)}`;
      location.href = shareUrl;
    } else {
      window.open(
        `https://web.whatsapp.com/send?l=en&text=${messageText}${encodeURIComponent(
          registerURL
        )}`,
        "_blank"
      );
    }

  }

  setThumbsSwiper(swiper) {
    this.thumbsSwiper = swiper;
  }
}


function isValidAdvisorID(form: FormControl) {
  if (form.value === "N/A") {
    return { advisor_name: true };
  }
  return null;
}
