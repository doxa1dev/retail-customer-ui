import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService, News, NewsAttachment } from 'app/core/service/news.service';
import { environment } from "environments/environment";
import { NgImageSliderComponent } from 'ng-image-slider';
import { isNullOrUndefined } from 'util';
import { Title } from 'app/core/enum/title';

export class Galery {
  small: string;
  medium: string;
  big: string;
  constructor(small: string, medium: string, big: string) {
    this.small = small;
    this.medium = medium;
    this.big = big;
  }
}

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class NewsDetailComponent implements OnInit {

  uuid: string;
  newsDetail: News;
  storageUrl = environment.storageUrl;
  responsiveOptions;
  @ViewChild('nav') slider: NgImageSliderComponent;

  listImageDetail: any[] = [];
  title = Title.LEFT;

  constructor(private newsService: NewsService,
    private _location: Location, 
    private router: Router,
    private activedRoute: ActivatedRoute) {

      this.responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];
  }

  ngOnInit(): void {
    this.activedRoute.queryParams.subscribe( param =>{
      this.uuid = param.uuid;
    })
    
    this.getNewsDetail();
  }

  back() {
    this._location.back();
  }

  getNewsDetail() {
    this.newsService.getNewsByUuId(this.uuid).subscribe(data => {
      if(!isNullOrUndefined(data)){
        this.newsDetail = data
        this.newsDetail.newsAttachment.forEach( element => {
        let imageDetail = this.storageUrl + element.storageKey;
        this.listImageDetail.push( {"image" : imageDetail, "thumbImage" : imageDetail});
        });
      } else {
        this.router.navigate(["/news"])
      }


    });
  }

}
