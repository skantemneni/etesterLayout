import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
//import { Response } from `@angular/http`;
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TestResponse, Testwithresponse } from '../models/etestermodel';
import { LoggedinUser } from '../auth/model/etesteruser';
import { Usertest } from '../models/etestermodel.usertest';
// import { DataSource } from '@angular/cdk/table';

// We have several eTester Controllers supporting this functionality. I am segmenting this URL paths by controller/function

// Core eTester URL (base path)
const etesterdbBaseUrl: string = 'http://localhost:8081/';

// Login & Register URL's (EtesterLoginController)
const etesterdbLoginControllerBaseUrl: string = etesterdbBaseUrl + 'logincontroller/';
const etesterdbLoginUrl: string = etesterdbLoginControllerBaseUrl + 'login';
const userDetailsUrl: string = etesterdbLoginControllerBaseUrl + 'currentuserdetails';

// Usertest (EtesterUsertestController)
const etesterdbUsertestControllerBaseUrl: string = etesterdbBaseUrl + 'data/usertest/';
const getAllUsertestsPath: string = etesterdbUsertestControllerBaseUrl + 'allforcurrentuser';
const usertestPathLoad: string = etesterdbUsertestControllerBaseUrl + 'usertestresponse/get/';
const usertestPathSave: string = etesterdbUsertestControllerBaseUrl + 'usertestresponse/save';



@Injectable({
  providedIn: 'root'
})
export class EtesterdbService {

/*  username: string = "sesi2";
  password: string = "test";
*/  default_authToken: string = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzZXNpMiIsImV4cCI6MTY2NzAzMzQ5NX0.lsYo9pYRaG1VyzcRVY5jtVmPZese7ugMIiXesQuzcPKns-jfW4C6mT9Zym0KSadhZmK8xv7amOofJ0GWmXxFvw';
  authToken: string = this.default_authToken;

  private HTTP_OPTIONS = {};

  constructor(private httpClient: HttpClient) {
    this.resetLogin();
  }

  public setAuthCode(authCode: string) {
    this.authToken = authCode;
    this.HTTP_OPTIONS = this.getHttpOptionsForAuthCode(this.authToken);
  }

  public resetLogin() {
    this.authToken = this.default_authToken;
    this.HTTP_OPTIONS = this.getHttpOptionsForAuthCode(this.authToken);
  }

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




  /**
   * Usertest Controller Stuff
   */
  getAllUserTestsforCurrentUser(): Observable<Usertest[]> {
    return this.httpClient.get<Usertest[]>(getAllUsertestsPath, this.HTTP_OPTIONS);
  }


  /**
   * Complete load of usertest (test with response) for Administering on the App
   * @param userTestId - usertestId is the id of the testinstance associated with the user
   */
  getUserTestData(userTestId: string): Observable<Testwithresponse> {
    return this.httpClient.get<Testwithresponse>(usertestPathLoad + userTestId, this.HTTP_OPTIONS);
  }

  /**
   * Save usertest response to the database
   * @param usertestId - usertestId is the id of the testinstance associated with the user 
   * @param testResponse - testResponse JSON serialized as a string
   * @param completed - flag to indicate if it should kickoff workflow to grade the test (grading happens in an async mode)
   */
  saveTestResponse(usertestId: number, testResponse: TestResponse, completed: boolean): void {
    this.httpClient.post<TestResponse>(usertestPathSave, { idUsertest: usertestId, response: JSON.stringify(testResponse), completed: completed }, this.HTTP_OPTIONS).subscribe((data) => {
      return
    });
  }


}

