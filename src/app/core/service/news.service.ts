import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { newsListApi, newsByUuidApi, newsNotification } from './backend-api';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { environment } from 'environments/environment';
import { formatDate } from '@angular/common';
import { element } from 'protractor';

@Injectable({
    providedIn: "root",
})
export class NewsService {

    constructor(
        private api: ApiService,
        private http: HttpClient,
    ) { }

    storageUrl = environment.storageUrl;

    /**
    * get All News
    */
    getNewsList(page, limit): Observable<any> { 
        let param = new HttpParams();
        if (!isNullOrUndefined(page)) {
            param = param.append('page', page);
            param = param.append('limit', limit);
            if (this.api.isEnable()) {
                return this.http.get<any>(newsListApi, { headers: this.api.headers, params: param }).pipe(
                    map((value) => {
                        if (value.code == 200) {
                            var result = [];
                            result = this.renderListNews(value.data)
                            return result;
                        }
                    }), catchError(value => throwError(value))
                );
            }
        }
        
    }

    /**
     * get News By UuId
     * @param uuid 
     */
    getNewsByUuId(uuid): Observable<any> {
        let param = new HttpParams();
        if (!isNullOrUndefined(uuid)) {
            param = param.append('uuid', uuid);
        }
        if (this.api.isEnable()) {
            return this.http.get<any>(newsByUuidApi, { headers: this.api.headers, params: param }).pipe(
                map((value) => {
                    if (value.code === 200) {
                        var result = this.renderNews(value.data)
                        return result;
                    }
                }), catchError(value => throwError(value))
            );
        }
    }

    getNewsNotification(): Observable<any> {
        var token = "Bearer " + localStorage.getItem('token');
        if (!isNullOrUndefined(token) && token !== "Bearer null"){
            return this.http.get<any>(newsNotification, { headers: this.api.headers}).pipe(
                map((value) => {
                    if (value.code === 200) {
                        var checkNotification = value.check_notification
                        return checkNotification;
                    }
                }), catchError(value => throwError(value))
            )
        }
    }
    
    /**
     * render List News
     */
    renderListNews(data) {
        var arrNew = []
        if (!isNullOrUndefined(data) && data.length > 0) {
            data.forEach(element => {
                var news = new News()
                // news.id = element.id;
                // news.entityId = element.entity_id;
                // news.uuid = element.uuid;
                // news.title = element.title;
                // news.description = element.description;
                // news.createdById = element.created_by_id;
                // news.createdAt = formatDate(element.created_at, "dd/MM/yyyy HH:mm", "en-US");
                // news.updatedAt = element.updated_at
                // news.totalNewReached = element.total_news_reached;
                // news.totalNewsViewed = element.total_news_viewed;
                // news.newsAttachment = this.renderNewsAttachment(element.news_attachment)
                // news.storageKeyIsCover = this.getIsCoverImage(element.news_attachment)
                news = this.renderNews(element)
                arrNew.push(news)
            });
        }
        return arrNew
    }

    /**
     * render News
     * @param element 
     */
    renderNews(element) {
        var news = new News()
        if (!isNullOrUndefined(element)) {
            news.id = element.id;
            news.entityId = element.entity_id;
            news.uuid = element.uuid;
            news.title = element.title;
            news.description = element.description;
            news.createdById = element.created_by_id;
            news.createdAt = formatDate(element.created_at, "dd/MM/yyyy", "en-US");
            if (!isNullOrUndefined(element.updated_at)){
                news.updatedAt = formatDate(element.updated_at, "dd/MM/yyyy", "en-US");
            }
            news.totalNewReached = element.total_news_reached;
            news.totalNewsViewed = element.total_news_viewed;
            news.newsAttachment = this.renderNewsAttachment(element.news_attachment)
            news.storageKeyIsCover = this.getIsCoverImage(element.news_attachment)
            // news.images = this.renderNewsImageName(element.news_attachment)
            // news.history = this.renderNewsHistory(element.news_history)
            if (!isNullOrUndefined(element.customer_news_notification)) {
                news.statusCustomerNewsNotification = element.customer_news_notification[0].status
            }
        }
        return news
    }

    /**
     * render News Attachment
     * @param data 
     */
    renderNewsAttachment(data) {
        var arrNewAttach = []
        if (!isNullOrUndefined(data) && data.length > 0) {
            data.forEach(element => {
                var newsAttachment = new NewsAttachment()
                newsAttachment.id = element.id
                newsAttachment.newsId = element.news_id
                newsAttachment.uploadedById = element.uploaded_by_id
                newsAttachment.isCoverPhoto = element.is_cover_photo
                newsAttachment.createdAt = formatDate(element.created_at, "dd/MM/yyyy HH:mm", "en-US");
                newsAttachment.storageKey = element.storage_key
                newsAttachment.isDeleted = element.is_deleted
                arrNewAttach.push(newsAttachment)
            })
        }
        return arrNewAttach
    }

    /**
     * render News Image name
     * @param data 
     */
    renderNewsImageName(data) {
        var arrNewAttach = []
        if (!isNullOrUndefined(data) && data.length > 0) {
            data.forEach(element => {
                arrNewAttach.push(this.storageUrl + element.storage_key)
            })
        }
        return arrNewAttach
    }

    /**
     * render News History
     * @param data 
     */
    renderNewsHistory(data) {
        var arrNewsHistory = []
        if (!isNullOrUndefined(data) && data.length > 0) {
            var newsHistory = new NewsHistory()
            data.forEach(element => {
                newsHistory.id = element.id
                newsHistory.newsId = element.news_id
                newsHistory.createdAt = element.updated_at
                newsHistory.action = "Updated by " + element.app_user.first_name + " " + element.app_user.last_name
                arrNewsHistory.push(newsHistory)
            });
        }
        return arrNewsHistory
    }

    /**
     * get Is CoverImage
     * @param data 
     */
    getIsCoverImage(data: Array<any>) {
        var newsImageCoverFile = environment.storageUrl
        if (!isNullOrUndefined(data) && data.length > 0) {
            data.forEach(element => {
                if (element.is_cover_photo) {
                    newsImageCoverFile = newsImageCoverFile + element.storage_key
                }
            });
        }
        return newsImageCoverFile
    }

    private errorHandler(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occured:', error.error.message);
        }
        else {
            console.error(
                `Back-end return code: ${error.status}\n` +
                `Body content: ${error.status}`
            );
        }

        return throwError(error.message || 'Server Error');
    }
}

export class News {
    id: number;
    entityId: number;
    uuid: string;
    title: string;
    description: string;
    createdById: number;
    createdAt: string;
    updatedAt: string
    totalNewReached: number;
    totalNewsViewed: number;
    storageKeyIsCover: string;
    images: string[];
    history: Array<NewsHistory>;
    newsAttachment: Array<NewsAttachment>
    statusCustomerNewsNotification: string;
}

export class NewsAttachment {
    id: number
    newsId: number;
    uploadedById: number
    isCoverPhoto: boolean
    createdAt: string
    storageKey: string
    isDeleted: boolean
}

export class NewsHistory {
    id: number
    newsId: number
    action: string
    createdAt: string

}