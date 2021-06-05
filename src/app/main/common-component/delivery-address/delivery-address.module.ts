import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { DeliveryAddressComponent } from './delivery-address.component';
@NgModule({
    declarations: [
        DeliveryAddressComponent
    ],
    imports: [

        TranslateModule,
        MaterialModule,
        FuseSharedModule
    ],
    exports: [
        DeliveryAddressComponent
    ]
})

export class DeliveryAddressComponentCommonModule {
}
