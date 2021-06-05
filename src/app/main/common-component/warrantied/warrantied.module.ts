import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../angular-material/material.module';
import { WarrantiedComponent } from './warrantied.component';

@NgModule({
    declarations: [
        WarrantiedComponent
    ],
    imports: [

        TranslateModule,
        MaterialModule,
        FuseSharedModule
    ],
    exports: [
        WarrantiedComponent
    ]
})

export class WarrantiedModule
{
}
