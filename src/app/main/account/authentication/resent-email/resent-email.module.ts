import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../angular-material/material.module';
import { AlertModule } from '../../../_shared/alert/alert.module';

import { FuseSharedModule } from '@fuse/shared.module';

import { ResentEmailComponent } from './resent-email.component';

@NgModule({
    declarations: [
        ResentEmailComponent
    ],
    imports: [
        RouterModule,
        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        AlertModule
    ],
    exports: [
        ResentEmailComponent,
    ]
})

export class ResentEmailModule { }
