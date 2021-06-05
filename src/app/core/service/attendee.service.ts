import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import
{
    addAttendeeApi,
    addAttendeeContactApi,
    removeAttendeeApi,
    updateAttendeeApi, updateIsAttended
} from './backend-api';
import { ApiService } from './api.service'
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Activity, Attendee } from 'app/core/models/activity.model'



@Injectable({
    providedIn: 'root'
})

export class AttendeeService
{
    constructor(
        private api: ApiService,
        private http: HttpClient
    ) { }

    
    addAttendee(formAddAttendee)
    {
        return this.api.post(addAttendeeApi, formAddAttendee);
    }
    removeAttendee(email : string, activity_id : string)
    {
        let url = removeAttendeeApi.replace(":email", email).replace(":id", activity_id)
        return this.api.delete(url);
    }
    updateAttendee(updateAttendeeForm)
    {
        return this.api.put(updateAttendeeApi, updateAttendeeForm)
    }

    updateIsAttended(activity_id, customer_id){
        let url = updateIsAttended.replace(":activity_id", activity_id).replace(":customer_id", customer_id)
        return this.api.put(url,"");
    }  

    addAttendeeFromContact(activity_id : string, email : string,)
    {
        let url;
        url = addAttendeeContactApi.replace(':activity_id', activity_id).replace(':email', email);
        if(this.api.isEnable()){
            return this.http.post<any>(url,'', {headers: this.api.headers, params: url}).pipe(
                map( data => {
                    return data;
                })
            )
        }
    }

}
