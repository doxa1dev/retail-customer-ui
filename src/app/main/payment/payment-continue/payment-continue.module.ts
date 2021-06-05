import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../angular-material/material.module'

import { FuseSharedModule } from '@fuse/shared.module';
import { PaymentContinueComponent } from './payment-continue.component';
import { FooterPaymentModule } from '../footer-payment/footer-payment.module';
import { TitleModule } from 'app/main/common-component/title/title.module';

const routes = [
    {
        path: 'payment-continue',
        component: PaymentContinueComponent
    }
];

@NgModule({
    declarations: [
        PaymentContinueComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        FooterPaymentModule,
        TitleModule
    ],
    exports: [
        PaymentContinueComponent
    ]
})

export class PaymentContinueModule
{
}
