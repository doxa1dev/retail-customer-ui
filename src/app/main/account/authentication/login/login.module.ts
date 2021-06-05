import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { LoginComponent} from './login.component';
import { AlertModule} from '../../../_shared/alert/alert.module';
import { ButtonLoadingModule } from '../../../common-component/button-loading/button-loading.module';
import { TitleModule } from 'app/main/common-component/title/title.module'
import { MatCarouselSlide, MatCarouselSlideComponent } from '@ngmodule/material-carousel';
import { MatCarouselModule } from '@ngmodule/material-carousel';
const routes = [
    {
        path: 'login',
        component: LoginComponent
    }
];

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AlertModule,
        ButtonLoadingModule,
        TitleModule,
        MatCarouselModule.forRoot(),
    ],
    exports: [
        LoginComponent,
    ]
})

export class LoginModule
{
}
