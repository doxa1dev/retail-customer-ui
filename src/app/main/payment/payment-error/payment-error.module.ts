import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaymentErrGatewayComponent } from './payment-err-gateway/payment-err-gateway.component';
import { PaymentErrTMMComponent } from './payment-err-tmm/payment-err-tmm.component';
import { TranslateModule } from '@ngx-translate/core';

import { TitleModule } from 'app/main/common-component/title/title.module';


const routes = [
    {
        path: 'payment-gateway-err',
        component: PaymentErrGatewayComponent
    },
    {
        path: 'payment-thermomix-err',
        component: PaymentErrTMMComponent
    }
];

@NgModule({
    declarations: [PaymentErrGatewayComponent, PaymentErrTMMComponent],
    imports: [
        RouterModule.forChild(routes),
        TitleModule,

        TranslateModule,
        // MaterialModule,
        // FuseSharedModule,
        // FooterPaymentModule,
        // AlertModule,
        // TitleModule,
        // ButtonLoadingModule,
        // PlaceholderLoadingModule
    ],
    exports: [
        // PaymentOptionsComponent
    ]
})

export class PaymentErrorModule
{
}
