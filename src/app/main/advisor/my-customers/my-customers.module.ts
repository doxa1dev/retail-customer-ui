
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FuseSharedModule } from '@fuse/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { MyCustomersComponent } from './my-customers.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerQuestionnaireOneComponent } from './customer-questionnaire-one/customer-questionnaire-one.component';
import { CustomerQuestionnaireTwoComponent } from './customer-questionnaire-two/customer-questionnaire-two.component';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { TitleModule } from 'app/main/common-component/title/title.module';
import { ButtonLoadingModule } from 'app/main/common-component/button-loading/button-loading.module';
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';


const routes = [
    {
        path     : 'advisor/my-customers',
        component: MyCustomersComponent
    },
    {
        path     : 'advisor/my-customers/detail',
        component: CustomerDetailComponent
    },
    {
        path     : 'advisor/my-customers/questionnaire-one',
        component: CustomerQuestionnaireOneComponent
    },
    {
        path     : 'advisor/my-customers/questionnaire-two',
        component: CustomerQuestionnaireTwoComponent
    }
];

@NgModule({
    declarations: [
        MyCustomersComponent,
        CustomerDetailComponent,
        CustomerQuestionnaireOneComponent,
        CustomerQuestionnaireTwoComponent
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
        MyCustomersComponent
    ]
})

export class MyCustomersModule
{
}
