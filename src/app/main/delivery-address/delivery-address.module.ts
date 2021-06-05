import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { DeliveryAddressComponent } from './delivery-address.component';
import { MaterialModule} from '../angular-material/material.module'


const routes = [
    {
        path     : 'delivery-address',
        component: DeliveryAddressComponent
    }
];

@NgModule({
    declarations: [
        DeliveryAddressComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule

    ],
    exports     : [
        DeliveryAddressComponent
    ]
})

export class DeliveryAddressModule
{
}
