import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { DialogConfirmComponent } from '../common-component/dialog-confirm/dialog-confirm.component';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class PaymentCommon {

    token: string;
    constructor(
        public dialog: MatDialog,
        private router: Router
    ) {}

    checkLinkShare(session){
        return !CheckNullOrUndefinedOrEmpty(session) ? true : false;
    }

    isApiShare(session){
        this.token = localStorage.getItem('token');
        return (!CheckNullOrUndefinedOrEmpty(session) && CheckNullOrUndefinedOrEmpty(this.token)) ? true : false; 
    }

    shareForNotCustomer(session){
        this.token = localStorage.getItem('token');
        return (!CheckNullOrUndefinedOrEmpty(session) && CheckNullOrUndefinedOrEmpty(this.token)) ? true : false; 
    }

    shareForCustomer(session){
        this.token = localStorage.getItem('token');
        return (!CheckNullOrUndefinedOrEmpty(session) && !CheckNullOrUndefinedOrEmpty(this.token)) ? true : false; 
    }

    dialogExpired(){
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message:
              "Session has been expired.",
              title:
              "NOTIFICATION",
              colorButton: false
            },
        });
        dialogNotifi.afterClosed().subscribe(()=>{
                this.router.navigate(["/store"])
        })
    }

    dialogPaymentHasBeenPaid(){
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message:
              "Order has been paid.",
              title:
              "NOTIFICATION",
              colorButton: false
            },
          });
          dialogNotifi.afterClosed().subscribe(data=>{
            this.router.navigate(["/store"])
          })
    }

    
    

}
