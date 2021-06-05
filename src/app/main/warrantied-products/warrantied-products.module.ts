import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../angular-material/material.module';

import { WarrantiedProductsComponent } from './warrantied-products.component';
import { WarrantiedModule } from '../common-component/warrantied/warrantied.module';
import { TitleModule}  from 'app/main/common-component/title/title.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BottomNavigationModule } from '../common-component/bottom-navigation/bottom-navigation.module';

const routes = [
    {
        path     : 'warrantied-products',
        component: WarrantiedProductsComponent
    }
];

@NgModule({
    declarations: [
        WarrantiedProductsComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        MatTabsModule,
        FuseSharedModule,
        MaterialModule,
        WarrantiedModule,
        TitleModule,
        // MatProgressBarModule
        MatProgressSpinnerModule,
        BottomNavigationModule
    ],
    exports     : [
        WarrantiedProductsComponent
    ]
})

export class WarrantiedProductsModule
{
}
