import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FuseSharedModule } from '@fuse/shared.module';

import { OrderHistoryComponent } from './order-history.component';
import { TabsBarComponent } from './tabs-bar/tabs-bar.component'
// import { DeliveryAddressComponent } from '../common-component/delivery-address/delivery-address.component';
// import { ProductComponent } from '../common-component/product/product.component';
import { OrderListProductComponent } from './order-list-product/order-list-product.component';
import { MaterialModule } from '../angular-material/material.module';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { EmptyBoxProductComponent } from './empty-box-product/empty-box-product.component';
import { CustomerNoUnboxComponent } from './unbox/customer-no-unbox/customer-no-unbox.component';
// import { CustomerInfoComponent } from '../common-component/customer-info/customer-info.component';
import { CustomerHostComponent } from './unbox/customer-host/customer-host.component';
import { CustomerUnboxComponent} from './unbox/customer-unbox/customer-unbox.component';
import { CustomerNoHostComponent } from './unbox/customer-no-host/customer-no-host.component'
import { QRCodeModule } from 'angularx-qrcode';
import { TitleModule} from 'app/main/common-component/title/title.module'
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from "ngx-spinner";
import { ButtonLoadingModule } from 'app/main/common-component/button-loading/button-loading.module'
import { PlaceholderLoadingModule } from '../common-component/placeholder-loading/placeholder-loading.module';
import { InvoiceModule } from './invoice/invoice.module';
import { DialogSpecialComponent } from './dialog-special/dialog-special.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ProductModule } from '../common-component/product/product.module';
import { DeliveryAddressComponentCommonModule } from '../common-component/delivery-address/delivery-address.module';
import { CustomerInfoCommonModule } from '../common-component/customer-info/customer-info.module';
import { BottomNavigationModule } from '../common-component/bottom-navigation/bottom-navigation.module';

const routes = [
    {
        path     : 'order-history',
        component: OrderHistoryComponent
    },
    {
        path     : 'order-detail',
        component: OrderDetailComponent
    },
    {
        path     : 'order-empty-box',
        component: EmptyBoxProductComponent
    },
    {
        path     : 'customer-host',
        component: CustomerHostComponent
    },
    {
        path     : 'customer-unbox',
        component: CustomerUnboxComponent
    },
    {
        path: 'customer-no-host',
        component: CustomerNoHostComponent
    },
    {
        path: 'customer-no-unbox',
        component: CustomerNoUnboxComponent
    },
];

@NgModule({
    declarations: [
        OrderHistoryComponent,
        TabsBarComponent,
        // ProductComponent,
        // DeliveryAddressComponent,
        // CustomerInfoComponent,
        OrderListProductComponent,
        OrderDetailComponent,
        EmptyBoxProductComponent,
        CustomerNoUnboxComponent,
        CustomerHostComponent,
        CustomerNoHostComponent,
        DialogSpecialComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        MatTabsModule,
        FuseSharedModule,
        MaterialModule,
        QRCodeModule,
        TitleModule,
        InfiniteScrollModule,
        NgxSpinnerModule,
        ButtonLoadingModule, 
        PlaceholderLoadingModule,
        InvoiceModule,
        CalendarModule,
        DropdownModule,
        ProductModule,
        DeliveryAddressComponentCommonModule,
        CustomerInfoCommonModule,
        BottomNavigationModule
    ],
    exports     : [
        OrderHistoryComponent
    ]
})

export class OrderHistoryModule
{
}
