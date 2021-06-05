import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { ListProductsComponent } from './list-products.component';
import { MaterialModule } from '../angular-material/material.module';
import { TitleModule}  from 'app/main/common-component/title/title.module'
import { SharePipeModule} from 'app/main/_shared/pipe/sharePipe.module'


const routes = [
    {
        path     : 'list-products',
        component: ListProductsComponent
    }
];

@NgModule({
    declarations: [
        ListProductsComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule, 
        
        MaterialModule,

        TitleModule,
        SharePipeModule.forRoot()
    ],
    exports     : [
        ListProductsComponent
    ]
})

export class ListProductsModule
{
}
