import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon'
import { FuseSharedModule } from '@fuse/shared.module';

import { AggridComponent } from './aggrid.component'

const routes = [
    {
        path: 'grid',
        component: AggridComponent
    }
];

@NgModule({
    declarations: [
        AggridComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        MatButtonModule,
        MatIconModule
    ],
    exports: [
        AggridComponent
    ]
})

export class AggridModule
{
}
