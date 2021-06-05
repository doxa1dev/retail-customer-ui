import { from } from 'rxjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AlertModule} from '../_shared/alert/alert.module'
import { FuseSharedModule } from '@fuse/shared.module';

import { ProductDetailComponent } from './product-detail.component';
import { MaterialModule} from '../angular-material/material.module';
import { DropdownModule } from 'primeng/dropdown';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FuseConfirmDialogModule } from '@fuse/components';
import { ButtonLoadingModule } from '../common-component/button-loading/button-loading.module'
import { ToastModule } from 'primeng/toast';
import { TitleModule}  from 'app/main/common-component/title/title.module'
import { SharePipeModule} from 'app/main/_shared/pipe/sharePipe.module';
import { DialogLoginModule } from '../common-component/dialog-login/dialog-login.component.module';
import { VerifyDialogModule } from '@fuse/components/verify-dialog/verify-dialog.module';
import { SwiperModule } from 'swiper/angular';
import { BottomNavigationModule } from '../common-component/bottom-navigation/bottom-navigation.module';

const routes = [
    {
        path: 'product-detail',
        component: ProductDetailComponent
    }
];

@NgModule({
    declarations: [
        ProductDetailComponent,
        // DialogLoginComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        AlertModule,
        MaterialModule,
        DropdownModule,
        NgxGalleryModule,
        FuseConfirmDialogModule,
        ButtonLoadingModule,
        ToastModule,
        TitleModule,
        SharePipeModule.forRoot(),
        DialogLoginModule,
        VerifyDialogModule,
        SwiperModule,
        BottomNavigationModule
    ],
    exports: [
        ProductDetailComponent
    ]
})

export class ProductDetailModule
{
}
