import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { AlertModule } from 'app/main/_shared/alert/alert.module';
import { NgModule } from '@angular/core';
import { NewsDetailComponent } from './news-detail.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { TitleModule } from 'app/main/common-component/title/title.module';
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';

const routes = [
    {
        path     : 'news-detail',
        component: NewsDetailComponent
    }
];

@NgModule({
    declarations: [NewsDetailComponent],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AlertModule,
        NgImageSliderModule,
        TitleModule,
        BottomNavigationModule
    ],
    exports: [
        NewsDetailComponent
    ]
})
export class NewsDetailModule { }