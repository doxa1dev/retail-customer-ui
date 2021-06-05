import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { PlaceholderLoadingComponent} from './placeholder-loading.component';
import { MatProgressButtonsModule } from 'mat-progress-buttons';

@NgModule({
    declarations: [
        PlaceholderLoadingComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        MatProgressButtonsModule
    ],
    entryComponents: [
        PlaceholderLoadingComponent
    ],
    exports: [
        PlaceholderLoadingComponent
    ]
})
export class  PlaceholderLoadingModule
{
}
