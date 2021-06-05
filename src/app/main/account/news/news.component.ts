import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NewsService, News } from "app/core/service/news.service";
import { Router } from "@angular/router";
import { isNullOrUndefined } from 'util';
import { SharedService } from 'app/core/service/commom/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from 'app/core/enum/title';

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
})
export class NewsComponent implements OnInit {
  newsList = new Array();
  isShowColorNotifi: boolean;
  isShowNotifi: boolean;
  quantityNotifi: number;
  page: number = 1;
  title = Title.DOT;

  constructor(private newsService: NewsService, 
    private router: Router,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.getNewsList()
  }

  getNewsList(): Promise<any> {
    return new Promise((resolve) => {
      this.newsService.getNewsList(this.page, 10).subscribe((data) => {
        this.setDataNews(data)
        this.getNewsNotification()
    });
    })
  }

  getNewsNotification(): Promise<any> {
    return new Promise((resolve) => {
      this.newsService.getNewsNotification().subscribe( data =>{
        this.quantityNotifi = data

        // this.sharedService.sharedNews.subscribe(
        //   (news) => (this.quantityNotifi = news)
        // )
        this.sharedService.nextNewsNotification(this.quantityNotifi)
      })
    })
  }

  onScroll() {
    this.spinner.show();
    if ( this.page > 0){
      this.page = this.page + 1
      this.newsService.getNewsList(this.page, 10).subscribe((data) => {
        this.setDataNews(data)

        this.getNewsNotification()

        this.spinner.hide();
      })
    }
    
  }

  getUuidNews(uuid) {
    this.router.navigate(["/news-detail"], {
      queryParams: { uuid: uuid },
    })
  }

  setDataNews(data){
    data.forEach((e) => {
      var news = new News()
      news.id = e.id
      news.title = e.title
      news.description = e.description
      news.createdAt = e.createdAt
      news.storageKeyIsCover = e.storageKeyIsCover
      news.uuid = e.uuid
  
      news.statusCustomerNewsNotification = e.statusCustomerNewsNotification
  
      this.newsList.push(news)
    })
  }
}
