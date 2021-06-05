import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../angular-material/material.module'

import { FuseSharedModule } from '@fuse/shared.module';
import { PaymentDoneComponent } from './payment-done.component';
import { FooterPaymentModule } from '../footer-payment/footer-payment.module';
import { TitleModule } from 'app/main/common-component/title/title.module';

const routes = [
    {
        path: 'payment-done',
        component: PaymentDoneComponent
    }
];

@NgModule({
    declarations: [
        PaymentDoneComponent
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
        PaymentDoneComponent
    ]
})

export class PaymentDoneModule
{
}
