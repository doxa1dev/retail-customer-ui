
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { ShoppingBagComponent } from './shopping-bag.component';
import { StoresModule } from '../store/store.module';
import { MaterialModule} from '../angular-material/material.module';
import { FooterPayModule } from '../footer-pay/footer-pay.module';
import { CheckoutComponent } from '../check-out/check-out.component';
import { TitleModule } from 'app/main/common-component/title/title.module';
import { ButtonLoadingModule } from '../common-component/button-loading/button-loading.module';
import { PlaceholderLoadingModule } from '../common-component/placeholder-loading/placeholder-loading.module';
import { SharePipeModule} from 'app/main/_shared/pipe/sharePipe.module'

const routes = [
    {
        path     : 'shopping-bag',
        component: ShoppingBagComponent
    }
];

@NgModule({
    declarations: [
        ShoppingBagComponent
    
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        StoresModule,
        MaterialModule,
        FooterPayModule,
        TitleModule, 
        ButtonLoadingModule,
        PlaceholderLoadingModule,
        SharePipeModule
    ],
    exports     : [
        ShoppingBagComponent
    ]
})

export class ShoppingBagModule
{
}
