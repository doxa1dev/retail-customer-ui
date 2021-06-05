import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';

import { RecruitNewAdvisorDetailComponent } from './recruit-new-advisor-detail.component';
import { CustomerInformationModule } from 'app/main/common-component/customer-information/customer-information.module';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonLoadingModule } from '../../../common-component/button-loading/button-loading.module'
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';

const routes = [
    {
        path     : 'advisor/recruit-new-advisor/detail',
        component: RecruitNewAdvisorDetailComponent
    }
];

@NgModule({
    declarations: [
        RecruitNewAdvisorDetailComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        MatTabsModule,
        FuseSharedModule,
        MaterialModule,
        CustomerInformationModule,
        DropdownModule,
        ButtonLoadingModule,
        BottomNavigationModule
    ],
    exports     : [
        RecruitNewAdvisorDetailComponent
    ]
})

export class RecruitNewAdvisorDetailModule
{
}
