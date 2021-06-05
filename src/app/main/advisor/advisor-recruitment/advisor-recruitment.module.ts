import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../angular-material/material.module';
import { AgGridModule } from 'ag-grid-angular';

import { AdvisorRecruitmentComponent } from './advisor-recruitment.component';
import { RecruitNewAdvisorModule } from './recruit-new-advisor/recruit-new-advisor.module';
import { RecruitNewAdvisorComponent } from './recruit-new-advisor/recruit-new-advisor.component';
import { RecruitNewAdvisorDetailComponent } from './recruit-new-advisor-detail/recruit-new-advisor-detail.component';
import { RecruitNewAdvisorDetailModule } from './recruit-new-advisor-detail/recruit-new-advisor-detail.module';
import { DropdownModule } from 'primeng/dropdown';
import { RecruitNewAdvisorDoneComponent } from './recruit-new-advisor-done/recruit-new-advisor-done.component';
import { RecruitNewAdvisorDoneModule } from './recruit-new-advisor-done/recruit-new-advisor-done.module';
import { TitleModule} from 'app/main/common-component/title/title.module';
import { RecruitCustomerInfoComponent } from './recruit-customer-info/recruit-customer-info.component'
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';
import { ButtonLoadingModule } from 'app/main/common-component/button-loading/button-loading.module';

const routes = [
    {
        path     : 'advisor/recruitment',
        component: AdvisorRecruitmentComponent
    },
    {
        path     : 'advisor/recruit-new-advisor',
        component: RecruitNewAdvisorComponent
    },
    {
        path     : 'advisor/recruit-new-advisor/detail',
        component: RecruitNewAdvisorDetailComponent
    },
    {
        path     : 'advisor/recruit-new-advisor-done',
        component: RecruitNewAdvisorDoneComponent
    },
    { 
        
        path     : 'advisor/recruitment/customer-naep-infomation',
        component: RecruitCustomerInfoComponent
    }

];

@NgModule({
    declarations: [
        AdvisorRecruitmentComponent,
        RecruitCustomerInfoComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        MatTabsModule,
        FuseSharedModule,
        MaterialModule,
        AgGridModule,
        RecruitNewAdvisorModule,
        RecruitNewAdvisorDetailModule,
        RecruitNewAdvisorDoneModule,
        DropdownModule,
        TitleModule,
        BottomNavigationModule,
        ButtonLoadingModule
    ],
    exports     : [
        AdvisorRecruitmentComponent
    ]
})

export class AdvisorRecruitmentModule
{
}
