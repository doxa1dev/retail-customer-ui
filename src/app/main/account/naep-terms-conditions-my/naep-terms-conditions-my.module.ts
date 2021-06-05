import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { AlertModule } from 'app/main/_shared/alert/alert.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleModule } from 'app/main/common-component/title/title.module';
import { NaepTermsConditionsMyComponent } from './naep-terms-conditions-my.component';
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';

const routes = [
    {
        path     : 'naep-terms-conditions-my',
        component: NaepTermsConditionsMyComponent
    }
];

@NgModule({
    declarations: [NaepTermsConditionsMyComponent],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AlertModule,
        CommonModule,
        TitleModule,
        BottomNavigationModule
    ],
    exports     : [
        NaepTermsConditionsMyComponent
  ]
})
export class NaepTermsConditionsMyModule { }