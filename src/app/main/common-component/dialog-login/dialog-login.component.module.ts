import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogLoginComponent } from './dialog-login.component';

@NgModule({
    declarations: [
        DialogLoginComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        TranslateModule
    ],
    entryComponents: [
        DialogLoginComponent
    ]
})
export class DialogLoginModule
{
}
