
import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { CheckOutImproveComponent } from './check-out-improve.component';
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
import { SharePipeModule} from 'app/main/_shared/pipe/sharePipe.module'
import { ButtonLoadingModule } from '../common-component/button-loading/button-loading.module';



//MatNativeDateModule, MatMomentDateModule

const routes = [
    {
        path     : 'check-out-improve',
        component: CheckOutImproveComponent
    }
];

@NgModule({
    declarations: [
        CheckOutImproveComponent
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
        SharePipeModule,
        ButtonLoadingModule
    ],
    exports     : [
        CheckOutImproveComponent
    ]
})

export class CheckOutImproveModule
{
    
}
