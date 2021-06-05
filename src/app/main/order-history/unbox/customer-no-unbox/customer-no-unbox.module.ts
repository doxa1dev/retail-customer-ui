import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module'
import { CustomerNoUnboxComponent } from './customer-no-unbox.component'
import { TitleModule} from 'app/main/common-component/title/title.module'
import { ButtonLoadingModule } from '../../../common-component/button-loading/button-loading.module'

const routes = [
    {
        path: 'customer-no-unbox',
        component: CustomerNoUnboxComponent
    }
];

@NgModule({
    declarations: [
        CustomerNoUnboxComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        TitleModule,
        ButtonLoadingModule
    ],
    exports: [
        CustomerNoUnboxComponent
    ]
})

export class CustomerNoUnboxModule
{
}
