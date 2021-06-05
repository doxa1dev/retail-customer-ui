import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { FuseSharedModule } from '@fuse/shared.module';

import { AdvisorNewEarningProgramComponent } from './advisor-new-earning-program.component';
import { MaterialModule }  from 'app/main/angular-material/material.module';
import { TitleModule} from 'app/main/common-component/title/title.module';
import { ApplyNewAdvisorEarningProgramComponent } from './apply-new-advisor-earning-program/apply-new-advisor-earning-program.component';
import { BuyPacketNaepSuccessComponent } from './buy-packet-naep-success/buy-packet-naep-success.component';
import { SelectPackageNaepComponent } from './select-package-naep/select-package-naep.component';
import { ButtonLoadingModule } from '../common-component/button-loading/button-loading.module';
import { ApplyNaepErrorComponent } from './apply-naep-error/apply-naep-error.component';
import { RecruitNewAdvisorDoneComponent } from './recruit-new-advisor-done/recruit-new-advisor-done.component';
import { SelectAdvisorComponent } from './select-advisor/select-advisor.component';
import { DialogSelectAdvisorComponent } from './dialog-select-advisor/dialog-select-advisor.component';
import { BuyPacketNaepComponent } from './buy-packet-naep/buy-packet-naep.component';
import { NaepInductionFormOneComponent } from './naep-form/naep-induction-form-one/naep-induction-form-one.component';
import { NaepInductionFormThreeComponent } from './naep-form/naep-induction-form-three/naep-induction-form-three.component';
import { NaepInductionFormViewComponent } from './naep-form/naep-induction-form-view/naep-induction-form-view.component';
import { NaepRecruitSaleStatusComponent } from './naep-form/naep-recruit-sale-status/naep-recruit-sale-status.component';
import { DialCodeModule } from '../account/authentication/dial-code/dial-code.module';
import { CalendarModule} from 'primeng/calendar';
import { GettingToKnowYouComponent } from './naep-form/getting-to-know-you/getting-to-know-you.component';
import { DialogAlertComponent } from './dialog-alert/dialog-alert.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { PlaceholderLoadingModule } from '../common-component/placeholder-loading/placeholder-loading.module';
import { DialogPropertiesComponent } from './dialog-properties/dialog-properties.component';
import { BottomNavigationModule } from '../common-component/bottom-navigation/bottom-navigation.module';
import { BuyPackageNaepImproveComponent } from './buy-package-naep-improve/buy-package-naep-improve.component';
import { SwiperModule } from 'swiper/angular';
import { NaepImproveComponent } from './naep-improve/naep-improve.component';

const routes = [
    {
        path: 'advisor-earning-program',
        component: AdvisorNewEarningProgramComponent
    },
    {
        path: 'advisor-earning-program/apply-new-advior-earning-program',
        component: ApplyNewAdvisorEarningProgramComponent
    },
    {
        path: 'advisor-earning-program/buy-packet-naep' ,
        component : BuyPacketNaepComponent
    },
    {
        path: 'advisor-earning-program/buy-packet-naep-success' ,
        component : BuyPacketNaepSuccessComponent
    },
    {
        path: 'advisor-earning-program/select-package-naep' ,
        component : SelectPackageNaepComponent
    },
    {
        path: 'advisor-earning-program/apply-naep-error' ,
        component : ApplyNaepErrorComponent
    },
    {
        path: 'advisor-earning-program/recruit-new-advisor-done' ,
        component : RecruitNewAdvisorDoneComponent
    },
    {
        path: 'advisor-earning-program/select-advisor' ,
        component : SelectAdvisorComponent
    },
    {
        path: 'advisor-earning-program/induction-form-one' ,
        component : NaepInductionFormOneComponent
    },
    {
        path: 'advisor-earning-program/induction-form-three' ,
        component : NaepInductionFormThreeComponent
    },
    {
        path: 'advisor-earning-program/form-view' ,
        component : NaepInductionFormViewComponent
    },
    {
        path: 'advisor-earning-program/recruit-sale-status' ,
        component : NaepRecruitSaleStatusComponent
    },
    {
        path: 'advisor-earning-program/getting-to-know-you' ,
        component : GettingToKnowYouComponent
    },
    {
        path: 'advisor-earning-program/buy-packet-naep-improve' ,
        component : BuyPackageNaepImproveComponent
    },
];

@NgModule({
    declarations: [
        AdvisorNewEarningProgramComponent,
        ApplyNewAdvisorEarningProgramComponent,
        BuyPacketNaepComponent,
        BuyPacketNaepSuccessComponent,
        SelectPackageNaepComponent,
        ApplyNaepErrorComponent,
        RecruitNewAdvisorDoneComponent,
        SelectAdvisorComponent,
        DialogSelectAdvisorComponent,
        NaepInductionFormOneComponent,
        NaepInductionFormThreeComponent,
        NaepInductionFormViewComponent,
        NaepRecruitSaleStatusComponent,
        GettingToKnowYouComponent,
        DialogAlertComponent,
        DialogPropertiesComponent,
        BuyPackageNaepImproveComponent,
        NaepImproveComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,

        MaterialModule,
        DialCodeModule,
        TitleModule,
        DropdownModule,
        ButtonLoadingModule,
        CalendarModule,
        NgxMaterialTimepickerModule,
        PlaceholderLoadingModule,
        BottomNavigationModule,
        SwiperModule
    ],
    exports: [
        AdvisorNewEarningProgramComponent
    ]
})

export class AdvisorNewEarningProgramModule
{
}
