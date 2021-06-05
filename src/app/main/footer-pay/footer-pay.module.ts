import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../angular-material/material.module';

import { FooterPayComponent } from './footer-pay.component';


@NgModule({
    declarations: [
        FooterPayComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [ 
        CommonModule,
        FooterPayComponent
    ]
})

export class FooterPayModule
{
}
