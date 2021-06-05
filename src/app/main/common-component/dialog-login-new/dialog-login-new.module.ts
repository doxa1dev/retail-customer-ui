import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogLoginNewComponent } from './dialog-login-new.component';

@NgModule({
    declarations: [
      DialogLoginNewComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        TranslateModule
    ],
    entryComponents: [
      DialogLoginNewComponent
    ]
})
export class DialogLoginNewModule
{
}
