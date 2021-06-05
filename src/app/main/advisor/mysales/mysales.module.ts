import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { MySalesComponent } from './mysales.component';

const routes = [
    {
        path     : 'advisor/mysales',
        component: MySalesComponent
    }
];

@NgModule({
    declarations: [
        MySalesComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule
    ],
    exports     : [
        MySalesComponent
    ]
})

export class MySalesModule
{
}
