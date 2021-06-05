import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../../angular-material/material.module'
import { AdvisorUnboxComponent } from './advisor-unbox.component'
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ButtonLoadingModule} from 'app/main/common-component/button-loading/button-loading.module';
import { TitleModule} from 'app/main/common-component/title/title.module';

const routes = [
    {
        path: 'advisor-unbox',
        component: AdvisorUnboxComponent
    }
];

@NgModule({
    declarations: [
        AdvisorUnboxComponent
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
        AdvisorUnboxComponent
    ]
})

export class AdvisorUnboxModule
{
}
