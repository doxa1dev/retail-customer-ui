import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../angular-material/material.module';
import { DropdownModule } from 'primeng/dropdown';
import { ApplyNewAdvisorEarningProgramComponent} from './apply-new-advisor-earning-program.component'
import { TitleModule } from 'app/main/common-component/title/title.module';
import { ButtonLoadingModule } from 'app/main/common-component/button-loading/button-loading.module';
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';

const routes = [
    {
        path     : 'advisor-earning-program/apply-new-advior-earning-program',
        component: ApplyNewAdvisorEarningProgramComponent
    }
];

@NgModule({
    declarations: [
        ApplyNewAdvisorEarningProgramComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        MatTabsModule,
        FuseSharedModule,
        MaterialModule,
        DropdownModule,
        TitleModule,
        ButtonLoadingModule,
        BottomNavigationModule
    ],
    exports     : [
        ApplyNewAdvisorEarningProgramComponent
    ]
})

export class RecruitNewAdvisorDetailModule
{
}
