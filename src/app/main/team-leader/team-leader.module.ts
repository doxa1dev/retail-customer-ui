import { NgModule } from '@angular/core';
import { MyAdvisorModule } from './my-advisor/my-advisor.module';
import { RecruitmentModule } from './recruitment/recruitment.module';


@NgModule({
    imports     : [
        MyAdvisorModule,
        RecruitmentModule
    ],
    exports     : [
        //TeamLeaderComponent
    ],
    declarations: []
})

export class TeamLeaderModule
{
}
