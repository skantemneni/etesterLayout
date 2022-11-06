import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoggedinUser } from '@auth/model/etesteruser';
import { ILoginService } from '@auth/model/auth.interface';


// Core eTester URL (base path)
const etesterdbBaseUrl: string = 'http://localhost:8081/';

// Login & Register URL's (EtesterLoginController)
const etesterdbLoginControllerBaseUrl: string = etesterdbBaseUrl + 'logincontroller/';
const etesterdbLoginUrl: string = etesterdbLoginControllerBaseUrl + 'login';
const userDetailsUrl: string = etesterdbLoginControllerBaseUrl + 'currentuserdetails';


@Injectable({
  providedIn: 'root'
})
export class LoginService implements ILoginService {

  constructor(private httpClient: HttpClient) { }

  private getHttpOptionsForAuthCode(authCode: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
        'Authorization': authCode
      })
    };
  }

  loginSyncAndGetToken(username: string, password: string) {
    const completeLoginUrl: string = etesterdbLoginUrl + '?username=' + username.trim() + '&password=' + password.trim();
    let authCode: string | null = null;
    return this.httpClient.post<any>(completeLoginUrl, { username: username, password: password }, { observe: 'response' });
  }

  getUserDetails(username: string, authCode: string) {
    return this.httpClient.get<LoggedinUser>(userDetailsUrl, this.getHttpOptionsForAuthCode(authCode));
  }

}
