import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../angular-material/material.module'

import { FuseSharedModule } from '@fuse/shared.module';

import { PaymentOptionsFullComponent } from './payment-options-full.component';
import { FooterPaymentModule } from '../footer-payment/footer-payment.module';
import { AlertModule } from '../../_shared/alert/alert.module';
import { ButtonLoadingModule } from 'app/main/common-component/button-loading/button-loading.module';
import { PlaceholderLoadingModule } from '../../common-component/placeholder-loading/placeholder-loading.module';
import { TitleModule } from 'app/main/common-component/title/title.module';
import { ToastModule } from 'primeng/toast';
import { OrderSummaryDetailModule } from 'app/main/common-component/order-summary-detail/order-summary-detail.component.module';



const routes = [
    {
        path: 'payment-options-full',
        component: PaymentOptionsFullComponent
    }
];

@NgModule({
    declarations: [
        PaymentOptionsFullComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        FooterPaymentModule,
        AlertModule,
        ButtonLoadingModule,
        PlaceholderLoadingModule,
        TitleModule,
        ToastModule,
        OrderSummaryDetailModule
    ],
    exports: [
        PaymentOptionsFullComponent
    ]
})

export class PaymentOptionsFullModule
{
}
