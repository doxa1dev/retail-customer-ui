import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';

import { RecruitNewAdvisorComponent } from './recruit-new-advisor.component';
import { CustomerInformationModule } from 'app/main/common-component/customer-information/customer-information.module';
import { TitleModule} from 'app/main/common-component/title/title.module'
import { ButtonLoadingModule } from 'app/main/common-component/button-loading/button-loading.module';
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';

const routes = [
    {
        path     : 'advisor/recruit-new-advisor',
        component: RecruitNewAdvisorComponent
    }
];

@NgModule({
    declarations: [
        RecruitNewAdvisorComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        MatTabsModule,
        FuseSharedModule,
        MaterialModule,
        CustomerInformationModule,
        TitleModule,
        ButtonLoadingModule,
        BottomNavigationModule
    ],
    exports     : [
        RecruitNewAdvisorComponent
    ]
})

export class RecruitNewAdvisorModule
{
}
