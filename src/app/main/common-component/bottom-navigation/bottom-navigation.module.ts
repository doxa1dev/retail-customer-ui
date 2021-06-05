import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { BottomNavigationComponent } from './bottom-navigation.component';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
        BottomNavigationComponent
    ],
    imports: [
        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        RouterModule
    ],
    exports: [
        BottomNavigationComponent
    ]
})

export class BottomNavigationModule {
}
