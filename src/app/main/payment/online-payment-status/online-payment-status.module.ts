import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlinePaymentStatusComponent } from './online-payment-status.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../angular-material/material.module'

import { FuseSharedModule } from '@fuse/shared.module';
import { FooterPaymentModule } from '../footer-payment/footer-payment.module';



@NgModule({
declarations: [OnlinePaymentStatusComponent],
imports: [
  CommonModule,
    TranslateModule,
    MaterialModule,
    FuseSharedModule,
    FooterPaymentModule
],
  exports: [
   OnlinePaymentStatusComponent
]
})
export class OnlinePaymentStatusModule { }
