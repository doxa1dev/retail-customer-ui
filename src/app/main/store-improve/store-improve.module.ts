import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { StoreImproveComponent } from './store-improve.component';
import { MaterialModule } from '../angular-material/material.module'
import { TitleModule } from 'app/main/common-component/title/title.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { SwiperModule } from 'swiper/angular';
import { ProductImproveComponent } from './product-improve/product-improve.component';
import { SharePipeModule } from '../_shared/pipe/sharePipe.module';
import { DialogPropertiesProductComponent } from '../common-component/dialog-properties-product/dialog-properties-product.component';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ButtonLoadingModule } from '../common-component/button-loading/button-loading.module';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { BottomNavigationModule } from '../common-component/bottom-navigation/bottom-navigation.module';

const routes = [
    {
        path: 'store',
        component: StoreImproveComponent
    }
];

@NgModule({
    declarations: [
        StoreImproveComponent,
        ProductImproveComponent,
        DialogPropertiesProductComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        TitleModule,
        BrowserModule,
        BrowserAnimationsModule,
        SwiperModule,
        DropdownModule,
        ToastModule,
        ButtonLoadingModule,
        BottomNavigationModule,
        SharePipeModule.forRoot(),
        MatCarouselModule.forRoot(),
    ],
    exports: [
        StoreImproveComponent
    ]
})

export class StoreImproveModule {
}
