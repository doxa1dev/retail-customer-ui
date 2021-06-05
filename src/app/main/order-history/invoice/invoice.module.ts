import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { InvoiceComponent } from './invoice.component';
import { MaterialModule } from '../../angular-material/material.module';
import { TitleModule}  from 'app/main/common-component/title/title.module'
import { SharePipeModule} from 'app/main/_shared/pipe/sharePipe.module'
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';


const routes = [
    {
        path     : 'order-detail/invoice',
        component: InvoiceComponent
    }
];

@NgModule({
    declarations: [
        InvoiceComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule, 
        
        MaterialModule,

        TitleModule,

        BottomNavigationModule,
        SharePipeModule.forRoot()
    ],
    exports     : [
        InvoiceComponent
    ]
})

export class InvoiceModule
{
}
