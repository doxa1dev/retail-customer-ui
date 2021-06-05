import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { RegisterComponent } from './register.component';
import { AlertModule } from '../../../_shared/alert/alert.module';
import { DialCodeModule } from '../dial-code/dial-code.module';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordDirective} from './password.directive';
import { RegisterDoneComponent } from './../register-done/register-done.component'
const routes = [
    // {
    //     path: ':advisorId',
    //     component: RegisterComponent
    // },

    // {
    //     path: 'register',
    //     component: RegisterComponent
    // },

    // {
    //     path: 'register/:advisorId',
    //     component: RegisterComponent
    // },
    
    
    {
        path: 'auth/register',
        component: RegisterComponent
    },

    {
        path: 'auth/register/done',
        component: RegisterDoneComponent
    },
];

@NgModule({
    declarations: [
        RegisterComponent,
        PasswordDirective,
        RegisterDoneComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AlertModule,
        DialCodeModule,
        DropdownModule
    ],
    exports: [
        RouterModule,
        RegisterComponent,
        RegisterDoneComponent
    ]
})

export class RegisterModule
{
}
