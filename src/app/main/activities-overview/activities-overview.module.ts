import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../angular-material/material.module'
import { FuseSharedModule } from '@fuse/shared.module';
import { ActivitiesOverviewComponent } from './activities-overview.component';
import { FindClassComponent} from './find-class/find-class.component';
import { BookingDoneComponent} from './booking-done/booking-done.component';
import { ClassInformationComponent  } from './class-information/class-information.component';
import { UpcommingActivitiesComponent } from './upcomming-activities/upcomming-activities.component';
import { CalendarModule } from 'primeng/calendar';
import { ButtonLoadingModule } from '../common-component/button-loading/button-loading.module'
import { TitleModule} from 'app/main/common-component/title/title.module';
import { BottomNavigationModule } from '../common-component/bottom-navigation/bottom-navigation.module';
const routes = [
    {
        path     : 'activity-overview',
        component: ActivitiesOverviewComponent
    },
    {
        path: 'activity-overview/find-classes',
        component: FindClassComponent
    }, 
    {
        path: 'activity-overview/booking-done',
        component: BookingDoneComponent
    },
    {
        path: 'activity-overview/class-information',
        component: ClassInformationComponent
    },
    {
        path: 'activity-overview/view-class',
        component: UpcommingActivitiesComponent
    },
];

@NgModule({
    declarations: [
        ActivitiesOverviewComponent,
        FindClassComponent,
        BookingDoneComponent, ClassInformationComponent,UpcommingActivitiesComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        MaterialModule,
        CalendarModule,
        ButtonLoadingModule,
        TitleModule,
        BottomNavigationModule
    ],
    exports     : [
        ActivitiesOverviewComponent,
    ]
})

export class ActivitiesOverviewModule
{
}
