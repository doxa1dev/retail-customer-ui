import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// import { MaterialModule } from '../../angular-material/material.module';

import { FuseSharedModule } from '@fuse/shared.module';

import { TabsBarComponent } from './tabs-bar.component';
import { MatTabsModule} from '@angular/material/tabs'
import { TitleModule} from 'app/main/common-component/title/title.module'

@NgModule({
    declarations: [
        TabsBarComponent,
    ],
    imports: [
       
        
        TranslateModule,
        // MaterialModule,
        FuseSharedModule,
        MatTabsModule,
       
        TitleModule
    ],
    exports: [
        TabsBarComponent
    ]
})

export class TabsBarModule
{
}
