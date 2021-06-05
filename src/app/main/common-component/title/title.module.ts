import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { TitleComponent } from './title.component';
import { MaterialModule } from 'app/main/angular-material/material.module';


@NgModule({
    declarations: [
        TitleComponent
    ],
    imports: [

        TranslateModule,
        MaterialModule,
        FuseSharedModule
    ],
    exports: [
        TitleComponent
    ]
})

export class TitleModule
{
}
