import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../angular-material/material.module';

import { WarrantiedProductsDetailComponent } from './warrantied-products-detail.component';
import { WarrantiedModule } from 'app/main/common-component/warrantied/warrantied.module';
import { TitleModule}  from 'app/main/common-component/title/title.module'
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';

const routes = [
    {
        path     : 'warrantied-products/detail',
        component: WarrantiedProductsDetailComponent
    }
];

@NgModule({
    declarations: [
        WarrantiedProductsDetailComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        MatTabsModule,
        FuseSharedModule,
        MaterialModule,
        WarrantiedModule,
        TitleModule,
        BottomNavigationModule
    ],
    exports     : [
        WarrantiedProductsDetailComponent
    ]
})

export class WarrantiedProductsDetailModule
{
}
