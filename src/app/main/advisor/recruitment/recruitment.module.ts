import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { RecruitmentComponent } from './recruitment.component';

const routes = [
    {
        path     : 'advisor/recruitment22',
        component: RecruitmentComponent
    }
];

@NgModule({
    declarations: [
        RecruitmentComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule
    ],
    exports     : [
        RecruitmentComponent
    ]
})

export class RecruitmentModule
{
}
