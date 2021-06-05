import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';
import { Order, OrderService } from 'app/core/service/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivitiesService } from 'app/core/service/activities.service';
import { AttendeeService } from 'app/core/service/attendee.service';
import { Activity, Attendee } from 'app/core/models/activity.model';
import { element } from 'protractor';
import jsQR from 'jsqr';
import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { Title } from 'app/core/enum/title'
import QrScanner from "assets/js/qr-scanner.min.js";
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
QrScanner.WORKER_PATH = 'assets/js/qr-scanner-worker.min.js';

@Component({
  selector: 'app-scan-attendee',
  templateUrl: './scan-attendee.component.html',
  styleUrls: ['./scan-attendee.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ScanAttendeeComponent implements OnInit {
  title = Title.LEFT;
  isScan: boolean = true;
  activity: Activity;
  order: Order;
  qrValue: string;
  id: number;
  attendees = [];
  attendee: Attendee;
  qrResultArray : String[] = [];
  isTrue: Boolean = false;
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  url: string | ArrayBuffer;
  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: string;
  resultCode: number;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;

  disabledqrcode = false;
  buttonName = 'Upload Image';
  active = false;
  @ViewChild('fileDropRef') InputFrameVariable: ElementRef;

  constructor(
    private location: Location,
    private orderService: OrderService,
    private router: Router,
    private _activitiesService: ActivitiesService,
    private _activatedRoute: ActivatedRoute,
    private _attendeeService: AttendeeService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void
  {
    this._activatedRoute.queryParams.subscribe(params =>
    {
      this.id = params.id;
    })
    this._activitiesService.getActivityByActivityId(this.id).subscribe(data =>
    {
      this.activity = new Activity();
      this.attendees = data;
      data.forEach(element =>
      {
        this.qrResultArray.push(JSON.stringify({
          "activity_id": this.id,
          "attendee_id": element.id
        }))
      })
    })
  }
  
  onSelectFileUploadImage(event){
    const file = event.target.files[0]
    if( !CheckNullOrUndefinedOrEmpty(file)){
      QrScanner.scanImage(file)
      .then(result =>{
        this.qrResultArray.forEach(element =>
          {
            if (element === result)
            {
              this.isScan = false;
              this.isTrue = true;
            }
          })
          if (this.isTrue === true)
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  "Scan attendee successfully.",
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(response =>
            {
              let customer_id = JSON.parse(result).attendee_id;
              this._attendeeService.updateIsAttended(this.id, customer_id).subscribe(
                data =>
                {
                  this.location.back();
                }
              );
            })
          }
          else
          {
            this.isScan = false;
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  "No valid QR Code detected.",
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(response =>
            {
              this.isScan = true;
            })
          }
        })
      .catch(e => {
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              "Image invalid or bad quality, please get a screenshot of the QR code.",
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
      });
    }
    event.srcElement.value = null;
   
  }

  // qrCodeUploadedHandler(files: FileList): void
  // {

  //   this.active = true;
  //   this.buttonName = "Scanning..."
  //   var reader = new FileReader();

  //   reader.readAsDataURL(files[0]); // read file as data url

  //   reader.onload = (event) =>
  //   {
  //     this.url = event.target.result;
  //   }
  //   const file: File = files[0];
  //   createImageBitmap(files[0])
  //     .then(bmp =>
  //     {
  //       const canvas = document.createElement('canvas');

  //       const width: number = bmp.width;
  //       const height: number = bmp.height;
  //       canvas.width = bmp.width;
  //       canvas.height = bmp.height;

  //       const ctx = canvas.getContext('2d');

  //       ctx.drawImage(bmp, 0, 0);
  //       const qrCodeImageFormat = ctx.getImageData(0, 0, bmp.width, bmp.height);
  //       this.InputFrameVariable.nativeElement.value = '';

  //       let qrDecoded = jsQR(qrCodeImageFormat.data, qrCodeImageFormat.width, qrCodeImageFormat.height);

  //       if (isNullOrUndefined(qrDecoded))
  //       {
  //         const dialogNotifi = this.dialog.open(CommonDialogComponent, { 
  //           width: "500px",
  //           data: {
  //             message:
  //               "Image invalid or bad quality, please get a screenshot of the QR code.",
  //             title:
  //               "NOTIFICATION",
  //             colorButton: false
  //           },
  //         });
  //         this.active = false;
  //         this.buttonName = "Upload Image"
  //       }
  //       else
  //       {
  //         this.qrResultArray.forEach(element =>
  //         {
  //           if (element === qrDecoded.data)
  //           {
  //             this.isScan = false;
  //             this.isTrue = true;
  //           }
  //         })
  //         if (this.isTrue === true)
  //         {
  //           const dialogNotifi = this.dialog.open(CommonDialogComponent, {
  //             width: "500px",
  //             data: {
  //               message:
  //                 "Scan attendee successfully.",
  //               title:
  //                 "NOTIFICATION",
  //               colorButton: false
  //             },
  //           });
  //           dialogNotifi.afterClosed().subscribe(response =>
  //           {
  //             let customer_id = JSON.parse(qrDecoded.data).attendee_id;
  //             this._attendeeService.updateIsAttended(this.id, customer_id).subscribe(
  //               data =>
  //               {
  //                 this.location.back();
  //               }
  //             );
  //           })
  //         }
  //         else
  //         {
  //           this.isScan = false;
  //           const dialogNotifi = this.dialog.open(CommonDialogComponent, {
  //             width: "500px",
  //             data: {
  //               message:
  //                 "No valid QR Code detected.",
  //               title:
  //                 "NOTIFICATION",
  //               colorButton: false
  //             },
  //           });
  //           dialogNotifi.afterClosed().subscribe(response =>
  //           {
  //             this.isScan = true;
  //           })
  //         }
  //         this.active = false;
  //         this.buttonName = "Upload Image"
  //       }
  //     });
  // }

  clearResult(): void
  {
    this.qrResultString = '';
    this.isScan = true;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void
  {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString)
  {
    if (this.isScan)
    {
      this.qrResultArray.forEach(element =>
      {
        if (element === resultString)
        {
          this.isScan = false;
          this.isTrue  = true;          
        }
      })
      if(this.isTrue === true)
      {
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              "Scan attendee successfully.",
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(response =>
        {
          let customer_id = JSON.parse(resultString).attendee_id;
          this._attendeeService.updateIsAttended(this.id, customer_id).subscribe(
            data=>{
              this.location.back();
            }
          );
        })
      }
      else
      {
        this.isScan = false;
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              "No valid QR Code detected.",
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(response =>
        {
          this.isScan = true;
        })
      }
    }
    
  }



  onDeviceSelectChange(selected: string)
  {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;
  }

  onHasPermission(has: boolean)
  {
    this.hasPermission = has;
  }

  onTorchCompatible(isCompatible: boolean): void
  {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void
  {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void
  {
    this.tryHarder = !this.tryHarder;
  }


  back()
  {
    this.location.back();
  }
}
