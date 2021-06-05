import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { StoreComponent } from './store.component';
import { ProductsModule } from './products/products.module';
import { MaterialModule} from '../angular-material/material.module'
import { TitleModule} from 'app/main/common-component/title/title.module'

const routes = [
    // {
    //     path     : 'store',
    //     component: StoreComponent
    // }
];

@NgModule({
    declarations: [
        StoreComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        ProductsModule,
        MaterialModule,
        TitleModule

    ],
    exports     : [
        StoreComponent
    ]
})

export class StoresModule
{
}
