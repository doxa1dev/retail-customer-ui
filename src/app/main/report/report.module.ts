import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../angular-material/material.module';
import { ReportComponent } from './report.component';
import { TitleModule } from '../common-component/title/title.module';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonLoadingModule } from '../common-component/button-loading/button-loading.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { BottomNavigationModule } from '../common-component/bottom-navigation/bottom-navigation.module';
const routes = [
    {
        path     : 'reports',
        component: ReportComponent
    }
];

@NgModule({
    declarations: [
        ReportComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        MatTabsModule,
        FuseSharedModule,
        MaterialModule,
        TitleModule,
        DropdownModule,
        CalendarModule,
        ButtonLoadingModule,
        MultiSelectModule,
        BottomNavigationModule
    ],
    exports     : [
        ReportComponent
    ]
})

export class ReportModule
{
}
