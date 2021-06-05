import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../angular-material/material.module';
import { AlertModule } from '../../../_shared/alert/alert.module';

import { FuseSharedModule } from '@fuse/shared.module';

import { ForgotPasswordComponent } from './forgot-password.component';

// const routes = [
//     {
//         path: 'auth/forgot',
//         component: ForgotPasswordComponent
//     }
// ];

@NgModule({
    declarations: [
        ForgotPasswordComponent
    ],
    imports: [
        RouterModule,
        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        AlertModule
    ],
    exports: [
        ForgotPasswordComponent,
    ]
})

export class ForgotPasswordModule { }
