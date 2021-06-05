import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { MaterialModule } from 'app/main/angular-material/material.module';

import { CustomerOrdersComponent } from './customerorders.component';
import { TabsBarComponent} from 'app/main/advisor/customerorders/tabs-bar/tabs-bar.component';
import { OrderDetailComponent} from 'app/main/advisor/customerorders/order-detail/order-detail.component';
import { OrderListProductComponent} from 'app/main/advisor/customerorders/order-list-product/order-list-product.component';
import { AdvisorMarkNoUnboxComponent } from './unbox/advisor-mark-no-unbox/advisor-mark-no-unbox.component';
import { ProductComponent } from 'app/main/advisor/customerorders/product/product.component';
import { DeliveryAddressComponent } from 'app/main/advisor/customerorders/delivery-address/delivery-address.component';
import { CustomerInfoComponent } from 'app/main/advisor/customerorders/customer-info/customer-info.component';
import { EmptyBoxProductComponent } from './empty-box-product/empty-box-product.component';
import { AdvisorUnboxComponent} from './unbox/advisor-unbox/advisor-unbox.component'
import { MatTabsModule } from '@angular/material/tabs';
import { AdvisorHostComponent } from './unbox/advisor-host/advisor-host.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AdvisorMarkNoHostComponent } from './unbox/advisor-mark-no-host/advisor-mark-no-host.component';
import { ButtonLoadingModule } from 'app/main/common-component/button-loading/button-loading.module';
import { TitleModule} from 'app/main/common-component/title/title.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from "ngx-spinner";
import { PlaceholderLoadingModule } from '../../common-component/placeholder-loading/placeholder-loading.module';
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';

const routes = [
    {
        path     : 'advisor/customerorders',
        component: CustomerOrdersComponent
    },
    {
        path     : 'advisor/order-detail',
        component: OrderDetailComponent
    },
    {
        path     : 'order-empty-box',
        component: EmptyBoxProductComponent
    },
    {
        path     : 'advisor-unbox',
        component: AdvisorUnboxComponent
    },
    {
        path     : 'advisor-host',
        component: AdvisorHostComponent
    },
    {
        path: 'advisor-no-unbox',
        component: AdvisorMarkNoUnboxComponent
    },
    {
        path: 'advisor-no-host',
        component: AdvisorMarkNoHostComponent
    },
    
];

@NgModule({
    declarations: [
        CustomerOrdersComponent,
        TabsBarComponent,
        ProductComponent,
        DeliveryAddressComponent,
        CustomerInfoComponent,
        OrderListProductComponent,
        OrderDetailComponent,
        EmptyBoxProductComponent,
        AdvisorMarkNoUnboxComponent,
        AdvisorHostComponent,
        AdvisorMarkNoHostComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,

        MaterialModule,

        MatTabsModule,

        ZXingScannerModule,
        ButtonLoadingModule,
        TitleModule,
        NgxSpinnerModule,
        InfiniteScrollModule,
        PlaceholderLoadingModule,
        BottomNavigationModule
    ],
    exports     : [
        CustomerOrdersComponent
    ]
})

export class CustomerOrdersModule
{
}
