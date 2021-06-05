import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { VerifyEmailComponent } from './verify-email.component'

const routes = [
    {
        path: 'verify/email/:id',
        component: VerifyEmailComponent
    }
];

@NgModule({
    declarations: [
        VerifyEmailComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        VerifyEmailComponent,
    ]
})

export class VerifyEmailModule
{
}
