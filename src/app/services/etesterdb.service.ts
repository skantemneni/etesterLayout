import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
//import { Response } from `@angular/http`;
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TestResponse, Testwithresponse } from '@app/models/etestermodel';
import { Usertest } from '@app/models/etestermodel.usertest';
import { IAuthenticatable } from '@auth/model/auth.interface';
import { IDataServer } from './data.interface';

// We have several eTester Controllers supporting this functionality. I am segmenting this URL paths by controller/function

// Core eTester URL (base path)
const etesterdbBaseUrl: string = 'http://localhost:8081/';

// Usertest (EtesterUsertestController)
const etesterdbTestControllerBaseUrl: string = etesterdbBaseUrl + 'api/data/test/';
const getAllUsertestsPath: string = etesterdbTestControllerBaseUrl + 'get/alltestsforcurrentuser';
const usertestPathLoad: string = etesterdbTestControllerBaseUrl + 'get/testwithresponse/';
const usertestPathSave: string = etesterdbTestControllerBaseUrl + 'save/response';



@Injectable({
  providedIn: 'root'
})
export class EtesterdbService implements IAuthenticatable, IDataServer {

/*  username: string = "sesi2";
  password: string = "test";
*/  default_authToken: string = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYXJ5IiwiaWF0IjoxNjczMzQ3MTQ1LCJleHAiOjE2NzM0MzM1NDV9.Jebulhzsz9W65h8QKIQMY3w_7Vu5o3eO5f_WfYkH8hYkfZy8EdzkfOk3edkekMG9e9yp5SVEGLkVBIyXEPN7RQ';
  authToken: string = this.default_authToken;

  private HTTP_OPTIONS = {};

  constructor(private httpClient: HttpClient) {
    this.resetAuthCode();
  }

  public getAuthCode() {
    return this.authToken;
  }
  public setAuthCode(authCode: string): boolean {
    console.log(`EtesterdbService.setAuthCode called with: ${authCode}`);
    this.authToken = authCode;
    console.log(`EtesterdbService.setAuthCode this.authToken: ${this.authToken}`);
    this.HTTP_OPTIONS = this.getHttpOptionsForAuthCode(this.authToken);
    console.log(`EtesterdbService.setAuthCode this.getAuthCode: ${this.getAuthCode()}`);

    return true;
  }
  public resetAuthCode (): boolean {
    this.authToken = this.default_authToken;
    this.HTTP_OPTIONS = this.getHttpOptionsForAuthCode(this.authToken);
    return true;
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
    console.log(`EtesterdbService.getUserTestData this.getAuthCode: ${this.getAuthCode()}`);
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

