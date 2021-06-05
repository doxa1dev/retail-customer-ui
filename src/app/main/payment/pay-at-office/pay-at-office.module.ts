import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../angular-material/material.module'

import { FuseSharedModule } from '@fuse/shared.module';
import { PayAtOfficeComponent } from './pay-at-office.component';
import { FooterPaymentModule } from '../footer-payment/footer-payment.module';
import { ButtonLoadingModule } from '../../common-component/button-loading/button-loading.module'
import { TitleModule } from 'app/main/common-component/title/title.module';
import { PlaceholderLoadingModule } from '../../common-component/placeholder-loading/placeholder-loading.module';
const routes = [
    {
        path: 'pay-at-office',
        component: PayAtOfficeComponent
    }
];

@NgModule({
    declarations: [
        PayAtOfficeComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        PlaceholderLoadingModule,
        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        FooterPaymentModule,
        ButtonLoadingModule,
        TitleModule, 
        PlaceholderLoadingModule
    ],
    exports: [
        PayAtOfficeComponent
    ]
})

export class PayAtOfficeModule
{
}
