import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { BranchManagerComponent } from './branch-manager.component';
import { MaterialModule } from '../angular-material/material.module';
import { PendingRoomBookingComponent } from './pending-room-booking/pending-room-booking.component';
import { RoomBookingDetailComponent } from './room-booking-detail/room-booking-detail.component';
import { RoomStatusComponent } from './room-status/room-status.component'
import { CalendarModule } from 'primeng/calendar';
import { TitleModule } from 'app/main/common-component/title/title.module';
import { BottomNavigationModule } from '../common-component/bottom-navigation/bottom-navigation.module';
const routes = [
    {
        path: 'branch-manager',
        component: BranchManagerComponent
    },
    {
        path : 'branch-manager/pending-room-booking',
        component: PendingRoomBookingComponent
    },
    {
        path : 'branch-manager/pending-room-booking/room-booking-detail',
        component: RoomBookingDetailComponent
    },
    {
        path: 'branch-manager/room-status',
        component : RoomStatusComponent
    }
];

@NgModule({
    declarations: [
        BranchManagerComponent,
        PendingRoomBookingComponent,
        RoomBookingDetailComponent,
        RoomStatusComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        CalendarModule,
        TitleModule,
        BottomNavigationModule
    ],
    exports: [
        BranchManagerComponent,
        PendingRoomBookingComponent
    ]
})

export class BranchManagerModule
{
}
