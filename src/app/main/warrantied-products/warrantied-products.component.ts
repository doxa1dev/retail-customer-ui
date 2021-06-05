import { Component, OnInit } from '@angular/core';
import { WarrantiedService, Warrantied } from 'app/core/service/warrantied.service';
import { Router } from '@angular/router';
import { Title } from 'app/core/enum/title';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-warrantied-products',
    templateUrl: './warrantied-products.component.html',
    styleUrls: ['./warrantied-products.component.scss']
})
export class WarrantiedProductsComponent implements OnInit {
    title = Title.LEFT;
    warrantyArray = new Array<Warrantied>();
    warrantyProductArray = new Array<Warrantied>();
    isSearch: boolean;
    keySearch: string;

    // translation
    lstEnTranslation: any[] = [];
    lstZhTranslation: any[] = [];
    lstMyTranslation: any[] = [];

    constructor(private warrantiedService: WarrantiedService,
        private router: Router,
        private translateService: TranslateService) { 
            this.isSearch = false;
            this.keySearch = "";
            this.warrantyProductArray = null;
        }

    ngOnInit(): void {
        this.warrantiedService.getAllWarrantied().subscribe(data => {
            this.warrantyArray = data;
            this.warrantyProductArray = data;

            // get list translation
            this.warrantyArray.forEach(warrantyProduct => {
                warrantyProduct.translations.forEach(translate => {
                    if (translate.language.language_code === 'en') {
                        let obj = {};
                        obj["SerialNumber"] = warrantyProduct.serialNumber;
                        obj["Title"] = translate.translated_title;
                        this.lstEnTranslation.push(obj);
                    } else if (translate.language.language_code === 'en') {
                        let obj = {};
                        obj["SerialNumber"] = warrantyProduct.serialNumber;
                        obj["Title"] = translate.translated_title;
                        this.lstZhTranslation.push(obj);
                    } else if (translate.language.language_code === 'my') {
                        let obj = {};
                        obj["SerialNumber"] = warrantyProduct.serialNumber;
                        obj["Title"] = translate.translated_title;
                        this.lstZhTranslation.push(obj);
                    }
                })
            });

            // object translation
            /**
                "WARRANTIED_PRODUCT": {
                    "SERIAL_NUMBER": {
                        "TITLE": "Warrantied product title"
                    }
                }
            */

            // set translation language
            this.translateService.getTranslation('en').subscribe(() => {
                let objEnTranslation = {
                    "WARRANTIED_PRODUCT": {}
                }
                this.lstEnTranslation.forEach(translate => {
                    objEnTranslation["WARRANTIED_PRODUCT"][translate["SerialNumber"]] = {};
                    objEnTranslation["WARRANTIED_PRODUCT"][translate["SerialNumber"]]["TITLE"] = translate["Title"];
                });
                // set english language
                this.translateService.setTranslation('en', objEnTranslation, true);

                /** --------------- */
                this.translateService.getTranslation('en').subscribe(() => {
                    let objZhTranslation = {
                        "WARRANTIED_PRODUCT": {}
                    }
                    this.lstZhTranslation.forEach(translate => {
                        objZhTranslation["WARRANTIED_PRODUCT"][translate["SerialNumber"]] = {};
                        objZhTranslation["WARRANTIED_PRODUCT"][translate["SerialNumber"]]["TITLE"] = translate["Title"];
                    });
                    // set chinese language
                    this.translateService.setTranslation('en', objZhTranslation, true);

                    /** --------------- */
                    this.translateService.getTranslation('my').subscribe(() => {
                        let objMyTranslation = {
                            "WARRANTIED_PRODUCT": {}
                        }
                        this.lstMyTranslation.forEach(translate => {
                            objMyTranslation["WARRANTIED_PRODUCT"][translate["SerialNumber"]] = {};
                            objMyTranslation["WARRANTIED_PRODUCT"][translate["SerialNumber"]]["TITLE"] = translate["Title"];
                        });
                        // set malay language
                        this.translateService.setTranslation('my', objMyTranslation, true);
                    })
                })
            })
        })
    }

    // get translation
    getTranslation(serialNumber: string) {
        let key = 'WARRANTIED_PRODUCT.' + serialNumber + '.TITLE';
        return this.translateService.getStreamOnTranslationChange(key);
    }

    onViewWarrantyDetail(uuid) {
        this.router.navigate(['warrantied-products/detail'], { queryParams: { uuid: uuid } })
    }

    search(event) {
        let wordSearch: string = this.keySearch;
        setTimeout(() => {
            if (wordSearch === this.keySearch) {
                this.isSearch = true;
                setTimeout(() => {
                    if (this.keySearch !== '') {
                        this.warrantyProductArray = this.warrantyArray.filter(value => {
                            return value.orderIdTmm.toString().indexOf(wordSearch) > -1
                                        || value.serialNumber.toString().indexOf(wordSearch) > -1
                        });
                    } else {
                        this.warrantyProductArray = this.warrantyArray;
                    }
                    this.isSearch = false;
                }, 500);
            }
        }, 1000);
    }
}
