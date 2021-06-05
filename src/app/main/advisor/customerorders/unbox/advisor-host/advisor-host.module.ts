import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../../angular-material/material.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AdvisorHostComponent } from './advisor-host.component';
import { ButtonLoadingModule } from 'app/main/common-component/button-loading/button-loading.module'
import { TitleModule} from 'app/main/common-component/title/title.module';

const routes = [
    {
        path: 'advisor-host',
        component: AdvisorHostComponent
    }
];

@NgModule({
    declarations: [
        AdvisorHostComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        ZXingScannerModule,
        ButtonLoadingModule,
        TitleModule
    ],
    exports: [
        AdvisorHostComponent
    ]
})

export class AdvisorHostModule
{
}
