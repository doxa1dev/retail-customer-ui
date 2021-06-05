import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { ProductsComponent } from './products.component';
import { MaterialModule} from '../../angular-material/material.module'
import { SharePipeModule} from 'app/main/_shared/pipe/sharePipe.module'

const routes = [
    {
        path     : 'products',
        component: ProductsComponent
    }
];

@NgModule({
    declarations: [
        ProductsComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        MaterialModule,
        SharePipeModule

    ],
    exports     : [
        ProductsComponent
    ]
})

export class ProductsModule
{
}
