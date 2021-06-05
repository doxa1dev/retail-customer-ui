import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { TabsBarComponent } from './tabs-bar.component';
import { MatTabsModule} from '@angular/material/tabs'


@NgModule({
    declarations: [
        TabsBarComponent,
    ],
    imports: [
        TranslateModule,
        // MaterialModule,
        FuseSharedModule,
        MatTabsModule
    ],
    exports: [
        TabsBarComponent
    ]
})

export class TabsBarModule
{
}
