import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallmentConfirmComponent } from './installment-confirm.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FooterPaymentModule } from '../footer-payment/footer-payment.module';
import { AlertModule } from 'app/main/_shared/alert/alert.module';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';

const routes = [
  {
      path: 'installment-confirm',
      component: InstallmentConfirmComponent
  }
];

@NgModule({
  declarations: [InstallmentConfirmComponent],
  imports: [
    RouterModule.forChild(routes),

    CommonModule,
    TranslateModule,
    MaterialModule,
    FuseSharedModule,
    FooterPaymentModule,
    AlertModule, 
    DropdownModule,
  ], 
  exports: [InstallmentConfirmComponent]
})
export class InstallmentConfirmModule { }
