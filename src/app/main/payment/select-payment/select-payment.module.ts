import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../angular-material/material.module'

import { FuseSharedModule } from '@fuse/shared.module';

import { SelectPaymentComponent } from './select-payment.component';
import { FooterPaymentModule } from '../footer-payment/footer-payment.module';
import { TitleModule } from 'app/main/common-component/title/title.module';
import { PlaceholderLoadingModule } from '../../common-component/placeholder-loading/placeholder-loading.module';
import { OrderSummaryDetailModule } from 'app/main/common-component/order-summary-detail/order-summary-detail.component.module';
import { ToastModule } from 'primeng/toast';

const routes = [
    {
        path: 'select-payment',
        component: SelectPaymentComponent
    }
];

@NgModule({
    declarations: [
        SelectPaymentComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        FooterPaymentModule,
        TitleModule, 
        PlaceholderLoadingModule,
        OrderSummaryDetailModule,
        ToastModule
    ],
    exports: [
        SelectPaymentComponent
    ]
})

export class SelectPaymentModule
{
}
