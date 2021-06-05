import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { HostGiftComponent } from './host-gift.component';
import { TitleModule } from '../../common-component/title/title.module';
import { MaterialModule } from '../../angular-material/material.module';
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';
import { ToastModule } from 'primeng/toast';
import { DialogHostGiftComponent } from 'app/main/common-component/dialog-host-gift/dialog-host-gift.component';
import { SharePipeModule } from '../../_shared/pipe/sharePipe.module';
import { DropdownModule } from 'primeng/dropdown';

const routes = [
    {
        path     : 'advisor/host-gift',
        component: HostGiftComponent
    }
];

@NgModule({
    declarations: [
        HostGiftComponent,
        DialogHostGiftComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        TitleModule,
        BottomNavigationModule,
        ToastModule,
        SharePipeModule,
        DropdownModule
    ],
    exports: [
        HostGiftComponent
    ]
})

export class HostGiftModule
{
}
