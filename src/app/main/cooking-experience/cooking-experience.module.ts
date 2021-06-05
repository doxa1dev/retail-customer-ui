import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { CookingExperienceComponent} from './cooking-experience.component';

const routes = [
    {
        path     : 'cooking-experience',
        component: CookingExperienceComponent
    }
];

@NgModule({
    declarations: [
        CookingExperienceComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule
    ],
    exports     : [
        CookingExperienceComponent
    ]
})

export class CookingExperienceModule
{
}
