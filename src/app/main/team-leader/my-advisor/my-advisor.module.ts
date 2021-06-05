import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { MyAdvisorComponent } from './my-advisor.component';

const routes = [
    {
        path     : 'teamleader/my-advisor',
        component: MyAdvisorComponent
    }
];

@NgModule({
    declarations: [
        MyAdvisorComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule
    ],
    exports     : [
        MyAdvisorComponent
    ]
})

export class MyAdvisorModule
{
}
