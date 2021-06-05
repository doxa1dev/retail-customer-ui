import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { EditAddressComponent } from './edit-address.component';
import { MaterialModule} from '../angular-material/material.module'


const routes = [
    {
        path     : 'edit-address',
        component: EditAddressComponent
    }
];

@NgModule({
    declarations: [
        EditAddressComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule

    ],
    exports     : [
        EditAddressComponent
    ]
})

export class EditAddressModule
{
}
