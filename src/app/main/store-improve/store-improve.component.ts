import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from 'app/core/enum/title';
import { CategoryService } from 'app/core/service/category.service';
import { ProductService } from 'app/core/service/product.service';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Subject } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { environment } from 'environments/environment';
import SwiperCore, {
  Navigation,
} from 'swiper/core';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-store-improve',
  templateUrl: './store-improve.component.html',
  styleUrls: ['./store-improve.component.scss']
})
export class StoreImproveComponent implements OnInit {

  title = Title.DOT;
  productsInit = [];
  lstEn: any[] = [];
  lstZh: any[] = [];
  lstMy: any[] = [];
  productActive: any;
  listProduct: any[] = [];
  isCheckSearch: boolean = false;
  private searchSubject = new Subject<string>();
  imageArray = [];
  imageArrayTest = [];
  storageUrl = environment.storageUrl;

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

  constructor(private categoryService: CategoryService,
    private translateService: TranslateService,
    public productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getBanners().subscribe(data => {
      this.imageArrayTest = data
      this.imageArray = this.imageArrayTest.map(i => {
        return this.storageUrl + i["url"];
      })

      if (this.imageArrayTest.length != 0) {
        this.swiperOptions.navigation = {nextEl: '.swiper-button-next-banner', prevEl: '.swiper-button-prev-banner'}
      
      } else {
        this.swiperOptions.navigation = {nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev'}
      }
    });
    if(this.searchSubject.observers.length === 0){
      this.categoryService.searchCategorys('').subscribe( data => {
        this.productsInit = data;
        this.productActive = this.productsInit[0];
        this.getListProduct(this.productActive.id);
        
        // get list translation
        for (const product of this.productsInit) {
          if (product.translations.length > 0) {
            product.translations.forEach(element => {
              if (element.language_code === 'en') {
                let objEn = {};
                objEn["CategoryId"] = element.category_id;
                objEn["Title"] = element.translated_title;
                this.lstEn.push(objEn);
              } else if (element.language_code === 'en') {
                let objZh = {};
                objZh["CategoryId"] = element.category_id;
                objZh["Title"] = element.translated_title;
                this.lstZh.push(objZh);
              } else {
                let objMy = {};
                objMy["CategoryId"] = element.category_id;
                objMy["Title"] = element.translated_title;
                this.lstMy.push(objMy);
              }
            })
          }
        }

        // set translation
        this.translateService.getTranslation('en').subscribe(() => {
          let obj = {
            "CATEGORY": {
              "TITLE": {}
            }
          }
          this.lstEn.forEach(element => {
            obj["CATEGORY"]["TITLE"][element["CategoryId"]] = element["Title"];
          });
          // set english language
          this.translateService.setTranslation('en', obj, true);

          /** ------------------ */
          this.translateService.getTranslation('en').subscribe(() => {
            let obj = {
              "CATEGORY": {
                "TITLE": {}
              }
            }
            this.lstZh.forEach(element => {
              obj["CATEGORY"]["TITLE"][element["CategoryId"]] = element["Title"];
            });
            // set chinese language
            this.translateService.setTranslation('en', obj, true);

            /** ---------------- */
            this.translateService.getTranslation('my').subscribe(() => {
              let obj = {
                "CATEGORY": {
                  "TITLE": {}
                }
              }
              this.lstMy.forEach(element => {
                obj["CATEGORY"]["TITLE"][element["CategoryId"]] = element["Title"];
              });
              // set malay language
              this.translateService.setTranslation('my', obj, true);
            });
          });
        });
      })
    }
  }

  searchProduct(searchString: string) :void{
    this.isCheckSearch = true;
    setTimeout(() => {
      this.productService.searchProductByNameV2(searchString).subscribe(
        data => {
          this.listProduct = data;   
          // this.translateListProduct(this.listProduct);      
        }
      )
    }, 500);
  }

  onShowProduct(product) {
    this.isCheckSearch = false;
    this.productActive = product;
    this.getListProduct(this.productActive.id);
  }

  getListProduct(idProduct) {
    this.productService.getListProductByCategoty(idProduct, undefined).subscribe(data => {
      this.listProduct = data;
      // this.translateListProduct(this.listProduct);    
    })
  }

  translateListProduct(listProduct) {
    // get list translation
    for (const product of listProduct) {
      if (product.translations.length > 0) {
        product.translations.forEach(element => {
          if (element.language_code === 'en') {
            let objEn = {};
            objEn["ProductId"] = element.productId;
            objEn["Title"] = element.title;
            this.lstEn.push(objEn);
          } else if (element.language_code === 'en') {
            let objZh = {};
            objZh["ProductId"] = element.productId;
            objZh["Title"] = element.title;
            this.lstZh.push(objZh);
          } else {
            let objMy = {};
            objMy["ProductId"] = element.productId;
            objMy["Title"] = element.title;
            this.lstMy.push(objMy);
          }
        })
      }
    }
  
    // set translation
    this.translateService.getTranslation('en').subscribe(() => {
      let obj = {
        "PRODUCT": {
          "TITLE": {}
        }
      }
      this.lstEn.forEach(element => {
        obj["PRODUCT"]["TITLE"][element["ProductId"]] = element["Title"];
      });
      // set english language
      this.translateService.setTranslation('en', obj, true);
    
      /** ------------------- */
      this.translateService.getTranslation('en').subscribe(() => {
        let obj = {
          "PRODUCT": {
            "TITLE": {}
          }
        }
        this.lstZh.forEach(element => {
          obj["PRODUCT"]["TITLE"][element["ProductId"]] = element["Title"];
        });
        // set chinese language
        this.translateService.setTranslation('en', obj, true);
      
        /** ------------------ */
        // set malay language
        this.translateService.getTranslation('my').subscribe(() => {
          let obj = {
            "PRODUCT": {
              "TITLE": {}
            }
          }
          this.lstMy.forEach(element => {
            obj["PRODUCT"]["TITLE"][element["ProductId"]] = element["Title"];
          });
          this.translateService.setTranslation('my', obj, true);
        });
      });
    }); 
  }
}
