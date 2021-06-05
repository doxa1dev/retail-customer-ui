import { Component } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

@Component({
    selector   : 'ac-recruitment',
    templateUrl: './recruitment.component.html',
    styleUrls  : ['./recruitment.component.scss']
})
export class RecruitmentComponent
{
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    dataTest = [
        new Product('Thermomix TM6','Thermomix',108,'SGD 2,398.00',true),
        new Product('TM6 Spatula', 'Thermomix', 108, 'SGD 2,9458.00', true),
        new Product('TM6 Simmering basket with lid', 'Thermomix', 108, 'SGD 2,498.00', true),
        new Product('TM6 Guidance book-chinese', 'Thermomix', 108, 'SGD 2,698.00', true),
        new Product('Thermomix TM2', 'Thermomix', 98, 'SGD 2,7398.00', true),
        new Product('Thermomix TM1', 'Thermomix', 102, 'SGD 2,2398.00', true),
        new Product('Thermomix TM3', 'Thermomix', 10, 'SGD 2,5398.00', false),
        new Product('Thermomix TM5', 'Thermomix', 14, 'SGD 2,398.00', true),
        new Product('Thermomix TM7', 'Thermomix', 16, 'SGD 2,328.00', true),
        new Product('Thermomix TM8', 'Thermomix', 18, 'SGD 2,384.00', true),
    ]
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }
}
class Product{
    product: string;
    category : string;
    available: number;
    price : string;
    active: boolean;
    constructor(Pd: string, C: string, A: number, Pr: string,Ac:boolean){
        this.product = Pd;
        this.category = C;
        this.available = A;
        this.price = Pr;
        this.active = Ac
    }
}
