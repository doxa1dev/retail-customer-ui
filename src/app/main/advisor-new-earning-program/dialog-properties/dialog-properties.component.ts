import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dialog-properties',
  templateUrl: './dialog-properties.component.html',
  styleUrls: ['./dialog-properties.component.scss']
})
export class DialogPropertiesComponent implements OnInit {

  public properties: [];
  public image: string;
  public name: string;
  public price: number;
  public currency: string;
  storeUrl = environment.storageUrl;
  modelGroups = [];
  propertiesOfProduct  = {} as any;
  isCheck: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data)
      {
        this.properties = data.properties || this.properties;
        this.image = data.image || this.image;
        this.name = data.name || this.name;
        this.price = data.price;
        this.currency = data.currency || this.currency;
      }
    }

  ngOnInit(): void {
  }

  changeProperties() {
    for(let i = 0; i < this.properties.length ; i++)
    {
      this.propertiesOfProduct[this.properties[i]['name']] = this.modelGroups[i];
    }

    this.isCheck = true;
  }

  confirm() {
    if (!this.isCheck) {
      return;
    }

    this.dialogRef.close({ data: this.propertiesOfProduct });
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

}
