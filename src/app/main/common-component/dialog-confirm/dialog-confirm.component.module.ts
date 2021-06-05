import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import {  DialogConfirmComponent} from './dialog-confirm.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        DialogConfirmComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        TranslateModule
    ],
    entryComponents: [
        DialogConfirmComponent
    ]
})
export class DialogConfirmModule
{
}
