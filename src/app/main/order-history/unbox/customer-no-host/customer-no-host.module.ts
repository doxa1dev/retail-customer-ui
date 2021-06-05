import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module'
import { CustomerNoHostComponent } from './customer-no-host.component'
import { TitleModule} from 'app/main/common-component/title/title.module'

const routes = [
    {
        path: 'customer-no-host',
        component: CustomerNoHostComponent
    }
];

@NgModule({
    declarations: [
        CustomerNoHostComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        TitleModule
    ],
    exports: [
        CustomerNoHostComponent
    ]
})

export class CustomerNoHostModule
{
}
