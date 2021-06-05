import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { JustHostComponent } from './just-host.component';
import { TitleModule } from '../../common-component/title/title.module';
import { MaterialModule } from '../../angular-material/material.module';
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';
import { ToastModule } from 'primeng/toast';
import { SharePipeModule } from '../../_shared/pipe/sharePipe.module';
import { DropdownModule } from 'primeng/dropdown';
import { FormJustHostComponent } from './form-just-host/form-just-host.component';
import { DetailEventComponent } from './detail-event/detail-event.component';
import { CalendarModule } from 'primeng/calendar';

const routes = [
    {
        path     : 'advisor/just-host',
        component: JustHostComponent
    },
    {
        path     : 'advisor/just-host-event-form',
        component: FormJustHostComponent
    },
    {
        path     : 'advisor/detail-event-form',
        component: DetailEventComponent
    }
];

@NgModule({
    declarations: [
        JustHostComponent,
        FormJustHostComponent,
        DetailEventComponent
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
        DropdownModule,
        CalendarModule
    ],
    exports: [
        JustHostComponent
    ]
})

export class JustHostModule
{
}
