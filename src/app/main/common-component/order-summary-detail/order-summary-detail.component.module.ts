import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { OrderSummaryDetailComponent } from './order-summary-detail.component';
import { ProductOrderComponent } from './product-order/product-order.component';

import { ProductModule} from '../product/product.module'
import { DeliveryAddressComponentCommonModule } from '../delivery-address/delivery-address.module';
import { CustomerInfoCommonModule } from '../customer-info/customer-info.module';
@NgModule({
    declarations: [
        OrderSummaryDetailComponent,
        ProductOrderComponent,
    ],
    imports: [
        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        ProductModule,
        DeliveryAddressComponentCommonModule,
        CustomerInfoCommonModule
    ],
    exports: [
        OrderSummaryDetailComponent
    ]
})

export class OrderSummaryDetailModule {
}
