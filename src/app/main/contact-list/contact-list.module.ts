import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../angular-material/material.module';
import { TitleModule } from '../common-component/title/title.module';
import { ContactListComponent } from './contact-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { BottomNavigationModule } from '../common-component/bottom-navigation/bottom-navigation.module';


const routes = [
   {
     path : 'contact-list',
     component: ContactListComponent
   },
   {
    path : 'contact-list/detail',
    component: ContactDetailComponent
  }
]

@NgModule({
  declarations: [
      ContactListComponent,
      ContactDetailComponent
  ],
  imports     : [
      RouterModule.forChild(routes),
      TranslateModule,
      FuseSharedModule,
      MaterialModule,
      TitleModule,
      BottomNavigationModule

  ],
  exports     : [
      ContactListComponent
  ]
})
export class ContactListModule {

}