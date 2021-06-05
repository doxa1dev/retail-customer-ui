import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


import { FuseSharedModule } from '@fuse/shared.module';

import { BookComponent } from './book.component';


@NgModule({
    declarations: [
        BookComponent
    ],
    imports: [

        TranslateModule,
        // MaterialModule,
        FuseSharedModule
    ],
    exports: [
        BookComponent
    ]
})

export class BookModule
{
}
