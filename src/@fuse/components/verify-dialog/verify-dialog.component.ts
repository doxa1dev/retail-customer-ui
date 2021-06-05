import { Component, Inject , ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector   : 'app-verify-dialog',
    templateUrl: './verify-dialog.component.html',
    styleUrls  : ['./verify-dialog.component.scss'],
})
export class VerifyDialogComponent
{
    public confirmMessage: string;
    public isPhonenumber: boolean;
    public isEmail: boolean;
    /**
     * Constructor
     *
     * @param {MatDialogRef<VerifyDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<VerifyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            if(data){
                this.confirmMessage = data.message || this.confirmMessage;
                this.isPhonenumber = data.isPhonenumber
                this.isEmail = data.isEmail
            }
        }

}
