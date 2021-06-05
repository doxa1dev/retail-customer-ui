import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurringPaymentComponent } from './recurring-payment.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FooterPaymentModule } from '../footer-payment/footer-payment.module';
import { RouterModule } from '@angular/router';
import { TitleModule } from 'app/main/common-component/title/title.module';


const routes = [
  {
      path: 'recurring-payment',
      component: RecurringPaymentComponent
  }
];

@NgModule({
  declarations: [RecurringPaymentComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,  
    TranslateModule,
    MaterialModule,
    FuseSharedModule,
    FooterPaymentModule,
    TitleModule
  ],
  exports: [
    RecurringPaymentComponent
]
})
export class RecurringPaymentModule { }
