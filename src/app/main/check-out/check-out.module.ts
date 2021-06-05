
import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { CheckoutComponent } from './check-out.component';
import { MaterialModule} from '../angular-material/material.module'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {CalendarModule} from 'primeng/calendar';
import { FooterPayModule } from '../footer-pay/footer-pay.module';
import { DialCodeModule } from '../account/authentication/dial-code/dial-code.module';

import { AlertModule } from 'app/main/_shared/alert/alert.module'
import { TitleModule } from '../common-component/title/title.module';
import { PlaceholderLoadingModule } from '../common-component/placeholder-loading/placeholder-loading.module';
import { DropdownModule } from 'primeng/dropdown';

//MatNativeDateModule, MatMomentDateModule

const routes = [
    {
        path     : 'check-out',
        component: CheckoutComponent
    }
];

@NgModule({
    declarations: [
        CheckoutComponent
    ],
    imports     : 
    [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        CalendarModule,
        FooterPayModule,
        DialCodeModule,
        AlertModule,
        TitleModule,
        PlaceholderLoadingModule,
        DropdownModule,
       
    ],
    exports     : [
        CheckoutComponent
    ]
})

export class CheckoutModule
{
    
}
