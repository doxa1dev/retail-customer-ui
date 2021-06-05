import { NewsComponent } from "./news.component";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { AlertModule } from 'app/main/_shared/alert/alert.module';
import { NgModule } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { TitleModule } from 'app/main/common-component/title/title.module';
import { BottomNavigationModule } from "app/main/common-component/bottom-navigation/bottom-navigation.module";

const routes = [
    {
        path     : 'news',
        component: NewsComponent
    }
];

@NgModule({
    declarations: [NewsComponent],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AlertModule,
        InfiniteScrollModule,
        CommonModule,
        NgxSpinnerModule,
        TitleModule,
        BottomNavigationModule
    ],
    exports     : [
      NewsComponent
  ]
})
export class NewsModule { }