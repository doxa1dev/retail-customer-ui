import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../angular-material/material.module';
import { FooterPaymentComponent } from './footer-payment.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    declarations: [
        FooterPaymentComponent  
    ],
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule
    ],
    exports: [ 
        CommonModule,
        FooterPaymentComponent
    ]
})

export class FooterPaymentModule
{
}
