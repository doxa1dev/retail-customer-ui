import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileModule } from './my-profile/my-profile.module';
import { TranslateModule } from '@ngx-translate/core';
 
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MyProfileModule,
    TranslateModule
  ]
})
export class ProfileModule { }
