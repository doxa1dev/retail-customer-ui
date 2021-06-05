import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { BecomeAnAdvisorComponent } from './become-an-advisor.component';
import { MaterialModule } from '../angular-material/material.module';
import { BecomeAdvisorDoneComponent } from './become-advisor-done/become-advisor-done.component';
import { ButtonLoadingModule } from '../common-component/button-loading/button-loading.module'
const routes = [
    {
        path     : 'become-an-advisor',
        component: BecomeAnAdvisorComponent
    },
    {
        path     : 'become-an-advisor-done',
        component: BecomeAdvisorDoneComponent
    }
];

@NgModule({
    declarations: [
        BecomeAnAdvisorComponent,
        BecomeAdvisorDoneComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MaterialModule,
        TranslateModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        FuseSharedModule,
        ButtonLoadingModule
    ],
    exports     : [
        BecomeAnAdvisorComponent
    ]
})

export class BecomeAnAdvisorModule
{
}
