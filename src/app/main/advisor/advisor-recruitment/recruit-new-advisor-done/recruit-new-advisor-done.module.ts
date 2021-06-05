import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';

import { RecruitNewAdvisorDoneComponent } from './recruit-new-advisor-done.component';
import { TitleModule} from 'app/main/common-component/title/title.module'
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';

const routes = [
    {
        path     : 'advisor/recruit-new-advisor-done',
        component: RecruitNewAdvisorDoneComponent
    }
];

@NgModule({
    declarations: [
        RecruitNewAdvisorDoneComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        MatTabsModule,
        FuseSharedModule,
        MaterialModule,
        TitleModule,
        BottomNavigationModule
    ],
    exports     : [
        RecruitNewAdvisorDoneComponent
    ]
})

export class RecruitNewAdvisorDoneModule
{
}
