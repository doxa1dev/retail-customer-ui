import { NgModule } from '@angular/core';

import { ClassesModule } from './activities/activities.module';
import { CustomerOrdersModule } from './customerorders/customerorders.module';
import { MySalesModule } from './mysales/mysales.module';
import { AdvisorRecruitmentModule } from './advisor-recruitment/advisor-recruitment.module';
import { PlaceholderLoadingModule } from '../common-component/placeholder-loading/placeholder-loading.module';
import { MyCustomersModule } from './my-customers/my-customers.module';
import { QuestionnaireResponsesModule } from './questionnaire-responses/questionnaire-responses.module';
import { HostGiftModule } from './host-gift/host-gift.module';
import { JustHostModule } from './just-host/just-host.module';

@NgModule({

    imports     : [
        ClassesModule,
        CustomerOrdersModule,
        MySalesModule,
        AdvisorRecruitmentModule,
        PlaceholderLoadingModule,
        MyCustomersModule,
        QuestionnaireResponsesModule,
        HostGiftModule,
        JustHostModule
    ],
    exports     : [
        //AdvisorComponent
    ],
    declarations: []
})

export class AdvisorModule
{
}
