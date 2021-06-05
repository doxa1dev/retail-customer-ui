import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../angular-material/material.module';

import { FuseSharedModule } from '@fuse/shared.module';

import { AlertModule } from '../../_shared/alert/alert.module';
import { DialCodeModule } from '../authentication/dial-code/dial-code.module';

import { QuestionnaireOneComponent } from './questionnaire-one/questionnaire-one.component';
import { QuestionnaireTwoComponent } from './questionnaire-two/questionnaire-two.component';
import { TitleModule } from 'app/main/common-component/title/title.module';
import { DialogCopyLinkComponent } from './dialog-copy-link/dialog-copy-link.component';
import { DialogLoginModule } from 'app/main/common-component/dialog-login/dialog-login.component.module';
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';
// import { DialogLoginComponent } from 'app/main/common-component/dialog-login/dialog-login.component';


const routes: Routes = [
    {
        path: 'one',
        component: QuestionnaireOneComponent
    },
    {
        path: 'two',
        component: QuestionnaireTwoComponent
    },
];

@NgModule({
    declarations: [
        QuestionnaireOneComponent,
        QuestionnaireTwoComponent,
        DialogCopyLinkComponent,
        // DialogLoginComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        MaterialModule,
        AlertModule,
        DialCodeModule,
        FuseSharedModule,
        TitleModule,
        DialogLoginModule,
        BottomNavigationModule
        // DialogLoginComponent
    ],
    exports: [
        RouterModule,
        QuestionnaireOneComponent,
        QuestionnaireTwoComponent
    ]
})

export class QuestionnaireModule {
}
