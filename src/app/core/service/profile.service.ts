// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { throwError } from 'rxjs';
// import { retry, catchError } from 'rxjs/operators';

// import { profileGetPreSignedUrl } from './backend-api';
// // import { uploadImageApi } from './backend-api';

// @Injectable({
//     providedIn: 'root'
// })
// export class ProfileService {
//     data = {
//         alex_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZXhiZWFuQGdldG5hZGEuY29tIiwiaWF0IjoxNTg1NjIyNDQ1LCJleHAiOjE5MDA5ODI0NDV9.V1foQnGV0AFYAjh-a0Cj8vyGbYWBVbJ-84eemgeocNI",
//         dany_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhbnllYXJsQGdldG5hZGEuY29tIiwiaWF0IjoxNTg1NjIyNzIzLCJleHAiOjE5MDA5ODI3MjN9.1_Zpn8eI0Lqme-kx0ZNVrW5HJlvIlS1lh-2vJvGw6sM"
//     };

//     constructor(private http: HttpClient) { }

//     getPreSignedUrl(fileName: string, fileType: string) {
//         const reqHeaders = new HttpHeaders({ Authorization: `Bearer ${this.data.alex_token}` });
//         const bodyObj = { action: 'putObject', name: fileName, type: fileType };
//         return this.http.post<any>(`${profileGetPreSignedUrl}`, bodyObj, {
//             headers: reqHeaders
//         }).pipe(retry(3), catchError(this.handleError));
//     }

//     uploadProfileImage(url: string, contentType: string, file) {
//         const headers = new HttpHeaders({ 'Content-Type': contentType });
//         return this.http.put<any>(url, file, { headers: headers, reportProgress: true });
//     }

//     // uploadProfileImage2(file) {
//     //     const reqHeaders = new HttpHeaders({ Authorization: `Bearer ${this.data.alex_token}` });
//     //     const formData = new FormData();
//     //     formData.append('profile-image', file);
//     //     return this.http.post<any>(`${uploadImageApi}`, formData, {
//     //         headers: reqHeaders
//     //     }).pipe(retry(3), catchError(this.handleError));
//     // }

//     private handleError(error: HttpErrorResponse) {
//         if (error.error instanceof ErrorEvent) {
//             // A client-side or network error occurred. Handle it accordingly.
//             console.error('An error occurred:', error.error.message);
//         } else {
//             // The back-end returned an unsuccessful response code.
//             // The response body may contain clues as to what went wrong.
//             console.error(
//                 `Back-end return code: ${error.status}\n` +
//                 `Body content: ${error.error}`);
//         }
//         // Return an observable with a user-facing error message.
//         return throwError(
//             'Something bad happened. Please try again later.');
//     };
// }
