import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import {VerifyDialogComponent } from './verify-dialog.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        VerifyDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        TranslateModule
    ],
    entryComponents: [
        VerifyDialogComponent
    ],
})
export class VerifyDialogModule
{
}
