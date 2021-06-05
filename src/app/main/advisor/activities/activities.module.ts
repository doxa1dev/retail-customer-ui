// import { TitleModule } from './../../common-component/title/title.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../angular-material/material.module'
import { FuseSharedModule } from '@fuse/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ActivitiesComponent } from './activities.component';
import { UpcommingActivitiesComponent } from './upcomming-activities/upcomming-activities.component';
import { ActivityInformationComponent } from './activity-information/activity-information.component';
import { ActivityAttendeeComponent } from './activity-attendee/activity-attendee.component';
import { CreateActivityComponent } from './create-activity/create-activity.component';
import { DialCodeModule} from '../../account/authentication/dial-code/dial-code.module';
import {CalendarModule} from 'primeng/calendar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { ActivityEditComponent } from './activity-edit/activity-edit.component';
import { ScanAttendeeComponent} from './scan-attendee/scan-attendee.component'
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ButtonLoadingModule } from 'app/main/common-component/button-loading/button-loading.module';
import { TitleModule} from 'app/main/common-component/title/title.module';
import { NewAttendeeComponent } from './new-attendee/new-attendee.component'
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';
const routes = [
    {
        path     : 'advisor/activities/activity-edit',
        component: ActivityEditComponent
    },
    {
        path     : 'advisor/activities',
        component: ActivitiesComponent
    },
    {
        path: 'advisor/activities/upcoming-activities',
        component: UpcommingActivitiesComponent
    },
    {
        path: 'advisor/activities/create-activity',
        component: CreateActivityComponent
    },
    {
        path: 'advisor/activities/activity-infomation',
        component: ActivityInformationComponent
    },
    {
        path: 'advisor/activities/activity-attendee',
        component: ActivityAttendeeComponent
    },
    {
        path : 'advisor/activities/scan-attendee',
        component : ScanAttendeeComponent
    }
];

@NgModule({
    declarations: [
        ActivitiesComponent,
        UpcommingActivitiesComponent,
        ActivityInformationComponent,
        ActivityAttendeeComponent,
        CreateActivityComponent,
        ActivityEditComponent,
        ScanAttendeeComponent,
        NewAttendeeComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        NgxMaterialTimepickerModule,
        MatProgressButtonsModule,
        TranslateModule,
        CalendarModule,
        FuseSharedModule,
        DropdownModule,
        MultiSelectModule,
        MaterialModule,
        DialCodeModule,
        MatDatepickerModule,
        ZXingScannerModule,
        ButtonLoadingModule,
        TitleModule,
        BottomNavigationModule
    ],
    exports     : [
        ActivitiesComponent,
        DialCodeModule
    ]
})

export class ClassesModule
{
}
