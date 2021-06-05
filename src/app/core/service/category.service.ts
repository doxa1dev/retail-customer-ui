import { Injectable, MissingTranslationStrategy } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { cartegoryListApi, cartegorySearchApi } from './backend-api';
import { ApiService } from './api.service'
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { environment } from 'environments/environment';
import { Category, Translation } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService
{

       /** store url get enviroment */
   storageUrl = environment.storageUrl;
   
    constructor(
        private api: ApiService,
        private http: HttpClient,
    ) {}
    
   /**
    * get list Category
    */
   getCategoryList(): Observable<any>{
        return this.http.get<any>(cartegoryListApi).pipe(
            map((value) =>
            {
                if (value.code === 200)
                {
                    var result = [];
                    result = value.data;
                    return result;
                }
            }), catchError(value => throwError(value))
        );
    }

    searchCategorys(searchString: string): Observable<any>{
        let products = [];
        let param = new HttpParams();
        if (!isNullOrUndefined(searchString)) {
            param = param.append('name', searchString);
        }
        // if(this.api.isEnable()){
            return this.http.get<any>(cartegorySearchApi, { headers: this.api.headers, params: param }).pipe(
                map((value) => {
                    if (value.code === 200) {
                        value.data.forEach(element => {
                            var category = new Category();
                            category.id = element.id;
                            category.publicId = element.public_id;
                            category.categoryUri = element.category_uri;
                            category.isActive = element.is_active;
                            category.categoryName = element.category_name;
                            category.categoryDescription = element.category_description;
                            category.createdAt = element.created_at;
                            category.updatedAt = element.updated_at;
                            category.categoryPhotoKey = this.storageUrl + element.category_photo_key;
                            category.translations = [];
                            if (element.translations.length > 0) {
                                element.translations.forEach(translation => {
                                    let translate = new Translation();
                                    translate.language_code = translation.language.language_code;
                                    translate.translated_title = translation.translated_title;
                                    translate.category_id = element.id;
                                    category.translations.push(translate);
                                })
                            }
                            products.push(category);
                    })
                    return products;
                }
                }), catchError(value => throwError(value))
            );
            
        // }
    }
    
}
