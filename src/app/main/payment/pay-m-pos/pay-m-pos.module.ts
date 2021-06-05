import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { PayMPOSComponent } from './pay-m-pos.component';
import { MaterialModule} from '../../angular-material/material.module';
import { StoresModule } from '../../store/store.module'

const routes = [
    {
        path     : 'paym-pos',
        component: PayMPOSComponent
    }
]; 

@NgModule({
    declarations: [
        PayMPOSComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        StoresModule

    ],
    exports     : [
        PayMPOSComponent
    ]
})

export class PayMPOSModule
{
}
