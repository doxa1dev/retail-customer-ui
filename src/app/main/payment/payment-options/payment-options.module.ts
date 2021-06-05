import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../angular-material/material.module'

import { FuseSharedModule } from '@fuse/shared.module';

import { PaymentOptionsComponent } from './payment-options.component';
import { FooterPaymentModule } from '../footer-payment/footer-payment.module';
import { AlertModule } from '../../_shared/alert/alert.module';
import { TitleModule } from 'app/main/common-component/title/title.module';
import { ButtonLoadingModule } from 'app/main/common-component/button-loading/button-loading.module';
import { PlaceholderLoadingModule } from 'app/main/common-component/placeholder-loading/placeholder-loading.module'

const routes = [
    {
        path: 'payment-options',
        component: PaymentOptionsComponent
    }
];

@NgModule({
    declarations: [
        PaymentOptionsComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        FooterPaymentModule,
        AlertModule,
        TitleModule,
        ButtonLoadingModule,
        PlaceholderLoadingModule
    ],
    exports: [
        PaymentOptionsComponent
    ]
})

export class PaymentOptionsModule
{
}
