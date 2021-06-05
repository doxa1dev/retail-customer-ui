import { myProfileApi, changePasswordApi, profileGetPreSignedUrl, questionnaireStatusApi } from './backend-api';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

import { ChangePassword } from '../models/change-password.model';
import { UpdateProfile } from '../models/update-profile.model';

import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Injectable({
    providedIn: 'root'
})
export class MyProfileService {
    constructor(
        private api: ApiService,
        private http: HttpClient,
        private router: Router) { }

    getProfile() {
        // const reqHeaders = new HttpHeaders({ Authorization: `Bearer ${this.accessToken.customer100}` });
        return this.api.get(myProfileApi).pipe(retry(3), catchError(this.errorHandler));
    }

    updateProfile(updateProfile: UpdateProfile) {
        // const reqHeaders = new HttpHeaders({ Authorization: `Bearer ${this.accessToken.customer100}` });
        // return this.http.post<UpdateProfile>(`${myProfileApi}`, updateProfile, { headers: reqHeaders }).pipe(retry(3), catchError(this.errorHandler));
        return this.api.post(myProfileApi, updateProfile).pipe(retry(3), catchError(this.errorHandler));
    }

    getQuestionnaireStatus() {
        // const reqHeaders = new HttpHeaders({ Authorization: `Bearer ${this.accessToken.customer100}` });
        // return this.http.get<any>(`${questionnaireStatusApi}/${environment.questionnaireOneVersion}/${environment.questionnaireTwoVersion}`, { headers: reqHeaders }).pipe(retry(3), catchError(this.errorHandler));
        return this.api.get(`${questionnaireStatusApi}/${environment.questionnaireOneVersion}/${environment.questionnaireTwoVersion}`).pipe(retry(3), catchError(this.errorHandler));
    }

    changePassword(changePassword: ChangePassword) {
        // const reqHeaders = new HttpHeaders({ Authorization: `Bearer ${this.accessToken.customer100}` });
        // return this.http.post<any>(`${changePasswordApi}`, changePassword, { headers: reqHeaders }).pipe(retry(3), catchError(this.errorHandler));
        return this.api.post(changePasswordApi, changePassword).pipe(retry(3), catchError(this.errorHandler));
    }

    getPreSignedUrl(fileName: string, fileType: string) {
        // const reqHeaders = new HttpHeaders({ Authorization: `Bearer ${this.accessToken.customer100}` });
        const bodyObj = { name: fileName, type: fileType };
        // return this.http.post<any>(`${profileGetPreSignedUrl}`, bodyObj, {
        //     headers: reqHeaders
        // }).pipe(retry(3), catchError(this.errorHandler));
        return this.api.post(profileGetPreSignedUrl, bodyObj).pipe(retry(3), catchError(this.errorHandler));

    }

    uploadProfileImage(url: string, contentType: string, file) {
        const headers = new HttpHeaders({ 'Content-Type': contentType });
        return this.http.put<any>(url, file, { headers: headers, reportProgress: true }).pipe(retry(3), catchError(this.errorHandler));
    }

    // uploadProfileImage2(file) {
    //     const reqHeaders = new HttpHeaders({ Authorization: `Bearer ${this.data.alex_token}` });
    //     const formData = new FormData();
    //     formData.append('profile-image', file);
    //     return this.http.post<any>(`${uploadImageApi}`, formData, {
    //         headers: reqHeaders
    //     }).pipe(retry(3), catchError(this.handleError));
    // }

    private errorHandler(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occured:', error.error.message);
        }
        else {
            console.error(
                `Back-end return code: ${error.status}\n` +
                `Body content: ${error.status}`
            );
            if ( error.status == 401 ) {
                return "0"
            }
        }

        return throwError(error.message || 'Server Error');
    }
}
