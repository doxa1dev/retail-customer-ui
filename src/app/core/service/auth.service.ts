import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import {
  checkExistApi, otpApi, verifyOtpApi, loginApi, registerApi, cartApi,resentEmailApi,
  verifyEmailApi, activateEmailApi, getAdvisorApi, updateAdvisorApi,
  forgotPasswordApi, verifyForgotPasswordTokenApi, resetPasswordApi, checkEmailEdit,
  changeLanguages, getAdvisorByCustomerApi, decryptToken, getCustomerByUuid, searchCustomerByUuid, 
  getAdvisorReferenceApi, changeEditEmailApi, activePhoneApi, buyAsGuestApi, checkAnomynousApi, 
  getInformationAnomynousApi, updateInforForAnomynousCustomerApi, checkNaepCustomerApi
} from './backend-api';
import { ResetPassword } from '../../core/models/reset-password.model';
import { isNullOrUndefined } from 'util';
import { Observable, throwError } from 'rxjs';
import { Advisor } from 'app/core/models/user.model'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private api: ApiService
  ) { }

  register(registerForm) {
    return this.http.post<any>(registerApi, registerForm);
  }

  verify(verifyEmailData) {
    return this.http.post<any>(verifyEmailApi, verifyEmailData);
  }
  login(loginForm) {
    return this.http.put<any>(loginApi, loginForm);
  }

  logout() {
    localStorage.removeItem('token');
  }

  GetOtp(phoneNumber: string) {
    let url = otpApi.replace(':phoneNumber', phoneNumber);
    return this.http.post<any>(url, '');
  }

  VerifyOTP(uuid: string, otp: string) {
    let url = verifyOtpApi.replace(':UUID', uuid).replace(':OTP', otp);
    return this.http.post<any>(url, '');
  }

  activePhone(token: string, email: string, uuid:string) : Observable<any>{
    // let param = new HttpParams();
    // param = param.append('token',token);
    // param = param.append('email',email);
    // param = param.append('uuid',uuid);
    return this.http.post(activePhoneApi,{token, email, uuid}).pipe(
      map(data=>{
     
        return data;
      })
    )
    // var url = activateEmailApi.replace(':id', token);
    // return this.http.get<any>(url);
  }

  // verifyUserEmail(token: string) {
  //   var url = activateEmailApi.replace(':id', token);
  //   return this.http.get<any>(url);
  // }

  verifyUserEmail(token: string) : Observable<any>{
    let param = new HttpParams();
    param = param.append('token',token);
    return this.http.get(activateEmailApi,{params : param}).pipe(
      map(data=>{
     
        return data;
      })
    )
    // var url = activateEmailApi.replace(':id', token);
    // return this.http.get<any>(url);
  }


  loggedIn() {
    return !!localStorage.getItem('token');
  }

  checkExist(checkExistForm) {
    return this.http.post<any>(checkExistApi, checkExistForm)
  }
  //Get Advisor
  getAdvisor(advisorId: string) {
    return this.http.get<any>(`${getAdvisorApi}/${advisorId}`);
  }

  /**
   * Update advisor
   */
  updateAdvisor(advisorId: string) {
    var url = updateAdvisorApi.replace(':id', advisorId);
    return this.api.post(url, '');
  }

  forgotPassword(email: string) {
    return this.http.post<any>(forgotPasswordApi, { email });
  }

  verifyForgotPasswordToken(token: string) {
    return this.http.post<any>(verifyForgotPasswordTokenApi, { token });
  }

  resetPassword(resetPassword: ResetPassword) {
    return this.http.post<any>(resetPasswordApi, resetPassword);
  }

  changeLanguage(language): Observable<any> {
    let param = new HttpParams();
    if (!isNullOrUndefined(language)) {
      param = param.append('language', language);

      if (this.api.isEnable()) {
        return this.http.post<any>(changeLanguages, '', { headers: this.api.headers, params: param }).pipe(
          map((value) => { }), catchError(value => throwError(value))
        );
      }
    }
  }


  getAdvisorByCustomer() {
    return this.api.get(getAdvisorByCustomerApi).pipe(map((data) => {
      if (data.code === 200) {
        let advisor = new Advisor();
        advisor.id = data.data.advisor_id_number;
        advisor.name = (isNullOrUndefined(data.data.preferred_name) ||  data.data.preferred_name == '') ? data.data.firt_name : data.data.preferred_name;
        advisor.avatar = data.data.profile_photo_key;
        advisor.uuid = data.data.public_id;
        return advisor;
      }else if(data.code === 202)
      {
        return null;
      }
    }))
  }


  getReferenceAdvisor(advisor_uuid : string) {
    let param = new HttpParams()
    param = param.append('advisor_uuid',advisor_uuid);
    return this.http.get<any>(getAdvisorReferenceApi,{params : param}).pipe(
      map(data=>{
        if (data.code === 200) {
          let advisor = new Advisor();
          advisor.id = data.data.advisor_id;
          advisor.name = (CheckNullOrUndefinedOrEmpty(data.data.preferred_name)) ? data.data.firt_name : data.data.preferred_name;
          advisor.avatar = data.data.profile_photo_key;
          advisor.uuid = data.data.uuid;
          return advisor;
        }else
        {
          return null;
        }
      })
    )
  }
  

  decryptTokenData(token: string) {
    let param = new HttpParams();
    if (!isNullOrUndefined(token)) {
      param = param.append('token', token);
      return this.http.get<any>(decryptToken, { headers: this.api.headers, params: param }).pipe(
        map((data) => {
          if (data.code === 200) {
            let decrypt = {
              public_id: data.decrypt.public_id,
              expired: data.decrypt.expired
            }
            return decrypt;
          }
        }), catchError(value => throwError(value))
      );
    }
  }

  getCustomerByUuid(uuid): Observable<any> {
    let param = new HttpParams();
    param = param.append('uuid', uuid);
    if(this.api.isEnable()) { 
      return this.http.get<any>(searchCustomerByUuid, { headers: this.api.headers, params: param }).pipe(
        map(data => {
          console.log(data)
          if (data.code === 200 && !isNullOrUndefined(data.data)) {
            return data.data.is_registered;
          }
          else if(data.code === 403) {
            this.router.navigate(["/login"]);
          }
        }),catchError(value => throwError(value))
      );
    }
  }

  resentEmail(email : string) :Observable<any>{
    let param = new HttpParams();
    param = param.append('email',email);
    return this.http.post(resentEmailApi,'',{params : param}).pipe(
      map(data=>{
        return data;
      })
    )
  }

  checkEditEmail(id): Observable<any>{
    let param = new HttpParams();
    param = param.append('customer_id',id);
    if(this.api.isEnable()){
      return this.http.get<any>(checkEmailEdit,{ headers: this.api.headers, params: param }).pipe(
        map(data=>{
          if(data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data) && data.data.is_edit_email){
            return true;
          }else{
            return false;
          }
        }),  catchError(data => throwError(data))
      )
    }
  }

  changeEditEmail(phoneNumber, phoneDialCode):Observable<any> {
    let param = new HttpParams();
    param = param.append('phone_number', phoneNumber);
    param = param.append('phone_dial_code', phoneDialCode);

    return this.http.put(changeEditEmailApi, '', {params : param}).pipe(
      map(data =>{
        return data;
      })
    )
  }


  buyAsGuest():Observable<any> {
    return this.http.post<any>(buyAsGuestApi, '').pipe(
      map(response =>{
        if(response.code === 200)
        {
          localStorage.setItem('token',response.data)
          return true;
        }else
        { 
          return false;
        }

      })
    )
  }


  checkIsAnomynousAccount():Observable<any> {
    if(this.api.isEnable())
    {
      return this.http.get<any>(checkAnomynousApi, {headers : this.api.headers}).pipe(
        map(response =>{
          return response;
        })
      )
    }
    
  }

  getdataAnomynousSignUp(uuid : string):Observable<any> {
    let param = new HttpParams();
    param = param.append('uuid', uuid);
    return this.http.get<any>(getInformationAnomynousApi,{params : param}).pipe(map(data=>{
      return data
    }))
  
  }


  updateAnomynousInfor(customerInfomation):Observable<any> {
    if(this.api.isEnable())
    {
      return this.http.put<any>(updateInforForAnomynousCustomerApi,customerInfomation, {headers : this.api.headers}).pipe(
        map(response =>{
          return response;
        })
      )
    }
    
  }

  checkNaepCustomer() {
    return this.api.get(checkNaepCustomerApi).pipe(map (
      data => {
        if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {
          return data.data;
        
        } else {
          return true;
        }
      }
    ))
  }
}
