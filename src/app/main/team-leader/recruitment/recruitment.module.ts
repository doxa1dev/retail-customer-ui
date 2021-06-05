import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { RecruitmentComponent } from './recruitment.component';
import { AgGridModule } from 'ag-grid-angular';
import { RecruitDetailComponent } from './recruit-detail/recruit-detail.component';
import { TitleModule} from 'app/main/common-component/title/title.module';
import { StatusRecruitComponent } from './status-recruit/status-recruit.component'
const routes = [
    {
        path: 'teamleader/recruitment',
        component: RecruitmentComponent
    },
    {
        path: 'teamleader/recruitment/detail',
        component: RecruitDetailComponent
    }
];

@NgModule({
    declarations: [
        RecruitmentComponent,
        RecruitDetailComponent,
        StatusRecruitComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        AgGridModule,
        MaterialModule,
        TitleModule
    ],
    exports: [
        RecruitmentComponent
    ]
})

export class RecruitmentModule
{
}
