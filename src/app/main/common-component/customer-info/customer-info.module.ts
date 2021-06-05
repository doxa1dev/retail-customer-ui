import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { CustomerInfoComponent  } from './customer-info.component';
@NgModule({
    declarations: [
        CustomerInfoComponent
    ],
    imports: [

        TranslateModule,
        MaterialModule,
        FuseSharedModule
    ],
    exports: [
        CustomerInfoComponent
    ]
})

export class CustomerInfoCommonModule {
}
