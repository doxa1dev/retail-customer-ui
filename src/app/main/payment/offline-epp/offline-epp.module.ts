import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfflineEppComponent } from './offline-epp.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FooterPaymentModule } from '../footer-payment/footer-payment.module';
import { AlertModule } from 'app/main/_shared/alert/alert.module';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { TitleModule } from 'app/main/common-component/title/title.module';

const routes = [
  {
      path: 'offline-epp',
      component: OfflineEppComponent
  }
];

@NgModule({
  declarations: [OfflineEppComponent],
  imports: [
    RouterModule.forChild(routes),

    CommonModule,
    TranslateModule,
    MaterialModule,
    FuseSharedModule,
    FooterPaymentModule,
    AlertModule, 
    DropdownModule,
    TitleModule
  ], 
  exports: [OfflineEppComponent]
})
export class OfflineEPPModule { }
