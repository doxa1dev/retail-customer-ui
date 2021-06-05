import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurringSubscriptionStatusComponent } from './recurring-subscription-status.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { FooterPaymentModule } from '../footer-payment/footer-payment.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';


const routes = [
  {
      path: 'recurring-subscription-status',
      component: RecurringSubscriptionStatusComponent
  }
];

@NgModule({
  declarations: [RecurringSubscriptionStatusComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
      TranslateModule,
      MaterialModule,
      FuseSharedModule,
      FooterPaymentModule
  ],
    exports: [
      RecurringSubscriptionStatusComponent
  ]
})
export class RecurringSubscriptionStatusModule { }
