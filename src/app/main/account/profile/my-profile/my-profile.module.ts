import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from '../my-profile/my-profile.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { AlertModule } from '../../../_shared/alert/alert.module';
import { ToolbarModule } from '../../../../layout/components/toolbar/toolbar.module';
import { ToolbarComponent } from '../../../../layout/components/toolbar/toolbar.component';
import { PasswordDirective} from './re-password.directive'
import { TitleModule } from 'app/main/common-component/title/title.module';
import { BottomNavigationModule } from 'app/main/common-component/bottom-navigation/bottom-navigation.module';
const routes = [
  {
      path     : 'my-profile',
      component: MyProfileComponent
  }
];

@NgModule({
  declarations: [MyProfileComponent, PasswordDirective],
  imports: [
    // CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    FuseSharedModule,
    MaterialModule,
    AlertModule,
    RouterModule,
    TitleModule,
    BottomNavigationModule
  ],
  exports     : [
    MyProfileComponent
]
})
export class MyProfileModule { }
