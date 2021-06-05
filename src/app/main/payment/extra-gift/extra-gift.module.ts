import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtraGiftComponent } from './extra-gift.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FooterPaymentModule } from '../footer-payment/footer-payment.module';
import { TitleModule } from 'app/main/common-component/title/title.module';
import { PlaceholderLoadingModule } from '../../common-component/placeholder-loading/placeholder-loading.module';


const routes = [
  {
    path: 'extra-gift',
    component: ExtraGiftComponent
  }
];


@NgModule({
  declarations: [ExtraGiftComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    MaterialModule,
    FuseSharedModule,
    FooterPaymentModule,
    TitleModule,
    PlaceholderLoadingModule
  ],
  exports: [ExtraGiftComponent]
})
export class ExtraGiftModule { }
