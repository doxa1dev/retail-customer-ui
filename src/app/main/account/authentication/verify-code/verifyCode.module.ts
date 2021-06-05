import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { VerifyCodeComponent } from './verify-code.component'
import { CountdownModule } from 'ngx-countdown';
import { NumberDirective } from './numbers-only.directive';
import { VerifyDoneComponent } from './../verify-done/verify-done.component'
const routes = [
    {
        path: 'auth/verify',
        component: VerifyCodeComponent
    },
    {
        path: 'auth/verify-done',
        component: VerifyDoneComponent
    }
];

@NgModule({
    declarations: [
        VerifyCodeComponent,
        NumberDirective,
        VerifyDoneComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        CountdownModule
    ],
    exports: [
        VerifyCodeComponent,
        VerifyDoneComponent
    ]
})

export class VerifyCodeModule
{
}
