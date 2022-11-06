import { HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoggedinUser } from "./etesteruser";
import { BehaviorSubject } from 'rxjs';
import { LoginEvent } from "./login-data";

export interface ILoginService {
  /**
   * Method that takes a Username, Password and returns a HTTP response with an Bearer Auth Token
   * @param username
   * @param password
   */
  loginSyncAndGetToken(username: string, password: string): Observable<HttpResponse<any>>;

  /**
   * Method that takes any username, beater token and returns User Details
   * @param username
   * @param authCode
   */
  getUserDetails(username: string, authCode: string): Observable<LoggedinUser>;
}

export interface ILoginUIService {
  /**
   * Method is a trigger to initiate the "Login" workflow.  Method itself does not return anything.  However, subsequent to login, a BehaviorSubject emits a LoginEvent event indicating "Login Success".
   */
  onLoginInvokeAction(): void;

  /**
   * Method is a trigger to initiate the "Logout" workflow.  Method itself does not return anything.  However, subsequent to logout, a BehaviorSubject emits a LoginEvent event indicating defaultNotLoggedInEventData.
   */
  onLogoutInvokeAction(): void;

  /**
   * loginBehaviorSubject.  
   */
  loginBehaviorSubject: BehaviorSubject<LoginEvent>;
}

export interface IAuthenticatable {
  /**
   * This method returns an Auth Token post-login.  The class that implements this interface is expected to stove away teh token for subsequent Server calls
   * @param authToken
   */
  setAuthCode(authToken: string): boolean;

  /**
   * This call resets teh Auth token - as a result of an explicit Logout action
   */
  resetAuthCode: () => boolean;

  /**
   * This call returns the Auth Token for anyone to use.
   */
  getAuthCode: () => string;
}
