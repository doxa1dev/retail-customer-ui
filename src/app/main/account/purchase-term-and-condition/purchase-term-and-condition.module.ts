import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { AlertModule } from 'app/main/_shared/alert/alert.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleModule } from 'app/main/common-component/title/title.module';
import { PurchaseTermAndConditionComponent } from './purchase-term-and-condition.component'

const routes = [
    {
        path     : 'purchase-term-condition',
        component: PurchaseTermAndConditionComponent
    }
];

@NgModule({
    declarations: [PurchaseTermAndConditionComponent],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AlertModule,
        CommonModule,
        TitleModule
    ],
    exports     : [
        PurchaseTermAndConditionComponent
  ]
})
export class PurchaseTermAndConditionModule { }