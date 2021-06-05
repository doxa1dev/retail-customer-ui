import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../angular-material/material.module';
import { CustomerInformationComponent } from './customer-information.component';

@NgModule({
    declarations: [
        CustomerInformationComponent
    ],
    imports: [

        TranslateModule,
        MaterialModule,
        FuseSharedModule
    ],
    exports: [
        CustomerInformationComponent
    ]
})

export class CustomerInformationModule
{
}
