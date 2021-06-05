import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';
import { Order,OrderService } from 'app/core/service/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonDialogComponent } from 'app/main/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import jsQR from 'jsqr';
import { isNullOrUndefined } from 'util';
import { Title } from 'app/core/enum/title';
import QrScanner from "assets/js/qr-scanner.min.js";
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
QrScanner.WORKER_PATH = 'assets/js/qr-scanner-worker.min.js';
@Component({
  selector: 'app-advisor-host',
  templateUrl: './advisor-host.component.html',
  styleUrls: ['./advisor-host.component.scss']
})
export class AdvisorHostComponent implements OnInit {
  title = Title.LEFT;

  order: Order;
  qrValue: string;
  isScan: boolean = true;
  url: string | ArrayBuffer;
  img;
  disabledqrcode = false;
  qrcode_image_string: string;
  isShowImage: boolean = false;
  showDecodedButton: boolean = false;
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  buttonName = 'Upload Image';
  active = false;
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
  order_id : number;
  @ViewChild('fileDropRef') InputFrameVariable: ElementRef;

  constructor(
    private location: Location,
    private orderService: OrderService,
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) { 
    this.activatedRoute.queryParams.subscribe((params) => {
      this.order_id = params.id;
    });
  }
  ngOnInit(): void
  {
    if(!isNullOrUndefined(this.order_id))
    {
      this.orderService.getOrderByOrderIdCustomer(this.order_id).subscribe(data=>{
        this.order = data;
        this.qrValue = JSON.stringify({
          "order_id": this.order.id,
          "customer_id": this.order.customerId, "advisor_customer_id": this.order.advisorCustomer.id
        });
      })
    }
  }

  onSelectFileUploadImage(event){
    const file = event.target.files[0]
    if( !CheckNullOrUndefinedOrEmpty(file)){
      QrScanner.scanImage(file)
      .then(result =>{
        if (result == this.qrValue)
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                  message:
                    "Hosted successfully.",
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
            });
            dialogNotifi.afterClosed().subscribe(response =>
            {
              this.orderService.updateStatusNew(this.order.uuid, 'COMPLETED').subscribe(
                data => this.router.navigate(['/advisor/customerorders'], { state: { selectTab: 6 } })
              )
            })
          }
          else
          {
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

  qrCodeUploadedHandler(files: FileList): void
  {

    this.active = true;
    this.buttonName = "Scanning..."
    var reader = new FileReader();

    reader.readAsDataURL(files[0]); // read file as data url

    reader.onload = (event) =>
    {
      this.url = event.target.result;
    }
    const file: File = files[0];
    createImageBitmap(files[0])
      .then(bmp =>
      {
        const canvas = document.createElement('canvas');

        const width: number = bmp.width;
        const height: number = bmp.height;
        canvas.width = bmp.width;
        canvas.height = bmp.height;

        const ctx = canvas.getContext('2d');

        ctx.drawImage(bmp, 0, 0);
        const qrCodeImageFormat = ctx.getImageData(0, 0, bmp.width, bmp.height);
        this.InputFrameVariable.nativeElement.value = '';

        let qrDecoded = jsQR(qrCodeImageFormat.data, qrCodeImageFormat.width, qrCodeImageFormat.height);

        if (isNullOrUndefined(qrDecoded))
        {
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
          this.active = false;
          this.buttonName = "Upload Image"
        }
        else
        {
          if (qrDecoded.data == this.qrValue)
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  "Hosted successfully.",
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(response =>
            {
              this.orderService.updateStatusNew(this.order.uuid, 'COMPLETED').subscribe(
                
                data => {
         
                  this.router.navigate(['/advisor/customerorders'], { state: { selectTab: 6 } })
                }
              )
            })
          }
          else
          {
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
          }
          this.active = false;
          this.buttonName = "Upload Image"
        }
      });
  }


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
      if (resultString == this.qrValue)
      {
        this.isScan = false;
        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
          width: "500px",
          data: {
            message:
              "Hosted successfully.",
            title:
              "NOTIFICATION",
            colorButton: false
          },
        });
        dialogNotifi.afterClosed().subscribe(response =>
        {
          this.orderService.updateStatusNew(this.order.uuid, 'COMPLETED').subscribe(
            data => this.router.navigate(['/advisor/customerorders'], { state: { selectTab: 6 } })
          )
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

  // image
  onSelectFile(event)
  {
    if (event.target.files && event.target.files[0])
    {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) =>
      { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }
  }

}
