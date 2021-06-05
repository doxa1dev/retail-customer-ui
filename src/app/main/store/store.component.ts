
import { Title } from 'app/core/enum/title';
import { Component, OnInit, Input, Output , ViewEncapsulation} from '@angular/core';
import { CategoryService } from 'app/core/service/category.service';
import { Category } from 'app/core/models/category.model'
import { environment } from 'environments/environment';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { element } from 'protractor';

@Component({
  selector: 'store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class StoreComponent implements OnInit {
  title = Title.DOT;
  products : Observable<Category[]>;

  productsInit = [];

  lstEn: any[] = [];
  lstZh: any[] = [];
  lstMy: any[] = [];

   /** store url get enviroment */
   storageUrl = environment.storageUrl;

  private searchSubject = new Subject<string>()

  constructor(
    private categoryService: CategoryService,
    private translateService: TranslateService
    ) {

     }

  ngOnInit(): void {
    // get list category
    // this.GetListCategory();
    if(this.searchSubject.observers.length === 0){
      this.categoryService.searchCategorys('').subscribe( data => {
        this.productsInit = data
        
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
    // this.products = this.searchSubject.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   switchMap((searchString: string) => this.categoryService.searchCategorys(searchString))
    // )


  }

  /**
   * get list category
  //  * @returns Product array
  //  */
  // GetListCategory(): Promise<any> {
  //   return new Promise(resolve => {
  //     this.categoryService.getCategoryList().subscribe(
  //       respone => {
  //         respone.forEach(element => {
  //           var category = new Category();
  //           category.id = element.id;
  //           category.publicId = element.public_id;
  //           category.categoryUri = element.category_uri;
  //           category.isActive = element.is_active;
  //           category.categoryName = element.category_name;
  //           category.categoryDescription = element.category_description;
  //           category.createdAt = element.created_at;
  //           category.updatedAt = element.updated_at;
  //           category.categoryPhotoKey = this.storageUrl + element.category_photo_key;
  //           this.products.push(category);
  //       }
  //     );
  //   });
  //  });
  // }

  search(searchString: string) :void{
    // this.checkInit = false
    setTimeout(() => {
      this.categoryService.searchCategorys(searchString).subscribe( data => {
        this.productsInit = data
      })
    }, 500);
    // this.searchSubject.next(searchString)
    // this.products = this.searchSubject.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   switchMap((searchString: string) => this.categoryService.searchCategorys(searchString))
    // )
  }

  // get translation
  getTranslation(key: string, id: string) {
    key = key + '.' + id;
    return this.translateService.getStreamOnTranslationChange(key);
  }
}
