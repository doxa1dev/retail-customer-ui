import { Component, OnInit } from '@angular/core';
// import { GridApi } from 'ag-grid-community';
import { Location } from '@angular/common';
import { WarrantiedService, WarrantyHistory } from 'app/core/service/warrantied.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from 'app/core/enum/title';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-warrantied-products-detail',
  templateUrl: './warrantied-products-detail.component.html',
  styleUrls: ['./warrantied-products-detail.component.scss']
})

export class WarrantiedProductsDetailComponent implements OnInit {
  title = Title.LEFT;
  warrantyHistoryArray : WarrantyHistory;
  displayedColumns = ['createdAt', 'comment'];
  warrantiedUuid: string;
  warrantied: [];
  noComment: any;

  // translation
  lstEnTranslation: any[] = [];
  lstZhTranslation: any[] = [];
  lstMyTranslation: any[] = [];

  constructor(private location: Location,
    private warrantiedService: WarrantiedService,
    private router : ActivatedRoute,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params=>{
      this.warrantiedUuid = params.uuid
    })

    this.warrantiedService.getWarrantiedProductById(this.warrantiedUuid).subscribe( data => {
      this.warrantied = data;
      this.warrantyHistoryArray = data.warrantyHistory;
      this.noComment = data.warrantyHistory.length === 0;
      
      // get list translation
      data.translations.forEach(translate => {
        if (translate.language.language_code === 'en') {
          let obj = {};
          obj["SerialNumber"] = data.serialNumber;
          obj["Title"] = translate.translated_title;
          this.lstEnTranslation.push(obj);
        } else if (translate.language.language_code === 'en') {
          let obj = {};
          obj["SerialNumber"] = data.serialNumber;
          obj["Title"] = translate.translated_title;
          this.lstZhTranslation.push(obj);
        } else if (translate.language.language_code === 'my') {
          let obj = {};
          obj["SerialNumber"] = data.serialNumber;
          obj["Title"] = translate.translated_title;
          this.lstZhTranslation.push(obj);
        }
      });

      // object translation
      /**
        "WARRANTIED_PRODUCT": {
          "SERIAL_NUMBER": {
            "TITLE": "Warrantied product title"
          }
        }
       */

      // set translation language
      this.translateService.getTranslation('en').subscribe(() => {
        let objEnTranslation = {
          "WARRANTIED_PRODUCT": {}
        }
        this.lstEnTranslation.forEach(translate => {
          objEnTranslation["WARRANTIED_PRODUCT"][translate["SerialNumber"]] = {};
          objEnTranslation["WARRANTIED_PRODUCT"][translate["SerialNumber"]]["TITLE"] = translate["Title"];
        });
        // set english langugae
        this.translateService.setTranslation('en', objEnTranslation, true);

        /** --------------- */
        this.translateService.getTranslation('en').subscribe(() => {
          let objZhTranslation = {
            "WARRANTIED_PRODUCT": {}
          }
          this.lstZhTranslation.forEach(translate => {
            objZhTranslation["WARRANTIED_PRODUCT"][translate["SerialNumber"]] = {};
            objZhTranslation["WARRANTIED_PRODUCT"][translate["SerialNumber"]]["TITLE"] = translate["Title"];
          });
          // set chinese langugae
          this.translateService.setTranslation('en', objZhTranslation, true);

          /** --------------- */
          this.translateService.getTranslation('my').subscribe(() => {
            let objMyTranslation = {
              "WARRANTIED_PRODUCT": {}
            }
            this.lstMyTranslation.forEach(translate => {
              objMyTranslation["WARRANTIED_PRODUCT"][translate["SerialNumber"]] = {};
              objMyTranslation["WARRANTIED_PRODUCT"][translate["SerialNumber"]]["TITLE"] = translate["Title"];
            });
            // set malay langugae
            this.translateService.setTranslation('my', objMyTranslation, true);
          })
        })
      })
    })
  }

  // get translation
  getTranslation(serialNumber: string) {
    let key = 'WARRANTIED_PRODUCT.' + serialNumber + '.TITLE';
    return this.translateService.getStreamOnTranslationChange(key);
  }

  back(){
    this.location.back();
  }

}
