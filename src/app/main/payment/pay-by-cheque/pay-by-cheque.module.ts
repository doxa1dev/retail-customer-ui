import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../angular-material/material.module'

import { FuseSharedModule } from '@fuse/shared.module';
import { PayByChequeComponent } from './pay-by-cheque.component';
import { FooterPaymentModule } from '../footer-payment//footer-payment.module';
import { AlertModule } from 'app/main/_shared/alert/alert.module';
import { ButtonLoadingModule } from 'app/main/common-component/button-loading/button-loading.module';
import { TitleModule } from 'app/main/common-component/title/title.module';

const routes = [
    {
        path: 'pay-by-cheque',
        component: PayByChequeComponent
    }
];

@NgModule({
    declarations: [
        PayByChequeComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        FooterPaymentModule,
        AlertModule,
        ButtonLoadingModule,
        TitleModule
    ],
    exports: [
        PayByChequeComponent
    ]
})

export class PayByChequeModule
{
}
