import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../../angular-material/material.module'
import { AdvisorMarkNoHostComponent } from './advisor-mark-no-host.component'
import { TitleModule} from 'app/main/common-component/title/title.module';

const routes = [
    {
        path: 'advisor-no-host',
        component: AdvisorMarkNoHostComponent
    }
];

@NgModule({
    declarations: [
        AdvisorMarkNoHostComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        TitleModule

    ],
    exports: [
        AdvisorMarkNoHostComponent
    ]
})

export class AdvisorMarkNoHostModule
{
}
