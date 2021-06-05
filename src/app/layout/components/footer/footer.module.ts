import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';

import { FooterComponent } from 'app/layout/components/footer/footer.component';
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';

@NgModule({
    declarations: [
        FooterComponent
    ],
    imports     : [
        RouterModule,

        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        BottomNavigationModule,
        FuseSharedModule
    ],
    exports     : [
        FooterComponent
    ]
})
export class FooterModule
{
}
