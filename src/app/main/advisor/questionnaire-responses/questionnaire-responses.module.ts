
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FuseSharedModule } from '@fuse/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { QuestionnaireResponsesComponent } from './questionnaire-responses.component';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { TitleModule } from 'app/main/common-component/title/title.module';
import { ButtonLoadingModule } from 'app/main/common-component/button-loading/button-loading.module';
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';


const routes = [
    {
        path     : 'advisor/questionnaire-responses',
        component: QuestionnaireResponsesComponent
    }
];

@NgModule({
    declarations: [
        QuestionnaireResponsesComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        MatTabsModule,
        FuseSharedModule,
        MaterialModule,
        TitleModule,
        DropdownModule,
        CalendarModule,
        ButtonLoadingModule,
        MultiSelectModule,
        BottomNavigationModule
    ],
    exports     : [
        QuestionnaireResponsesComponent
    ]
})

export class QuestionnaireResponsesModule
{
}
