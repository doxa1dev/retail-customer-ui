import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module'
import { CustomerUnboxComponent} from './customer-unbox.component'
import { QRCodeModule} from 'angularx-qrcode';
import { TitleModule} from 'app/main/common-component/title/title.module'
const routes = [
    {
        path: 'customer-unbox',
        component: CustomerUnboxComponent
    }
];

@NgModule({
    declarations: [
        CustomerUnboxComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        QRCodeModule,
        TitleModule

    ],
    exports: [
        CustomerUnboxComponent
    ]
})

export class CustomerUnboxModule
{
}
