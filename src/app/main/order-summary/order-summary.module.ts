import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../angular-material/material.module';

import { FuseSharedModule } from '@fuse/shared.module';

import { OrderSummaryComponent } from './order-summary.component';
import { ProductComponent } from './product/product.component';
import { BookComponent } from './book/book.component';
import { DeliveryAddressComponent } from './delivery-address/delivery-address.component';
import { PaymentOptionsModule } from '../payment/payment-options/payment-options.module';
import { TitleModule } from '../common-component/title/title.module';
import { ButtonLoadingModule } from '../common-component/button-loading/button-loading.module';
import { PlaceholderLoadingModule } from '../common-component/placeholder-loading/placeholder-loading.module';
import { CheckoutSuccessComponent } from '../order-summary/checkout-success/checkout-success.component';

const routes = [
    {
        path: 'order-summary',
        component: OrderSummaryComponent
    },
    {
        path    : 'order-summary/checkout-success',
        component: CheckoutSuccessComponent
    }
];

@NgModule({
    declarations: [
        OrderSummaryComponent,
        ProductComponent,
        BookComponent,
        DeliveryAddressComponent,
        CheckoutSuccessComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        PaymentOptionsModule,
        TitleModule,
        ButtonLoadingModule, 
        PlaceholderLoadingModule
    ],
    exports: [
        OrderSummaryComponent
    ]
})

export class OrderSummaryModule
{
}
