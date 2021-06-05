import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../../angular-material/material.module'
import { AdvisorMarkNoUnboxComponent } from './advisor-mark-no-unbox.component'
import { TitleModule} from 'app/main/common-component/title/title.module';

const routes = [
    {
        path: 'advisor-no-unbox',
        component: AdvisorMarkNoUnboxComponent
    }
];

@NgModule({
    declarations: [
        AdvisorMarkNoUnboxComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        TitleModule
        

    ],
    exports: [
        AdvisorMarkNoUnboxComponent
    ]
})

export class AdvisorMarkNoUnboxModule
{
}
